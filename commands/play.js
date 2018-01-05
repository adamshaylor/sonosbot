const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'play',
  description: 'resume playback.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.play();
    reactToPromise({ promise, bot, message });
  }
};
