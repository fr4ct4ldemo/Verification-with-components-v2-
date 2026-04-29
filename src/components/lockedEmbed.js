const { EmbedBuilder } = require('discord.js');

function buildLockedEmbed(maxAttempts) {
  return new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle('⌘ 封鎖 — Verification Locked')
    .setDescription(`You have reached the verification attempt limit of **${maxAttempts}**. Please wait for a staff review or try again later.`)
    .setFooter({ text: 'Fractal  ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildLockedEmbed };
