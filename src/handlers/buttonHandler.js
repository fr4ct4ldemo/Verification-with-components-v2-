const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { getGuildConfig, getUserHistory, upsertUserHistory, recordVerificationEvent } = require('../utils/database');
const { isOnCooldown, getRemainingCooldown, setCooldown, setCaptchaAnswer } = require('../utils/cooldown');
const {
  buildErrorEmbed,
  buildRulesEmbed,
  buildHelpEmbed,
  buildAlreadyVerifiedEmbed,
  buildBlacklistEmbed,
  buildLockedEmbed,
  buildCooldownEmbed,
  buildSuccessEmbed,
  buildLogEmbed
} = require('../components');

function generateMathQuestion() {
  const a = Math.floor(Math.random() * 20) + 5;
  const b = Math.floor(Math.random() * 20) + 5;
  return { question: `What is ${a} + ${b}?`, answer: `${a + b}` };
}

async function handleVerifyButton(interaction, config) {
  const userId = interaction.user.id;
  const history = getUserHistory(interaction.guildId, userId) || { attempts_taken: 0, whitelisted: 0, blacklisted: 0 };
  const roleId = config.verified_role_id;
  const member = await interaction.guild.members.fetch(userId);

  if (history.blacklisted) {
    recordVerificationEvent(interaction.guildId, userId, 'blacklist_attempt', 'Blocked user attempted verification');
    await interaction.reply({ embeds: [buildBlacklistEmbed()], ephemeral: true });
    return;
  }

  if (member.roles.cache.has(roleId)) {
    await interaction.reply({ embeds: [buildAlreadyVerifiedEmbed()], ephemeral: true });
    return;
  }

  if (history.whitelisted) {
    await member.roles.add(roleId, 'Auto-verified via whitelist').catch(() => null);
    const successEmbed = buildSuccessEmbed(member, config);
    recordVerificationEvent(interaction.guildId, userId, 'whitelist_auto_verify', 'Whitelisted user auto verified');
    upsertUserHistory({
      guild_id: interaction.guildId,
      user_id: userId,
      verified_at: Date.now(),
      attempts_taken: history.attempts_taken || 0,
      answer: null,
      age_range: null,
      mode: 'whitelist',
      whitelisted: 1,
      blacklisted: 0,
      last_failed_at: null,
      timeout_until: null
    });
    await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    return;
  }

  if (isOnCooldown(interaction.guildId, userId)) {
    const remaining = Math.ceil(getRemainingCooldown(interaction.guildId, userId) / 1000);
    await interaction.reply({ embeds: [buildCooldownEmbed(remaining)], ephemeral: true });
    return;
  }

  if (history.attempts_taken >= config.max_attempts) {
    await interaction.reply({ embeds: [buildLockedEmbed(config.max_attempts)], ephemeral: true });
    return;
  }

  const modal = new ModalBuilder().setCustomId('verify_modal').setTitle('✦ Fractal  Verification');
  let questionInput = new TextInputBuilder()
    .setCustomId('question_input')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setPlaceholder('Required response');

  const agreeInput = new TextInputBuilder()
    .setCustomId('agree_input')
    .setLabel('Type AGREE to confirm you read the rules')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setPlaceholder('AGREE');

  if (config.captcha_enabled) {
    const math = generateMathQuestion();
    questionInput = questionInput.setLabel(math.question).setPlaceholder('Enter the sum');
    setCaptchaAnswer(interaction.guildId, userId, math.answer, 5 * 60 * 1000);
  } else {
    questionInput = questionInput.setLabel(config.question || 'Type AGREE to confirm you read the rules').setPlaceholder('AGREE');
  }

  modal.addComponents(
    new ActionRowBuilder().addComponents(questionInput),
    new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId('source_input')
        .setLabel('How did you find our server?')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder('Optional response')
    ),
    new ActionRowBuilder().addComponents(
      config.captcha_enabled ? agreeInput : new TextInputBuilder()
        .setCustomId('age_input')
        .setLabel('Your age range')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder('13-17 / 18+ / Prefer not to say')
    )
  );

  await interaction.showModal(modal);
}

async function handleButtonInteraction(interaction) {
  const config = getGuildConfig(interaction.guildId);
  if (!config) {
    await interaction.reply({ embeds: [buildErrorEmbed('Verification has not been configured yet.')], ephemeral: true });
    return;
  }

  if (interaction.customId === 'verify_button') {
    await handleVerifyButton(interaction, config);
    return;
  }

  if (interaction.customId === 'read_rules_button') {
    await interaction.reply({ embeds: [buildRulesEmbed(config)], ephemeral: true });
    return;
  }

  if (interaction.customId === 'help_button') {
    await interaction.reply({ embeds: [buildHelpEmbed(config)], ephemeral: true });
    return;
  }
}

module.exports = { handleButtonInteraction };
