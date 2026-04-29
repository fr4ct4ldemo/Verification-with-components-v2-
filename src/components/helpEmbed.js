const { EmbedBuilder } = require('discord.js');
const icons = require('../utils/icons');

function buildHelpEmbed(config) {
  return new EmbedBuilder()
    .setColor('#faa61a')
    .setTitle(`${icons.messageQ} ⌘ 確認 — Need Help Verifying?`)
    .setDescription('認証 ⟢ Follow these steps to complete verification and gain access.')
    .addFields(
      { name: '◈ 1. Click Verify Me', value: 'This opens the verification modal.', inline: false },
      { name: '◈ 2. Answer the questions', value: 'Enter the requested information and type AGREE when asked.', inline: false },
      { name: '◈ 3. Receive your role', value: 'If successful, you will gain access immediately.', inline: false },
      { name: '◈ Still stuck?', value: config.help_text || 'Reach out to staff or create a support ticket.', inline: false }
    )
    .setFooter({ text: 'Fractal  ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildHelpEmbed };
