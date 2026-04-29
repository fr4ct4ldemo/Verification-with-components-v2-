const { EmbedBuilder } = require('discord.js');
const icons = require('../utils/icons');

function buildSuccessEmbed(member, config) {
  const username = member.user.username;
  const avatar = member.user.displayAvatarURL({ dynamic: true, size: 256 });
  return new EmbedBuilder()
    .setColor('#00ff88')
    .setTitle('⌘ 完了 — You\'re Verified!')
    .setDescription(`Welcome ${username}, you now have full access to the server.`)
    .addFields(
      { name: `${icons.magicStar} ◈ 完了 — Access Granted`, value: 'Welcome lounges, announcements, and community channels.', inline: false },
      { name: `${icons.tag} ◈ Start Here`, value: config.start_here_link || 'Use the welcome channel to get started.', inline: false },
      { name: `${icons.messageText} ◈ Introduce Yourself`, value: config.intro_link || 'Share your story in the introductions channel.', inline: false }
    )
    .setThumbnail(avatar)
    .setFooter({ text: 'Fractal  ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildSuccessEmbed };
