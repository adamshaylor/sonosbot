const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'volume {room} {percent}',
  description: 'sets the volume for a room (in quotes for multiple words) to a value of 0 to 100',
  handler: ({ args, bot, message, sonos }) => {
    const lowerCaseRoom = args.room.toLowerCase();
    const player = sonos.players.find(player => player.roomName.toLowerCase() === lowerCaseRoom);

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
