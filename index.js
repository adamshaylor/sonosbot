const Botkit = require('botkit');

// These two Sonos libraries provide some overlapping functionality, but there's
// enough divergence to warrant them both.
const sonosDiscovery = new (require('sonos-discovery'))();
const sonos = require('sonos');

const parseCommandArgs = require('./lib/parse-command-args.js');

const helpCommand = {
  signature: 'help',
  canBeIssuedInPrivate: true,
  description: 'list sonosbot commands.',
  handler: ({ bot, message }) => {
    const commandDescriptions = commands.map(command => {
      return `@${ bot.identity.name } *${ command.signature }*—${ command.description }`;
    });

    const response = [ `Here’s what I can do:\n` ]
      .concat(commandDescriptions)
      .concat(`\nMost of these commands have to be issued in the #${ process.env.SONOSBOT_SLACK_CHANNEL } channel.`)
      .join('\n');

    bot.whisper(message, response);
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
  require('./commands/play.js'),
  require('./commands/pause.js'),
  require('./commands/stop.js'),
  require('./commands/next.js'),
  require('./commands/previous.js'),
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

// TODO: Update channel topic whenever the currently playing song changes.

// TODO: group all the players into a single zone on connect and periodically
// thereafter.

// TODO: handle all connection errors and automatically reconnect.

sonos.search(sonosDevice => {
  commands.forEach(command => {
    const { signature, handler } = command;
    const signatureArgRegExp = /\{\w+\}/g;
    const messageArgRegExp = /(?:\S+|".+")/;
    const pattern = new RegExp(`^${ signature.replace(signatureArgRegExp, messageArgRegExp.source) }$`, 'ig');
    // TODO: make contexts conditional on canBeIssuedInPrivate and enforce which
    // channel to listen in.
    const contexts = 'direct_mention,direct_message';

    const callback = (bot, message) => {
      const args = parseCommandArgs(message.text, signature);
      handler({
        args,
        bot,
        controller,
        message,
        sonosDevice,
        sonosDiscovery
      });
    };

    controller.hears([ pattern ], contexts, callback);
  });
});
