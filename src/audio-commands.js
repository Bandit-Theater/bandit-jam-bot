const TEXT_TO_VOICE_CHANNEL = {
  'the-reader': 'The Reader',
  'swipe-right': 'Swipe Right',
  'the-awkward-show': 'The Awkward Show',
  'the-bat': 'The BAT',
  'bandit-jam': 'Bandit Jam',
  'untitled-new-show': 'Untitled New Show',
  'bot-development': 'Bot Development',
  'the-ocean': 'The Ocean'
}

const SOUNDS = {
  't': 'sfx/bell.wav',
  'tt': 'sfx/double_bell.wav',
  'e': 'sfx/wind.wav',
  's': 'sfx/wind.wav',
  'b': 'sfx/coocoo.wav'
}

let activeVoiceConnection;

async function connectToVoiceChannel(bot, channelName) {
  return bot.channels
          .cache.array()
          .filter(channel => channel.type === 'voice' && channel.name === channelName)[0]
          .join();
}

async function logError(error) {
  console.error(error);
}

async function playSound(pathToSound) {
  const dispatcher = activeVoiceConnection.play(pathToSound);
  dispatcher.on('start', () => { console.log(`Starting ${pathToSound}`); });
  dispatcher.on('finish', () => { console.log(`Completed ${pathToSound}`); });
  dispatcher.on('error', logError);
}

exports.handleMessage = async function(bot, message) {
  const sound = SOUNDS[message.content.toLowerCase()];

  if (!sound) {
    return;
  }

  const voiceChannel = TEXT_TO_VOICE_CHANNEL[message.channel.name];
  if (!activeVoiceConnection || voiceChannel != activeVoiceConnection.channel.name) {
    activeVoiceConnection = await connectToVoiceChannel(bot, voiceChannel);
  }

  playSound(sound);
}
