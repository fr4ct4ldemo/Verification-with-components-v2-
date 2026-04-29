const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getVerificationStats, getHourlyActivity, getGuildConfig } = require('../utils/database');
const { buildStatsEmbed } = require('../components/statsEmbed');
const { buildErrorEmbed } = require('../components/errorEmbed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-stats')
    .setDescription('Show verification statistics for this guild')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guildId);
    if (!config) {
      await interaction.reply({ embeds: [buildErrorEmbed('Verification is not configured for this guild.')], ephemeral: true });
      return;
    }
    const stats = getVerificationStats(interaction.guildId);
    const hourly = getHourlyActivity(interaction.guildId);
    await interaction.reply({ embeds: [buildStatsEmbed(config, stats, hourly)], ephemeral: true });
  }
};
