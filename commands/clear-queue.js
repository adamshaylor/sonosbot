const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'clear queue',
  canBeIssuedPrivately: false,
  description: 'remove all the songs in the queue.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.clearQueue();
    reactToPromise({ promise, bot, message });
  }
};
