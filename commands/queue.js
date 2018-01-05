const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'queue',
  canBeIssuedPrivately: false,
  description: 'list the contents of the queue.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const uploadQueueToChannel = queue => {
      const content = queue.map((song, index) => {
        const position = index + 1;
        return `${ position }. “${ song.title }” by “${ song.artist || 'unknown artist' }” from “${ song.album ||  'unknown album' }”`;
      }).join('\n');

      return new Promise((resolve, reject) => {
        const callback = (error, data) => error ? reject(error) : resolve(data);
        bot.api.files.upload({ channels: message.channel, content }, callback);
      });
    };

    const react = error => {
      const promise = Promise.reject(error);
      reactToPromise({ promise: promise, bot, message });
    };

    sonosDiscovery.zones[0].coordinator
      .getQueue()
      .then(uploadQueueToChannel)
      .catch(react);
  }
};
