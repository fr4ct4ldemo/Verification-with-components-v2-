const { EmbedBuilder } = require('discord.js');

function buildErrorEmbed(message) {
  return new EmbedBuilder()
    .setColor('#ff3c3c')
    .setTitle('⌘ 失敗 — Verification Failed')
    .setDescription(message)
    .setFooter({ text: 'Fractal  ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildErrorEmbed };
