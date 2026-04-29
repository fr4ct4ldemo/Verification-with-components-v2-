const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

function buildConfigEmbed(config) {
  return new EmbedBuilder()
    .setColor('#2f3136')
    .setTitle('⌘ 設定 — Verification Configuration')
    .addFields(
      { name: '◈ Verified Role', value: config.verified_role_id ? `<@&${config.verified_role_id}>` : 'Not set', inline: true },
      { name: '◈ Log Channel', value: config.log_channel_id ? `<#${config.log_channel_id}>` : 'Not set', inline: true },
      { name: '◈ Captcha Mode', value: config.captcha_enabled ? 'Enabled' : 'Disabled', inline: true },
      { name: '◈ DM Notifications', value: config.dm_enabled ? 'Enabled' : 'Disabled', inline: true },
      { name: '◈ Rules Text', value: config.rules_text ? config.rules_text.substring(0, 100) + (config.rules_text.length > 100 ? '...' : '') : 'Not set', inline: false },
      { name: '◈ Verification Question', value: config.question || 'Type AGREE to confirm you read the rules', inline: false },
      { name: '◈ Max Attempts', value: `${config.max_attempts}`, inline: true },
      { name: '◈ Timeout Duration', value: config.timeout_ms ? ms(config.timeout_ms) : 'Not set', inline: true },
      { name: '◈ Cooldown', value: config.cooldown_ms ? ms(config.cooldown_ms) : 'Not set', inline: true },
      { name: '◈ Appeal URL', value: config.appeal_url || 'Not set', inline: false }
    )
    .setFooter({ text: 'Fractal  ｜ 設定 ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildConfigEmbed };
