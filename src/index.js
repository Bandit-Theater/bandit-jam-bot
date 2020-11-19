const AudioCommands = require('./audio-commands');
const config = require('../config.json');
const Discord = require('discord.js');
const TextCommands = require('./text-commands');

const bot = new Discord.Client({ autoReconnect: true });

async function logError(error) {
  console.error(error);
}
bot.on('error', logError);

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}`);
});

async function messageHandler(message) {
  TextCommands.handleMessage(bot, message);
  AudioCommands.handleMessage(bot, message);
}
bot.on('message', messageHandler);

bot.login(config.token);
