const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'next',
  description: 'skip to the next song.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.nextTrack();
    reactToPromise({ promise, bot, message });
  }
};
