const { getGuildConfig, getUserHistory, upsertUserHistory, recordVerificationEvent } = require('../utils/database');
const { setCooldown, getCaptchaAnswer } = require('../utils/cooldown');
const {
  buildSuccessEmbed,
  buildErrorEmbed,
  buildFailureEmbed,
  buildTimeoutEmbed,
  buildLogEmbed
} = require('../components');

async function handleModalSubmit(interaction) {
  if (interaction.customId !== 'verify_modal') return;

  const config = getGuildConfig(interaction.guildId);
  if (!config) {
    await interaction.reply({ embeds: [buildErrorEmbed('Verification configuration cannot be found.')], ephemeral: true });
    return;
  }

  const history = getUserHistory(interaction.guildId, interaction.user.id) || { attempts_taken: 0, whitelisted: 0, blacklisted: 0 };
  const userInput = interaction.fields.getTextInputValue('question_input');
  const sourceInput = (() => {
    try {
      return interaction.fields.getTextInputValue('source_input') || 'Not provided';
    } catch {
      return 'Not provided';
    }
  })();
  const ageInput = (() => {
    try {
      return config.captcha_enabled ? 'Not provided' : interaction.fields.getTextInputValue('age_input') || 'Not provided';
    } catch {
      return 'Not provided';
    }
  })();
  const member = await interaction.guild.members.fetch(interaction.user.id);
  const role = await interaction.guild.roles.fetch(config.verified_role_id).catch(() => null);
  const logChannel = await interaction.guild.channels.fetch(config.log_channel_id).catch(() => null);

  const normalized = userInput.trim().toUpperCase();
  let passed = false;
  let detail = '';

  if (config.captcha_enabled) {
    const expected = getCaptchaAnswer(interaction.guildId, interaction.user.id);
    const agreeText = (() => {
      try {
        return interaction.fields.getTextInputValue('agree_input')?.trim().toUpperCase();
      } catch {
        return '';
      }
    })();
    if (!expected) {
      detail = 'Captcha answer expired or missing.';
    } else if (normalized !== expected.toUpperCase()) {
      detail = 'Math captcha answer was incorrect.';
    } else if (agreeText !== 'AGREE') {
      detail = 'Agreement phrase was not typed correctly.';
    } else {
      passed = true;
    }
  } else {
    if (normalized !== 'AGREE') {
      detail = 'Agreement phrase was not typed correctly.';
    } else {
      passed = true;
    }
  }

  if (!passed) {
    const attempts = (history.attempts_taken || 0) + 1;
    setCooldown(interaction.guildId, interaction.user.id, config.cooldown_ms || 30000);
    upsertUserHistory({
      guild_id: interaction.guildId,
      user_id: interaction.user.id,
      verified_at: history.verified_at || null,
      attempts_taken: attempts,
      answer: sourceInput,
      age_range: ageInput,
      mode: config.captcha_enabled ? 'captcha' : 'agreement',
      whitelisted: history.whitelisted || 0,
      blacklisted: history.blacklisted || 0,
      last_failed_at: Date.now(),
      timeout_until: history.timeout_until || null
    });

    recordVerificationEvent(interaction.guildId, interaction.user.id, 'fail', detail);
    if (attempts >= (config.max_attempts || 3)) {
      const timeoutMs = config.timeout_ms || 600000;
      await member.timeout(timeoutMs, 'Exceeded verification attempt limit').catch(() => null);
      recordVerificationEvent(interaction.guildId, interaction.user.id, 'timeout', 'User timed out after max failed verification attempts');
      if (logChannel?.isTextBased()) {
        logChannel.send({ embeds: [buildLogEmbed({ event: 'timeout', user: interaction.user, attempts, detail })] }).catch(() => null);
      }
      await interaction.reply({ embeds: [buildTimeoutEmbed(timeoutMs / 1000)], ephemeral: true });
      return;
    }

    await interaction.reply({ embeds: [buildFailureEmbed(detail, attempts, config.max_attempts || 3)], ephemeral: true });
    if (logChannel?.isTextBased()) {
      logChannel.send({ embeds: [buildLogEmbed({ event: 'fail', user: interaction.user, attempts, detail })] }).catch(() => null);
    }
    return;
  }

  const totalAttempts = (history.attempts_taken || 0) + 1;
  if (role && !member.roles.cache.has(role.id)) {
    await member.roles.add(role, 'Verified through Fractal  verification').catch(() => null);
  }

  upsertUserHistory({
    guild_id: interaction.guildId,
    user_id: interaction.user.id,
    verified_at: Date.now(),
    attempts_taken: totalAttempts,
    answer: sourceInput,
    age_range: ageInput,
    mode: config.captcha_enabled ? 'captcha' : 'agreement',
    whitelisted: history.whitelisted || 0,
    blacklisted: history.blacklisted || 0,
    last_failed_at: null,
    timeout_until: null
  });

  recordVerificationEvent(interaction.guildId, interaction.user.id, 'success', `Verified with ${totalAttempts} attempt(s)`);

  if (config.dm_enabled) {
    member.user.send({ embeds: [buildSuccessEmbed(member, config)] }).catch(() => null);
  }

  await interaction.reply({ embeds: [buildSuccessEmbed(member, config)], ephemeral: true });
  if (logChannel?.isTextBased()) {
    logChannel.send({ embeds: [buildLogEmbed({ event: 'success', user: interaction.user, attempts: totalAttempts, detail: 'User verified successfully' })] }).catch(() => null);
  }
}

module.exports = { handleModalSubmit };
