module.exports = {
  signature: 'status',
  canBeIssuedPrivately: true,
  description: 'show service, track, and volume info.',
  handler: ({ bot, message, sonosDiscovery, trackState }) => {
    const coordinator = sonosDiscovery.zones[0].coordinator;
    const { playbackState, currentTrack } = coordinator.state;
    const { album, artist, stationName, title } = currentTrack;
    const source = stationName || 'Sonos queue';
    const { netVote, downvoteThreshold } = trackState;

    const response =
`*Playback*
${ playbackState.toLowerCase() }

*Source*
${ source }

*Track*
${ title || '_none_' }

*Artist*
${ artist || '_none_' }

*Album*
${ album || '_none_' }

*Net vote (thumbs up / down)*
${ netVote }

*Downvote threshold*
${ downvoteThreshold }
`;

    bot.reply(message, response);
  }
};
