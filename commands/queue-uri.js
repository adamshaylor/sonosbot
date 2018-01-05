const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'queue {uri}',
  description: 'add a URI (e.g. `spotify:track:7H8xq3lcxbuJJji5rbmc9g`) to the queue.',
  handler: ({ args, bot, message, sonosDiscovery/*, sonosDevice*/ }) => {
    // TODO: Both of these result in 500 errors. Why?
    const promise = sonosDiscovery.zones[0].coordinator.addURIToQueue(args.uri);
    reactToPromise({ promise, bot, message });

    // sonosDevice.queue(args.uri, 0, error => {
    //   const promise = error ? Promise.reject(error) : Promise.resolve();
    //   reactToPromise({ promise, bot, message });
    // });
  }
};
