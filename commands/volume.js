module.exports = {
  signature: 'volume',
  canBeIssuedPrivately: true,
  description: 'show group and individual volumes.',
  handler: ({ bot, message, sonosDiscovery }) => {
    let volumes = [
      {
        name: 'Group',
        amount: sonosDiscovery.zones[0].coordinator.groupState.volume
      }
    ];

    volumes = volumes.concat(sonosDiscovery.players.map(player => {
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
