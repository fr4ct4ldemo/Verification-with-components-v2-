const { EmbedBuilder } = require('discord.js');
const icons = require('../utils/icons');

function buildStatsEmbed(config, stats, hourly) {
  const hours = hourly.slice(0, 24).map((item) => {
    const bar = '▇'.repeat(Math.min(10, Math.max(1, Math.round(item.count / 2))));
    return `**${item.hour}:00** ${bar} ${item.count}`;
  }).join('\n') || 'No activity data yet.';

  return new EmbedBuilder()
    .setColor('#7289da')
    .setTitle('⌘ 統計 — Verification Statistics')
    .setDescription('A complete summary of your guild verification activity.')
    .addFields(
      { name: `${icons.tickCircle} ◈ Verified Today`, value: `${stats.today}`, inline: true },
      { name: `${icons.calendar} ◈ Verified This Week`, value: `${stats.week}`, inline: true },
      { name: `${icons.global} ◈ Verified All Time`, value: `${stats.allTime}`, inline: true },
      { name: `${icons.closeCircle} ◈ Failed Attempts`, value: `${stats.failed}`, inline: true },
      { name: `${icons.hourglass} ◈ Timeouts Issued`, value: `${stats.timeouts}`, inline: true }
    )
    .addFields({ name: `${icons.clock} ◈ Most Active Hours`, value: hours, inline: false })
    .setFooter({ text: 'Fractal  ｜ 統計システム' })
    .setTimestamp();
}

module.exports = { buildStatsEmbed };
