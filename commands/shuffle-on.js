const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'shuffle on',
  canBeIssuedPrivately: false,
  description: 'turn shuffle mode on.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.shuffle(true);
    reactToPromise({ promise, bot, message });
  }
};
