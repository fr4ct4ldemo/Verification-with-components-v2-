const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getUserHistory, upsertUserHistory, getGuildConfig, recordVerificationEvent } = require('../utils/database');
const { buildErrorEmbed } = require('../components/errorEmbed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-blacklist')
    .setDescription('Blacklist a user from verification')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption((option) => option.setName('user').setDescription('User to blacklist').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Reason for blacklisting').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const config = getGuildConfig(interaction.guildId);
    if (!config) {
      await interaction.reply({ embeds: [buildErrorEmbed('Verification is not configured for this guild.')], ephemeral: true });
      return;
    }

    const history = getUserHistory(interaction.guildId, target.id) || {
      guild_id: interaction.guildId,
      user_id: target.id,
      verified_at: null,
      attempts_taken: 0,
      answer: null,
      age_range: null,
      mode: null,
      whitelisted: 0,
      blacklisted: 0,
      last_failed_at: null,
      timeout_until: null
    };
    history.blacklisted = 1;
    upsertUserHistory(history);
    recordVerificationEvent(interaction.guildId, target.id, 'blacklist', `User blacklisted by ${interaction.user.tag}: ${reason}`);
    await interaction.reply({ content: `${target.tag} has been blacklisted from verification.`, ephemeral: true });
  }
};
