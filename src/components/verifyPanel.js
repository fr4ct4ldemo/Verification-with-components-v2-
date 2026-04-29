const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');
const icons = require('../utils/icons');

function createVerifyPanel(guild, config, stats) {
  const icon = guild.iconURL({ dynamic: true, size: 256 });
  const rules = (config.rules_text || '1. Be respectful.\n2. No spam.\n3. Follow staff guidance.')
    .split('\n')
    .map((line) => `• ${line.trim()}`)
    .join('\n');
  const level = config.captcha_enabled ? 'High' : config.max_attempts >= 4 ? 'Medium' : 'Low';

  const heroEmbed = new EmbedBuilder()
    .setColor('#0d0d0d')
    .setTitle('⌘ FRACTAL  確認')
    .setDescription('認証 ⟢ Complete verification to gain full server access and unlock exclusive channels.\n\n' + icons.magicStar + ' **Click verify to confirm you are human and agree to the rules.**')
    .setThumbnail(icon)
    .addFields(
      { name: `${icons.clipboard} ◈ 規則 — Server Rules`, value: rules || 'No rules configured.', inline: false },
      { name: `${icons.tickCircle} ◈ 確認 — How To Verify`, value: '1. ' + icons.hourglass + ' Click **Verify Me**\n2. ' + icons.messageText + ' Answer the verification modal\n3. ' + icons.global + ' Enjoy full access', inline: false },
      { name: `${icons.closeCircle} ◈ ※ 警告 — Important`, value: 'Breaking rules may result in timeout or blacklist.', inline: false },
      { name: `${icons.clock} ◈ 時間 — Estimated Time`, value: 'Less than 1 minute', inline: false }
    )
    .setFooter({ text: 'Fractal  ｜ 確認システム ｜ Powered by Fractal Bot' })
    .setTimestamp();

  const statsEmbed = new EmbedBuilder()
    .setColor('#1a1a1a')
    .addFields(
      { name: `${icons.people} ◈ Total Members`, value: `${guild.memberCount}`, inline: true },
      { name: `${icons.tickCircle} ◈ Verified Today`, value: `${stats.today ?? 0}`, inline: true },
      { name: `${icons.shieldTick} ◈ 安全 — Security Level`, value: level, inline: true }
    );

  return {
    embeds: [heroEmbed, statsEmbed],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('verify_button')
          .setLabel('確認 › Verify Me')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('read_rules_button')
          .setLabel('Read Rules')
          .setStyle(ButtonStyle.Secondary)
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('help_button')
          .setLabel('Need Help')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel('Appeal Ban')
          .setStyle(ButtonStyle.Link)
          .setURL(config.appeal_url || 'https://example.com/appeal')
      )
    ]
  };
}

module.exports = { createVerifyPanel };
