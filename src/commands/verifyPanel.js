const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig, getVerificationStats } = require('../utils/database');
const { createVerifyPanel } = require('../components/verifyPanel');
const { buildErrorEmbed } = require('../components/errorEmbed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-panel')
    .setDescription('Resend the verification panel to any channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((option) =>
      option.setName('channel').setDescription('Channel to send the panel in').setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const config = getGuildConfig(interaction.guildId);
    if (!config) {
      await interaction.reply({ embeds: [buildErrorEmbed('Verification has not been configured yet.')], ephemeral: true });
      return;
    }

    if (!channel.isTextBased()) {
      await interaction.reply({ embeds: [buildErrorEmbed('Please choose a text channel.')], ephemeral: true });
      return;
    }

    const stats = getVerificationStats(interaction.guildId);
    const panel = createVerifyPanel(interaction.guild, config, stats);
    await channel.send(panel);
    await interaction.reply({ content: 'Verification panel resent successfully.', ephemeral: true });
  }
};
