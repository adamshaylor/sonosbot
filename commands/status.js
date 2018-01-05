module.exports = {
  signature: 'status',
  canBeIssuedPrivately: true,
  description: 'show service, track, and volume info.',
  handler: ({ bot, message, sonosDiscovery }) => {
    const player = sonosDiscovery.getAnyPlayer();
    const { currentTrack } = player.state;
    const { album, artist, stationName, title } = currentTrack;
    const source = stationName || 'Sonos queue';

    const response =
`*Source*
${source}

*Track*
${ title || '_none_' }

*Artist*
${ artist || '_none_' }

*Album*
${ album || '_none_' }`;

    // TODO: Add vote stats (up, down, net, threshold)

    bot.reply(message, response);
  }
};
