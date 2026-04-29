const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

function buildTimeoutEmbed(durationSeconds) {
  return new EmbedBuilder()
    .setColor('#ff3c3c')
    .setTitle('⌘ 警告 — Timeout Issued')
    .setDescription(`Too many failed attempts triggered a timeout for **${ms(durationSeconds * 1000)}**.`)
    .setFooter({ text: 'Fractal  ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildTimeoutEmbed };
