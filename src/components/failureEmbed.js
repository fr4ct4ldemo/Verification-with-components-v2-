const { EmbedBuilder } = require('discord.js');
const icons = require('../utils/icons');

function buildFailureEmbed(reason, attempts, maxAttempts) {
  const filled = icons.closeCircle.repeat(Math.min(attempts, maxAttempts));
  const empty = '⬜'.repeat(Math.max(0, maxAttempts - attempts));
  return new EmbedBuilder()
    .setColor('#ff3c3c')
    .setTitle('⌘ 失敗 — Verification Failed')
    .setDescription(reason)
    .addFields({ name: '◈ 試行 — Attempts', value: `${filled}${empty} (${attempts}/${maxAttempts})`, inline: false })
    .setFooter({ text: 'Fractal  ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildFailureEmbed };
