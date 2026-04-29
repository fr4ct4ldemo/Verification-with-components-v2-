require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { initializeDatabase } = require('./utils/database');
const { startHousekeepingTasks } = require('./utils/cron');
const { info, error } = require('./utils/logger');
const buttonHandler = require('./handlers/buttonHandler');
const modalHandler = require('./handlers/modalHandler');

const requiredEnv = ['TOKEN', 'CLIENT_ID', 'GUILD_ID'];
for (const name of requiredEnv) {
  if (!process.env[name]) {
    error(`Missing environment variable: ${name}`);
    process.exit(1);
  }
}

initializeDatabase();
startHousekeepingTasks();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  if (command.data?.name && command.execute) {
    client.commands.set(command.data.name, command);
  }
}

client.once('ready', () => {
  info(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction, client);
      return;
    }

    if (interaction.isButton()) {
      await buttonHandler.handleButtonInteraction(interaction, client);
      return;
    }

    if (interaction.isModalSubmit()) {
      await modalHandler.handleModalSubmit(interaction, client);
      return;
    }
  } catch (err) {
    error('Interaction processing failed:', err.stack || err);
    if (interaction.replied || interaction.deferred) {
      interaction.followUp({ content: 'An unexpected error occurred.', ephemeral: true }).catch(() => null);
    } else {
      interaction.reply({ content: 'An unexpected error occurred.', ephemeral: true }).catch(() => null);
    }
  }
});

client.login(process.env.TOKEN).catch((err) => {
  error('Failed to login:', err);
  process.exit(1);
});
