module.exports = {
  signature: 'status',
  canBeIssuedInPrivate: true,
  description: 'shows service, track, and volume info',
  handler: ({ bot, message, sonosDiscovery }) => {
    const player = sonosDiscovery.getAnyPlayer();
    const { currentTrack } = player.state;
    const { album, artist, stationName, title } = currentTrack;
    const source = stationName || 'Sonos queue';

    // There should always be a first zone, but don't prevent the other info
    // from showing if there isn't
    let groupVolume;
    try {
      groupVolume = sonosDiscovery.zones[0].coordinator.groupState.volume + '%';
    }
    catch(error) {
      groupVolume = '_unknown_';
    }

    const response =
`*Source*
${source}

*Group volume*
${ groupVolume }

*Track*
${ title }

*Artist*
${ artist }

*Album*
${ album }`;

    // TODO: Add vote stats (up, down, net, threshold)

    bot.reply(message, response);
  }
};
