const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'queue',
  description: 'list the contents of the queue.',
  handler: ({ bot, message, sonosDiscovery /*, sonosDevice*/ }) => {
    const respond = queue => {
      const response = queue.map((song, index) => {
        const position = index + 1;
        return `${ position }. _${ song.title }_ by _${ song.artist }_ from _${ song.album }_`;
      }).join('\n');
      bot.reply(message, response);
    };

    const react = error => {
      const promise = Promise.reject(error);
      reactToPromise({ promise: promise, bot, message });
    };

    sonosDiscovery.zones[0].coordinator.getQueue()
      .then(respond)
      .catch(react);

    // Using sonosDevice should also work, but it's plagued by this error:
    // https://github.com/bencevans/node-sonos/issues/182
    //
    // sonosDevice.getQueue((error, queue) => {
    //   if (error) {
    //     const promise = Promise.reject(error);
    //     reactToPromise({ promise, bot, message });
    //     return;
    //   }
    //
    //   const response = queue.items.map((song, index) => {
    //     const position = index + 1;
    //     return `${ position }. _${ song.title }_ by _${ song.artist }_ from _${ song.album }_`;
    //   }).join('\n');
    //
    //   bot.reply(message, response);
    // });
  }
};
