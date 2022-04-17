// Commands for the management of breakout rooms

const BREAKOUT_CATEGORY_NAME = 'Breakout Rooms';
const STAFF_ROLE_NAME = 'Bandit Staff';
const TEXT_CHANNEL_PREFIX = 'breakout-';
const VOICE_CHANNEL_PREFIX = 'Breakout voice chat ';

// Ensure ALPHABET always has MAX_BREAKOUTS letters
const MAX_BREAKOUTS = 10;
const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const HELP_INFO = `
\:palm_tree: Breakouts are temporary voice and text channels automatically managed by *yours truly*.

Post **breakout create** \`<n>\` to create some breakout channels. \`<n>\` must be a number between 1 and ${MAX_BREAKOUTS}. I'll give all of your breakouts a one-letter name like "breakout-a".

Post **breakout delete** \`<letter>\` to delete a breakout channel. \`<letter>\` should be the one-letter name I gave your channel (like "c" for "breakout-c").

Post **breakout delete all** to delete all breakout channels.

Post **bot help** to get the regular jambot commands. \:heart:
`;

function clamp(x, minVal, maxVal) {
  return Math.min(maxVal, Math.max(minVal, x));
}

function makeUnique(values) {
  return [... new Set(values)];
}

function authorizedForBreakouts(message) {
  return message.member.roles.cache.filter(role => role.name === STAFF_ROLE_NAME).size === 1;
}

function getChannelNames(bot, type) {
  return bot.channels.cache.filter(channel => channel.type === type).map(channel => channel.name);
}

function getCurrentBreakouts(bot) {
  return bot.channels.cache.filter((channel) => {
    return channel.name.toLowerCase().startsWith('breakout') &&
        (channel.type === 'text' || channel.type === 'voice');
  });
}

function getBreakoutCategory(message) {
  return message.guild.channels.cache.filter((channel) => {
    return channel.type === 'category' && channel.name === BREAKOUT_CATEGORY_NAME;
  }).first();
}

function getAvailableNames(currentBreakouts) {
  let available = ALPHABET;
  const currentNames = currentBreakouts.map(channel => channel.name);

  currentNames.forEach((name) => {
    const letter = name[name.length - 1];
    const index = available.indexOf(letter);

    if (index !== -1) {
      available.splice(index, 1);
    }
  });

  return available;
}

async function createOrGetBreakoutCategory(message) {
  const channel = getBreakoutCategory(message);

  if (channel !== undefined) {
    return channel;
  }

  return await message.guild.channels.create(BREAKOUT_CATEGORY_NAME, {
    type: 'category'
  });
}

async function createTypedBreakouts(message, category, channelType, channelNameBase, names, numToMake) {
  for (let i = 0; i < numToMake; i++) {
    const name = names[i] || i;

    const channel = await message.guild.channels.create(`${channelNameBase}${name}`, {
      type: channelType,
      topic: `Breakout room ${name}`
    });

    await channel.setParent(category);
  }
}

async function createTextBreakouts(message, category, names, requestedBreakouts) {
  return await createTypedBreakouts(message, category, 'text', TEXT_CHANNEL_PREFIX, names, requestedBreakouts);
}

async function createVoiceBreakouts(message, category, names, requestedBreakouts) {
  return await createTypedBreakouts(message, category, 'voice', VOICE_CHANNEL_PREFIX, names, requestedBreakouts);
}

async function createBreakouts(bot, message, args) {
  if (args.length === 0) {
    await message.channel.send('Please provide the number of breakout channels you\'d like me to make.');
    return;
  }

  const requestedBreakouts = parseInt(args[0]);

  if (isNaN(requestedBreakouts)) {
    await message.channel.send(`Sorry, I don't know what number "${args[0]}" is.`);
    return;
  }

  if (requestedBreakouts <= 0) {
    await message.channel.send('Sorry, I don\'t know how to make fewer than one channel.');
    return;
  }

  const currentBreakouts = getCurrentBreakouts(bot);
  const numCurrentTextBreakouts = currentBreakouts.filter(channel => channel.type === 'text').size;
  const numCurrentVoiceBreakouts = currentBreakouts.filter(channel => channel.type === 'voice').size;
  const numBreakouts = Math.max(numCurrentTextBreakouts, numCurrentVoiceBreakouts);

  if (requestedBreakouts + numBreakouts > MAX_BREAKOUTS) {
    let error = `Sorry, I can only make up to ${MAX_BREAKOUTS} channels.`;

    if (numBreakouts > 0) {
      const maxRequest = MAX_BREAKOUTS - numBreakouts;
      error += ` ${numBreakouts} already exist, so the most you can request is ${maxRequest}.`
    }

    await message.channel.send(error);
    return;
  }

  await message.channel.send('Okay! Working on it...');

  const names = getAvailableNames(currentBreakouts);

  const breakoutCategory = await createOrGetBreakoutCategory(message);
  await createTextBreakouts(message, breakoutCategory, names, requestedBreakouts);
  await createVoiceBreakouts(message, breakoutCategory, names, requestedBreakouts);

  await message.channel.send('Done!');
}

async function deleteNamedBreakout(bot, message, letter) {
  const toDelete = getCurrentBreakouts(bot).filter(channel => channel.name.toLowerCase().endsWith(letter));

  if (toDelete.size === 0) {
    await message.channel.send(`Sorry, couldn\'t find a breakout with ID "${letter}".`);
    return;
  }

  for (const channel of toDelete.values()) {
    await channel.delete();
  }
}

async function deleteBreakoutCategory(message) {
  const channel = getBreakoutCategory(message);

  if (channel === undefined) {
    return;
  }

  await channel.delete();
}

async function deleteBreakouts(bot, message, args) {
  if (args.length === 0) {
    await message.channel.send('Please provide either the letter ID of the channel you\'d like deleted (or "all").');
    return;
  }

  await message.channel.send('Okay! Working on it...');

  let names = args;

  if (args[0] === 'all') {
    names = getCurrentBreakouts(bot).map((channel) => {
      return channel.name[channel.name.length - 1].toLowerCase();
    });

    names = makeUnique(names);
  }

  for (let i = 0; i < names.length; i++) {
    await deleteNamedBreakout(bot, message, names[i].toLowerCase());
  }

  if (getCurrentBreakouts(bot).size === 0) {
    await deleteBreakoutCategory(message);
  }

  await message.channel.send('Done!');
}

exports.handleMessage = async function(bot, message) {
  const messageString = message.content.toLowerCase();

  if (!messageString.startsWith('breakout')) {
    return;
  }

  if (!authorizedForBreakouts(message)) {
    await message.channel.send('Sorry, only Bandit staff are authorized to configure breakouts.');
    return;
  }

  const args = messageString.split(' ');

  if (args.length < 2) {
    await message.channel.send('Hm? Did you want something? (Try "breakout help" for more info.)');
    return;
  }

  const command = args[1];

  if (command === 'help') {
    message.channel.send(HELP_INFO);
    return;
  }

  if (command === 'create') {
    await createBreakouts(bot, message, args.slice(2));
    return;
  }

  if (command === 'delete') {
    await deleteBreakouts(bot, message, args.slice(2));
    return;
  }

  await message.channel.send(`Sorry, I don't know what "${command}" means. Try "breakout help" for a list of commands.`);
}
