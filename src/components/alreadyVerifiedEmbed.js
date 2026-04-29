const { EmbedBuilder } = require('discord.js');

function buildAlreadyVerifiedEmbed() {
  return new EmbedBuilder()
    .setColor('#00ff88')
    .setTitle('⌘ 完了 — Already Verified')
    .setDescription('You already have the verified role. Enjoy your access!')
    .setFooter({ text: 'Fractal  ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildAlreadyVerifiedEmbed };
