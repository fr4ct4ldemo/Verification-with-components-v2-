const { EmbedBuilder } = require('discord.js');
const icons = require('../utils/icons');

function buildRulesEmbed(config) {
  const rules = (config.rules_text || 'No rules configured yet.')
    .split('\n')
    .map((line, index) => `**${index + 1}.** ${line.trim()}`)
    .join('\n');

  return new EmbedBuilder()
    .setColor('#5865f2')
    .setTitle(`${icons.documentText} ⌘ 規則 — Fractal  Official Rules`)
    .setDescription(rules)
    .addFields({ name: '◈ By verifying you agree to all rules above', value: 'Please follow them to keep the community safe.' })
    .setFooter({ text: 'Fractal  ｜ 規則 ｜ 認証システム' })
    .setTimestamp();
}

module.exports = { buildRulesEmbed };
