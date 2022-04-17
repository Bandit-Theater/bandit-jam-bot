const AudioCommands = require('./audio-commands');
const config = require('../config.json');
const Discord = require('discord.js');
const TextCommands = require('./text-commands');

let rebootResponseChannel;

async function logError(error) {
  console.error(error);
}

async function logReady(bot) {
  if (rebootResponseChannel) {
    await bot.channels.cache.get(rebootResponseChannel).send("... done. Ready to go!");
    rebootResponseChannel = undefined;
    return;
  }

  console.log(`Logged in as ${bot.user.tag}`);
}

async function messageHandler(bot, message) {
  if (message.content.toLowerCase() === 'reboot jambot') {
    await message.channel.send("Okay! Rebooting...");
    rebootResponseChannel = message.channel.id;

    AudioCommands.clearActiveVoiceConnection();
    bot.destroy();
    bot = createBot();
    return;
  }

  TextCommands.handleMessage(bot, message);
  AudioCommands.handleMessage(bot, message);
}

function createBot() {
  const bot = new Discord.Client({ autoReconnect: true });

  bot.on('error', logError);
  bot.on('ready', () => { logReady(bot); });
  bot.on('message', (message) => { messageHandler(bot, message); });

  bot.login(config.token);

  return bot;
}

const jambot = createBot();
