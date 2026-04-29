require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const { info, error } = require('./utils/logger');

const requiredEnv = ['TOKEN', 'CLIENT_ID', 'GUILD_ID'];
for (const name of requiredEnv) {
  if (!process.env[name]) {
    error(`Missing environment variable: ${name}`);
    process.exit(1);
  }
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  if (command.data?.toJSON) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    info('Deploying application commands...');
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
    info('Commands registered successfully.');
  } catch (err) {
    error('Failed to deploy commands:', err);
    process.exit(1);
  }
})();
