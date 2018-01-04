const Botkit = require('botkit');

// These two Sonos libraries provide some overlapping functionality, but there's
// enough divergence to warrant them both.
const sonosDiscovery = new (require('sonos-discovery'))();
const sonos = require('sonos');

const parseCommandArgs = require('./lib/parse-command-args.js');

const helpCommand = {
  signature: 'help',
  canBeIssuedInPrivate: true,
  description: 'lists sonosbot commands',
  handler: ({ bot, message }) => {
    const commandDescriptions = commands.map(command => {
      return `@${ bot.identity.name } *${ command.signature }*—${ command.description }`;
    });

    const response = [ `Hello. I’m @${ bot.identity.name }, the Sonos DJ. Here’s what I can do:` ]
      .concat(commandDescriptions)
      .concat(`Most of these commands have to be issued in the #${ process.env.SONOSBOT_SLACK_CHANNEL } channel.`)
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

// TODO: reconnect Slack and Sonos if either connection is interrupted.

sonos.search(sonosDevice => {
  commands.forEach(command => {
    const { signature, handler } = command;
    const signatureArgRegExp = /\{\w+\}/g;
    const messageArgRegExp = /(?:(?:\w+)|(?:"[\w\s]+"))/;
    const pattern = `^${ signature.replace(signatureArgRegExp, messageArgRegExp.source) }$`;
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
