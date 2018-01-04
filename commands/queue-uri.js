const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'queue {uri}',
  description: 'adds a URI (e.g. spotify:track:7H8xq3lcxbuJJji5rbmc9g) to the queue',
  handler: ({ args, bot, message, sonosDevice }) => {
    const promise = sonosDevice.queueAsync(args.uri, 0);
    reactToPromise({ promise, bot, message });
  }
};
