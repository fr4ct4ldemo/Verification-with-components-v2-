const { EmbedBuilder } = require('discord.js');

function buildBlacklistEmbed() {
  return new EmbedBuilder()
    .setColor('#ff3c3c')
    .setTitle('⌘ 封鎖 — Verification Blocked')
    .setDescription('You are currently blocked from verifying. If you believe this is a mistake, contact staff.')
    .setFooter({ text: 'Fractal  ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildBlacklistEmbed };
