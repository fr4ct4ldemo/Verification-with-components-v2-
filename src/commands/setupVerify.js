const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { createVerifyPanel } = require('../components/verifyPanel');
const { getGuildConfig, upsertGuildConfig, getVerificationStats } = require('../utils/database');
const { buildErrorEmbed } = require('../components/errorEmbed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-verify')
    .setDescription('Send the advanced verification panel and save verification configuration')
    .addChannelOption((option) =>
      option.setName('channel').setDescription('Channel to send the verification panel in').setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName('verified_role').setDescription('Role to assign after verification').setRequired(true)
    )
    .addChannelOption((option) =>
      option.setName('log_channel').setDescription('Channel for verification logs').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('rules_text').setDescription('Rules text displayed in the verification panel').setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.editReply({ content: 'You need Administrator permission to use this command.' });
      return;
    }
    const channel = interaction.options.getChannel('channel');
    const verifiedRole = interaction.options.getRole('verified_role');
    const logChannel = interaction.options.getChannel('log_channel');
    const rulesText = interaction.options.getString('rules_text');

    if (!channel.isTextBased()) {
      await interaction.editReply({ embeds: [buildErrorEmbed('Please choose a text channel for the verification panel.')] });
      return;
    }

    const config = getGuildConfig(interaction.guildId) || {};
    const newConfig = {
      guild_id: interaction.guildId,
      channel_id: channel.id,
      verified_role_id: verifiedRole.id,
      log_channel_id: logChannel.id,
      rules_text: rulesText,
      question: config.question || 'Type AGREE to confirm you read the rules',
      max_attempts: config.max_attempts || 3,
      timeout_ms: config.timeout_ms || 600000,
      cooldown_ms: config.cooldown_ms || 30000,
      captcha_enabled: config.captcha_enabled || 0,
      dm_enabled: config.dm_enabled || 0,
      appeal_url: config.appeal_url || 'https://example.com/appeal',
      help_text: config.help_text || 'Ping staff or create a support ticket for help.'
    };

    upsertGuildConfig(newConfig);
    const stats = getVerificationStats(interaction.guildId);
    const panel = createVerifyPanel(interaction.guild, newConfig, stats);

    await channel.send(panel);

    // ensure guild channels are cached before iterating
    await interaction.guild.channels.fetch();

    const verifyCategory = channel.parent;
    const everyoneRole = interaction.guild.roles.everyone;
    const botMember = await interaction.guild.members.fetchMe();
    const canManage = botMember.permissions.has(PermissionFlagsBits.ManageChannels) &&
                      botMember.permissions.has(PermissionFlagsBits.ManageRoles);

    if (canManage) {
      for (const [, cat] of interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory)) {
        if (verifyCategory && cat.id === verifyCategory.id) continue;
        try {
          await cat.permissionOverwrites.edit(everyoneRole, { ViewChannel: false });
          await cat.permissionOverwrites.edit(verifiedRole, { ViewChannel: true });
        } catch (err) {
          console.error(`Failed to update permissions for category ${cat.name}:`, err);
        }
      }
    } else {
      console.warn('Bot is missing ManageChannels or ManageRoles permission — skipping category lock.');
    }

    await interaction.editReply({ content: 'Verification panel sent and configuration saved successfully.' });
  }
};
