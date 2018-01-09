const Botkit = require('botkit');
const sonosDiscovery = new (require('sonos-discovery'))();
const parseCommandArgs = require('./lib/parse-command-args.js');

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
controller.spawn({ token }).startRTM();

// TODO: group all the players into a single zone on connect and periodically
// thereafter.

// TODO: handle all connection errors and automatically reconnect.

commands.forEach(command => {
  const { signature, handler } = command;
  const signatureArgRegExp = /\{\w+\}/g;
  const messageArgRegExp = /(?:\S+|".+")/;
  const pattern = new RegExp(`^${ signature.replace(signatureArgRegExp, messageArgRegExp.source) }$`, 'ig');
  // TODO: make contexts conditional on canBeIssuedInPrivate and enforce which
  // channel to listen in.
  const contexts = [
    'direct_mention',
    'direct_message'
  ];

  const callback = (bot, message) => {
    const args = parseCommandArgs(message.text, signature);
    handler({
      args,
      bot,
      controller,
      message,
      sonosDiscovery
    });
  };
  controller.hears([ pattern ], contexts, callback);
});

// Treat the first topology-change event as a ready event
sonosDiscovery.once('topology-change', () => {
  console.log('topology-change event fired. Setting up last-change listener.');
  // We know last-change events are being fired because setting a breakpoint on
  // the emit() works, we just don’t know where the emitter lives. Wherever it
  // is, it isn't here.
  sonosDiscovery.zones[0].coordinator.on('last-change', function onLastChange() {
    console.log('last-change arguments:', arguments);
    console.log('last-change this:', this);
    // TODO: Post track updates and listen for reactions
  });
});

controller.on('reaction_added', (bot, message) => {
  bot.api.reactions.get({
    timestamp: message.item.ts,
    channel: message.item.channel,
  }, (error, response) => {
    if (error) {
      console.error('reactions.get() error:', error);
    }
    else {
      console.log('reactions.get() response:', response);
    }
  });
});
