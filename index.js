const Botkit = require('botkit');
const SonosDiscovery = require('sonos-discovery');
const createTrackState = require('./lib/create-track-state.js');
const parseCommandArgs = require('./lib/parse-command-args.js');
const onTrackChange = require('./lib/on-track-change.js');
const onReaction = require('./lib/on-reaction.js');

const helpCommand = {
  signature: 'help',
  canBeIssuedPrivately: true,
  description: 'list sonosbot commands.',
  handler: ({ bot, message }) => {
    const commandDescriptions = commands.map(command => {
      return `@${ bot.identity.name } *${ command.signature }*—${ command.description }`;
    });

    const response = [ `Here’s what I can do:\n` ]
      .concat(commandDescriptions)
      .concat(`\nCommands that affect what’s playing on the Sonos have to be issued in the #${ process.env.SONOSBOT_SLACK_CHANNEL } channel for me to respond to them. (No secret pirate DJs, please.) You can send some commands (like *help*) to me as a direct message.`)
      .join('\n');

    bot.reply(message, response);
  }
};

const commands = [
  helpCommand,
  require('./commands/status.js'),
  require('./commands/volume.js'),
  require('./commands/volume-percent.js'),
  require('./commands/volume-room-percent.js'),
  require('./commands/queue.js'),
  require('./commands/queue-uri.js'),
  require('./commands/clear-queue.js'),
  require('./commands/play.js'),
  require('./commands/pause.js'),
  require('./commands/stop.js'),
  require('./commands/next.js'),
  require('./commands/previous.js'),
  require('./commands/radio-spotify.js'),
  require('./commands/radio-tunein.js'),
  require('./commands/shuffle-on.js'),
  require('./commands/shuffle-off.js'),
  require('./commands/repeat-on.js'),
  require('./commands/repeat-off.js'),
  require('./commands/debug.js')
];

const envRequirements = [
  'SONOSBOT_SLACK_TOKEN',
  'SONOSBOT_SLACK_CHANNEL',
  'SONOSBOT_DOWNVOTE_THRESHOLD'
];

envRequirements.forEach(envVar => {
  if (typeof process.env[envVar] !== 'string') {
    console.error(`Please set ${ envVar } environment variable`);
    process.exit(1);
  }
});

const controller = Botkit.slackbot({ debug: JSON.parse(process.env.SONOSBOT_DEBUG || 'false') });
const token = process.env.SONOSBOT_SLACK_TOKEN;

const botPromise = new Promise((resolve, reject) => {
  controller
    .spawn({ token })
    .startRTM((error, bot) => error ? reject(error) : resolve(bot));
});

const channelsPromise = botPromise.then(bot => {
  return new Promise((resolve, reject) => {
    bot.api.channels.list({}, (error, response) => error ? reject(error) : resolve(response.channels));
  });
});

const groupsPromise = botPromise.then(bot => {
  return new Promise((resolve, reject) => {
    bot.api.groups.list({}, (error, response) => error ? reject(error) : resolve(response.groups));
  });
});

const channelPromise = Promise.all([ channelsPromise, groupsPromise ]).then(([ channels, groups ]) => {
  const { SONOSBOT_SLACK_CHANNEL } = process.env;
  const matchingChannel = channels.find(channel => channel.name === SONOSBOT_SLACK_CHANNEL);
  const matchingGroup = groups.find(group => group.name === SONOSBOT_SLACK_CHANNEL);
  return matchingChannel || matchingGroup || Promise.reject(`Channel "${ process.env.SONOSBOT_SLACK_CHANNEL }" not found`);
});

// TODO: either a) group all the players into a single zone on connect and
// periodically thereafter, or b) require a zone name as an env variable.

let sonosDiscovery;
let trackState;
const connectSonos = () => {
  sonosDiscovery = new SonosDiscovery();

  sonosDiscovery.on('dead', () => {
    console.log('Sonos connection died. Attempting to reconnect with a new SonosDiscovery instance...');
    connectSonos();
  });

  const { SONOSBOT_DOWNVOTE_THRESHOLD } = process.env;
  trackState = createTrackState(sonosDiscovery, SONOSBOT_DOWNVOTE_THRESHOLD);
  trackState.onTrackChange(newTrack => {
    Promise.all([ botPromise, channelPromise ]).then(([ bot, channel ]) => {
      onTrackChange(newTrack, trackState, bot, channel);
    });
  });
};
connectSonos();

commands.forEach(command => {
  const { signature, handler, canBeIssuedPrivately } = command;
  const signatureArgRegExp = /\{\w+\}/g;
  const messageArgRegExp = /(?:\S+|".+")/;
  const pattern = new RegExp(`^${ signature.replace(signatureArgRegExp, messageArgRegExp.source) }$`, 'ig');

  const contexts = canBeIssuedPrivately ?
    [ 'direct_mention', 'direct_message' ] :
    [ 'direct_mention' ];

  const callback = (bot, message) => {
    const args = parseCommandArgs(message.text, signature);
    handler({
      args,
      bot,
      controller,
      message,
      sonosDiscovery,
      trackState
    });
  };
  controller.hears([ pattern ], contexts, callback);
});

controller.on(['reaction_added', 'reaction_removed'], (bot, message) => {
  onReaction(bot, message, trackState, sonosDiscovery);
});

controller.on('rtm_close', bot => {
  const reconnectRtm = () => {
    console.log('Slack RTM disconnected. Attempting to reconnect...');
    bot.startRTM(error => {
      if (error) {
        setTimeout(reconnectRtm, 10000);
      }
    });
  };
  reconnectRtm();
});
