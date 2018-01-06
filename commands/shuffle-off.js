const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'shuffle off',
  canBeIssuedPrivately: false,
  description: 'turn shuffle mode off.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.shuffle(false);
    reactToPromise({ promise, bot, message });
  }
};
