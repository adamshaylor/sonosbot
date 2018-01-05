const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'previous',
  description: 'play the previous song in the queue.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const promise = sonosDiscovery.zones[0].coordinator.previousTrack();
    reactToPromise({ promise, bot, message });
  }
};
