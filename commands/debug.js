const os = require('os');

module.exports = {
  signature: 'debug',
  contexts: [ 'direct_mention', 'direct_message' ],
  description: 'shows debugging info',
  handler: ({ bot, message, sonos }) => {
    const sonosBotEnv = Object.keys(process.env).reduce((sonosBotEnv, envVar) => {
      if (/^SONOSBOT_/.test(envVar)) {
        sonosBotEnv[envVar] = process.env[envVar];
      }
      return sonosBotEnv;
    }, {});

    const response =
`*Bot host address*
\`${ os.hostname() }\`

*Origin address to Sonos*
\`${ sonos.localEndpoint }\`

*Environment variables*
\`${ JSON.stringify(sonosBotEnv) }\``;

    bot.reply(message, response);
  }
};
