const os = require('os');

module.exports = {
  signature: 'debug',
  contexts: [ 'direct_mention', 'direct_message' ],
  description: 'shows debugging info',
  handler: ({ bot, message, sonosDevice, sonosDiscovery }) => {
    const sonosBotEnv = Object.keys(process.env).reduce((sonosBotEnv, envVar) => {
      if (/^SONOSBOT_/.test(envVar)) {
        sonosBotEnv[envVar] = process.env[envVar];
      }
      return sonosBotEnv;
    }, {});

    const response =
`*sonos device address*
\`${ sonosDevice.host }\`

*sonosbot host address*
node hostname: \`${ os.hostname() }\`
sonos-discovery origin: \`${ sonosDiscovery.localEndpoint }\`

*node environment variables*
\`${ JSON.stringify(sonosBotEnv) }\``;

    bot.reply(message, response);
  }
};
