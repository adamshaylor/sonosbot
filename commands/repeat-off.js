const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'repeat off',
  canBeIssuedPrivately: false,
  description: 'turn repeat mode off.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.repeat(false);
    reactToPromise({ promise, bot, message });
  }
};
