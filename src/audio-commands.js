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
  'b': 'sfx/coocoo.wav',
  'w': {
    'steps': 'sfx/footsteps.wav',
    'phone': 'sfx/retro_phone.wav',
    'knock': 'sfx/knock.wav',
  }
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

/**
 * Given an array of string paths like ['w', 'knock'], returns the sound
 * file name by looking up in the sound map.
 */
function getSoundFromPath(path, soundmap = SOUNDS) {
  if (path.length === 0) {
    return null; // If we ran out of path parts, don't play a sound here
  }
  const entry = soundmap[path[0]];

  if (typeof entry === 'string') {
    // This is a valid sound, return it even if there are more parts in the path
    return entry;
  } else if (typeof entry === 'object') {
    // There are possibly more sound options down this path
    return getSoundFromPath(path.slice(1), entry);
  }
}

exports.handleMessage = async function(bot, message) {
  const cmd = message.content.toLowerCase();
  const sound = getSoundFromPath(cmd.split(' '));

  if (!sound) {
    return;
  }

  const voiceChannel = TEXT_TO_VOICE_CHANNEL[message.channel.name];
  if (!activeVoiceConnection || voiceChannel != activeVoiceConnection.channel.name) {
    activeVoiceConnection = await connectToVoiceChannel(bot, voiceChannel);
  }

  playSound(sound);
}

exports.getSupportedWalkOnSounds = function() {
  return Object.keys(SOUNDS['w']).join(', ');
}