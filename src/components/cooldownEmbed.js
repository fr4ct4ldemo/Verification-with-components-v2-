const { EmbedBuilder } = require('discord.js');
const ms = require('ms');
const icons = require('../utils/icons');

function buildCooldownEmbed(seconds) {
  const bar = icons.hourglass.repeat(Math.max(1, Math.min(5, Math.ceil(seconds / 6))));
  return new EmbedBuilder()
    .setColor('#ffcc00')
    .setTitle('⌘ 待機 — Verification Cooldown')
    .setDescription(`Please wait **${ms(seconds * 1000)}** before trying again.`)
    .addFields({ name: '◈ 待機 — Please hold on', value: `${bar} ${seconds}s remaining`, inline: false })
    .setFooter({ text: 'Fractal  ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildCooldownEmbed };
