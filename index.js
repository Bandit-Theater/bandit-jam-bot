const config = require('./config.json');
const Discord = require('discord.js');

const bot = new Discord.Client();

let voiceChannelConnection;

const SOUNDS = {
  't': 'sfx/bell.wav',
  'e': 'sfx/wind.wav',
  'b': 'sfx/coocoo.wav',
};

function getBatChannel() {
  return bot.channels
            .cache.array()
            .filter(channel => channel.type === 'voice' && channel.name === 'The BAT')[0];
}

async function connectToBatChannel() {
  return getBatChannel().join();
}

async function playSound(pathToSound) {
  const dispatcher = voiceChannelConnection.play(pathToSound);
  dispatcher.on('start', () => { console.log(`Starting ${pathToSound}`); });
  dispatcher.on('finish', () => { console.log(`Completed ${pathToSound}`); });
  dispatcher.on('error', console.error);
}

async function readyHandler() {
  console.log(`Logged in as ${bot.user.tag}`);
  voiceChannelConnection = await connectToBatChannel();
}
bot.on('ready', readyHandler);

bot.on('message', (message) => {
  if (message.channel.name !== 'the-bat') {
    return;
  }

  let sound = SOUNDS[message.content];
  if (sound) {
    playSound(sound);
  }
});

bot.login(config.token);