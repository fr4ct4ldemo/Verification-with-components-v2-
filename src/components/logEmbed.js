const { EmbedBuilder } = require('discord.js');

function buildLogEmbed({ event, user, attempts, detail }) {
  const color = event === 'success' ? '#00ff88' : event === 'timeout' ? '#ff9900' : '#ff3c3c';
  const title = event === 'success' ? '⌘ 完了 — User Verified' : event === 'timeout' ? '⌘ 待機 — Verification Timeout' : '⌘ 失敗 — Verification Attempt Failed';

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
    .addFields(
      { name: '◈ User Tag', value: user.tag, inline: true },
      { name: '◈ User ID', value: user.id, inline: true },
      { name: '◈ Result', value: event === 'success' ? 'Pass' : event === 'timeout' ? 'Timeout' : 'Fail', inline: true },
      { name: '◈ Attempts', value: `${attempts}`, inline: true }
    )
    .setFooter({ text: 'Fractal  ｜ 認証ログ' })
    .setTimestamp();

  if (detail) {
    embed.addFields({ name: 'Details', value: detail, inline: false });
  }

  return embed;
}

module.exports = { buildLogEmbed };
