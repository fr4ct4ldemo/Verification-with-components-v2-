const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getUserHistory, getGuildConfig } = require('../utils/database');
const { buildErrorEmbed } = require('../components/errorEmbed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-lookup')
    .setDescription('Look up a user verification history')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption((option) => option.setName('user').setDescription('User to lookup').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const config = getGuildConfig(interaction.guildId);
    if (!config) {
      await interaction.reply({ embeds: [buildErrorEmbed('Verification is not configured for this guild.')], ephemeral: true });
      return;
    }

    const history = getUserHistory(interaction.guildId, target.id);
    if (!history) {
      await interaction.reply({ embeds: [buildErrorEmbed('No verification history found for that user.')], ephemeral: true });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setTitle(`✦ Verification Lookup — ${target.tag}`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: 'Verified At', value: history.verified_at ? new Date(history.verified_at).toUTCString() : 'Never', inline: false },
        { name: 'Attempts Taken', value: `${history.attempts_taken || 0}`, inline: true },
        { name: 'Question Answer', value: history.answer || 'N/A', inline: true },
        { name: 'Age Range', value: history.age_range || 'N/A', inline: true },
        { name: 'Whitelist Status', value: history.whitelisted ? 'Yes' : 'No', inline: true },
        { name: 'Blacklist Status', value: history.blacklisted ? 'Yes' : 'No', inline: true },
        { name: 'IP Flag Status', value: history.blacklisted ? 'Flagged' : 'Clean', inline: true }
      )
      .setFooter({ text: 'Fractal  • Verification System' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
