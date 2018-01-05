const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'volume {room} {percent}',
  canBeIssuedPrivately: false,
  description: 'set the volume for a room (in quotes for multiple words) to a value of 0 to 100.',
  handler: ({ args, bot, message, sonosDiscovery }) => {
    const lowerCaseRoom = args.room.toLowerCase();
    const player = sonosDiscovery.players.find(player => player.roomName.toLowerCase() === lowerCaseRoom);
    let promise;
    if (player) {
      promise = player.setVolume(args.percent);
    }
    else {
      promise = Promise.reject('No matching player');
    }
    reactToPromise({ promise, bot, message });
  }
};
