const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'volume {percent}',
  canBeIssuedPrivately: false,
  description: 'set the group volume to a value of 0 to 100.',
  handler: ({ args, bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.setVolume(args.percent);
    reactToPromise({ promise, bot, message });
  }
};
