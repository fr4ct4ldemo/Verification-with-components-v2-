const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig } = require('../utils/database');
const { buildErrorEmbed } = require('../components/errorEmbed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unverify')
    .setDescription('Remove verified role from a user and log the action')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((option) => option.setName('user').setDescription('User to unverify').setRequired(true))
    .addStringOption((option) => option.setName('reason').setDescription('Reason for unverification').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const config = getGuildConfig(interaction.guildId);
    if (!config || !config.verified_role_id) {
      await interaction.reply({ embeds: [buildErrorEmbed('Verified role is not configured.')], ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ embeds: [buildErrorEmbed('User could not be fetched from this guild.')], ephemeral: true });
      return;
    }

    if (!member.roles.cache.has(config.verified_role_id)) {
      await interaction.reply({ content: `${target.tag} does not currently have the verified role.`, ephemeral: true });
      return;
    }

    await member.roles.remove(config.verified_role_id, `Unverified by ${interaction.user.tag} | ${reason}`).catch(() => null);
    await interaction.reply({ content: `${target.tag} has been unverified. Reason: ${reason}`, ephemeral: true });

    const logChannel = interaction.guild.channels.cache.get(config.log_channel_id);
    if (logChannel?.isTextBased()) {
      logChannel.send({ embeds: [
        {
          color: 0xff9900,
          title: '✦ User Unverified',
          description: `${target.tag} was unverified by ${interaction.user.tag}.`,
          fields: [
            { name: 'Reason', value: reason, inline: false }
          ],
          footer: { text: 'Fractal  • Verification System' },
          timestamp: new Date()
        }
      ] }).catch(() => null);
    }
  }
};
