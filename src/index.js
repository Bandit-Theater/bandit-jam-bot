const AudioCommands = require('./audio-commands');
const BreakoutCommands = require('./breakout-commands');
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

  try {
    BreakoutCommands.handleMessage(bot, message);
    TextCommands.handleMessage(bot, message);
    AudioCommands.handleMessage(bot, message);
  } catch {
    await message.channel.send('Oops. Encountered an error. Email kevin@bandittheater.org letting Kevin know this happened.');
  }
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
