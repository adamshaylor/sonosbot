const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'volume {percent}',
  description: 'sets the group volume to a value of 0 to 100',
  handler: ({ args, bot, message, sonos }) => {
    const promise = sonos.zones[0].coordinator.setVolume(args.percent);
    reactToPromise({ promise, bot, message });
  }
};
