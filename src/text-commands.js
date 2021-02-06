const DICTIONARY = require('./dictionary.json');
const audio = require('./audio-commands.js');

BOT_INSTRUCTIONS = `
\:wave: Hi! I'm a bot that plays sound effects for your scene edits! \:robot:

Type one of my commands in a text channel and I'll join the corresponding voice channel. (Except for "general")

Here's the commands I know:
  - **t**: tag out
  - **tt**: double tag out
  - **e**: edit
  - **s**: swipe (the same as **e**)
  - **b**: blackout
  - **w**: walk on (with sounds: ${audio.getSupportedWalkOnSounds()}, e.g. w knock)

I can also provide suggestions, just type **suggie**.

If it looks like I've gone to sleep, type **u up** and I'll check in with you.

If you'd like to help contribute new features, check out <https://github.com/Bandit-Theater/bandit-jam-bot> \:tada:
`;

WAKE_UP_TEXT = ["Sorry, I was napping", "I'm here!", "Yes, And"];

function randomSample(collection) {
  const index = Math.floor(Math.random() * collection.length);
  return collection[index];
}

function wakeUpText() {
  return randomSample(WAKE_UP_TEXT);
}

function generateSuggestion() {
  return randomSample(DICTIONARY.words);
}

const TEXTS = {
  'u up': wakeUpText,
  'u up?': wakeUpText,
  'suggy': generateSuggestion,
  'suggestion': generateSuggestion,
  'suggie': generateSuggestion,
  'hot suggy': generateSuggestion,
  'hot suggie': generateSuggestion,
  'hot hot suggie': 'pineapple',
  'hot hot suggy': 'pineapple',
  'jambot?': BOT_INSTRUCTIONS,
  'jam bot?': BOT_INSTRUCTIONS,
  'bot?': BOT_INSTRUCTIONS,
  'bot help': BOT_INSTRUCTIONS,
};

exports.handleMessage = function(bot, message) {
  const text = TEXTS[message.content.toLowerCase()];

  if (!text) {
    return;
  }

  if (typeof text == 'function') {
    message.channel.send(text());
  } else {
    message.channel.send(text);
  }
}
