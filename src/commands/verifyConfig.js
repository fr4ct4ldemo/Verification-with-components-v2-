const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuildConfig, upsertGuildConfig } = require('../utils/database');
const { buildConfigEmbed } = require('../components/configEmbed');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify-config')
    .setDescription('Configure your verification system')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub.setName('set-role').setDescription('Set the verified role').addRoleOption((option) => option.setName('role').setDescription('Verified role').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('set-log').setDescription('Set the log channel').addChannelOption((option) => option.setName('channel').setDescription('Log channel').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('set-rules').setDescription('Update the rules text').addStringOption((option) => option.setName('rules').setDescription('Rules text').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('set-question').setDescription('Set the verification question text').addStringOption((option) => option.setName('question').setDescription('Question text').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('set-attempts').setDescription('Set max verification attempts').addIntegerOption((option) => option.setName('count').setDescription('Attempts between 1 and 5').setRequired(true).setMinValue(1).setMaxValue(5))
    )
    .addSubcommand((sub) =>
      sub.setName('set-timeout').setDescription('Set timeout duration in seconds').addIntegerOption((option) => option.setName('seconds').setDescription('Timeout length').setRequired(true).setMinValue(60))
    )
    .addSubcommand((sub) =>
      sub.setName('set-cooldown').setDescription('Set cooldown between attempts in seconds').addIntegerOption((option) => option.setName('seconds').setDescription('Cooldown length').setRequired(true).setMinValue(5))
    )
    .addSubcommand((sub) =>
      sub.setName('toggle-captcha').setDescription('Enable or disable math captcha mode')
    )
    .addSubcommand((sub) =>
      sub.setName('toggle-dm').setDescription('Enable or disable DM confirmation on verify')
    )
    .addSubcommand((sub) => sub.setName('view').setDescription('Show current verification config')),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ content: 'You need Administrator permission to use this command.', ephemeral: true });
      return;
    }
    const config = getGuildConfig(interaction.guildId) || { guild_id: interaction.guildId };
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case 'set-role': {
        const role = interaction.options.getRole('role');
        config.verified_role_id = role.id;
        break;
      }
      case 'set-log': {
        const channel = interaction.options.getChannel('channel');
        config.log_channel_id = channel.id;
        break;
      }
      case 'set-rules': {
        const rules = interaction.options.getString('rules');
        config.rules_text = rules;
        break;
      }
      case 'set-question': {
        const question = interaction.options.getString('question');
        config.question = question;
        break;
      }
      case 'set-attempts': {
        config.max_attempts = interaction.options.getInteger('count');
        break;
      }
      case 'set-timeout': {
        config.timeout_ms = interaction.options.getInteger('seconds') * 1000;
        break;
      }
      case 'set-cooldown': {
        config.cooldown_ms = interaction.options.getInteger('seconds') * 1000;
        break;
      }
      case 'toggle-captcha': {
        config.captcha_enabled = config.captcha_enabled ? 0 : 1;
        break;
      }
      case 'toggle-dm': {
        config.dm_enabled = config.dm_enabled ? 0 : 1;
        break;
      }
      case 'view': {
        await interaction.reply({ embeds: [buildConfigEmbed(config)], ephemeral: true });
        return;
      }
      default:
        return;
    }

    upsertGuildConfig({
      guild_id: interaction.guildId,
      channel_id: config.channel_id,
      verified_role_id: config.verified_role_id,
      log_channel_id: config.log_channel_id,
      rules_text: config.rules_text,
      question: config.question,
      max_attempts: config.max_attempts ?? 3,
      timeout_ms: config.timeout_ms ?? 600000,
      cooldown_ms: config.cooldown_ms ?? 30000,
      captcha_enabled: config.captcha_enabled ?? 0,
      dm_enabled: config.dm_enabled ?? 0,
      appeal_url: config.appeal_url || 'https://example.com/appeal',
      help_text: config.help_text || 'Ping staff or create a support ticket for help.'
    });

    await interaction.reply({ content: 'Verification configuration updated successfully.', ephemeral: true });
  }
};
