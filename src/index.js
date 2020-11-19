const config = require('../config.json');
const Discord = require('discord.js');

const bot = new Discord.Client();

const SOUNDS = {
  't': 'sfx/bell.wav',
  'e': 'sfx/wind.wav',
  's': 'sfx/wind.wav',
  'b': 'sfx/coocoo.wav',
  'tt': 'sfx/double_bell.wav'
};

const TEXT_TO_VOICE_CHANNEL = {
  'the-reader': 'The Reader',
  'swipe-right': 'Swipe Right',
  'the-awkward-show': 'The Awkward Show',
  'the-bat': 'The BAT',
  'bandit-jam': 'Bandit Jam',
  'untitled-new-show': 'Untitled New Show',
  'bot-development': 'Bot Development',
  'the-ocean': 'The Ocean',
};

let activeVoiceConnection;

async function connectToVoiceChannel(channelName) {
  return bot.channels
            .cache.array()
            .filter(channel => channel.type === 'voice' && channel.name === channelName)[0]
            .join();
}

async function playSound(pathToSound) {
  const dispatcher = activeVoiceConnection.play(pathToSound);
  dispatcher.on('start', () => { console.log(`Starting ${pathToSound}`); });
  dispatcher.on('finish', () => { console.log(`Completed ${pathToSound}`); });
  dispatcher.on('error', console.error);
}

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}`);
});

async function messageHandler(message) {
  const sound = SOUNDS[message.content];
  if (!sound) {
    return;
  }

  const voiceChannel = TEXT_TO_VOICE_CHANNEL[message.channel.name];
  if (!activeVoiceConnection || voiceChannel != activeVoiceConnection.channel.name) {
    activeVoiceConnection = await connectToVoiceChannel(voiceChannel);
  }

  playSound(sound);
}
bot.on('message', messageHandler);

bot.login(config.token);
