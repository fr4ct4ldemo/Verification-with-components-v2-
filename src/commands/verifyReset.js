const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { resetUserHistory, getGuildConfig, recordVerificationEvent } = require('../utils/database');
const { buildErrorEmbed } = require('../components/errorEmbed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-reset')
    .setDescription('Reset a user\'s verification data and attempts')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption((option) => option.setName('user').setDescription('User to reset').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const config = getGuildConfig(interaction.guildId);
    if (!config) {
      await interaction.reply({ embeds: [buildErrorEmbed('Verification is not configured for this guild.')], ephemeral: true });
      return;
    }

    resetUserHistory(interaction.guildId, target.id);
    recordVerificationEvent(interaction.guildId, target.id, 'reset', `User reset by ${interaction.user.tag}`);
    await interaction.reply({ content: `Reset verification data for ${target.tag}.`, ephemeral: true });
  }
};
