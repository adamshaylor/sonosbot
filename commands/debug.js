const os = require('os');

module.exports = {
  signature: 'debug',
  canBeIssuedPrivately: true,
  contexts: [ 'direct_mention', 'direct_message' ],
  description: 'show debugging info.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const sonosBotEnv = Object.keys(process.env).reduce((sonosBotEnv, envVar) => {
      if (/^SONOSBOT_/.test(envVar)) {
        sonosBotEnv[envVar] = process.env[envVar];
      }
      return sonosBotEnv;
    }, {});

    const response =
`*sonosbot host address*
node hostname: \`${ os.hostname() }\`
sonos-discovery origin: \`${ sonosDiscovery.localEndpoint }\`

*node environment variables*
\`${ JSON.stringify(sonosBotEnv) }\``;

    bot.reply(message, response);
  }
};
