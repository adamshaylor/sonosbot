module.exports = {
  signature: 'volume',
  description: 'shows group and individual volumes',
  handler: ({ bot, message, sonos }) => {
    let volumes = [
      {
        name: 'Group',
        amount: sonos.zones[0].coordinator.groupState.volume
      }
    ];

    volumes = volumes.concat(sonos.players.map(player => {
      return {
        name: player.roomName,
        amount: player.state.volume
      };
    }));

    const response = volumes.reduce((responses, volume) => {
      return responses.concat(`*${ volume.name }*\n${ volume.amount }%`);
    }, []).join('\n\n');

    bot.reply(message, response);
  }
};
