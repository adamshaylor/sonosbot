const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'repeat on',
  canBeIssuedPrivately: false,
  description: 'turn repeat mode on.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.repeat(true);
    reactToPromise({ promise, bot, message });
  }
};
