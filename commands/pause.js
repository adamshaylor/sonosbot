const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'pause',
  canBeIssuedPrivately: false,
  description: 'suspend playback.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.pause();
    reactToPromise({ promise, bot, message });
  }
};
