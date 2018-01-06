const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'stop',
  canBeIssuedPrivately: false,
  description: 'stop playback and reset the queue position to the beginning.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.stop();
    reactToPromise({ promise, bot, message });
  }
};
