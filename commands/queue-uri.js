const createSpotifyMetadata = require('../lib/create-spotify-metadata.js');
const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'queue {uri}',
  canBeIssuedPrivately: false,
  description: 'add a URI (e.g. `spotify:track:7H8xq3lcxbuJJji5rbmc9g` or `spotify:album:79xgGrSQ9070fGJf0ipwb8`) to the queue.',
  handler: ({ args, bot, message, sonosDiscovery }) => {
    if (!sonosDiscovery.availableServices.Spotify) {
      const promise = Promise.reject('Spotify service not available');
      reactToPromise({ promise, bot, message });
      return;
    }
    const encodedSpotifyUri = encodeURIComponent(args.uri);
    const { id, type } = sonosDiscovery.availableServices.Spotify;
    const isTrack = args.uri.startsWith('spotify:track:');
    let sonosUri;
    if (isTrack) {
      sonosUri = `x-sonos-spotify:${ encodedSpotifyUri }?sid=${ id }`;
    }
    else {
      // https://github.com/jishi/node-sonos-http-api/blob/e23a6aa55692274114116b308d0db562e69d09a7/lib/actions/spotify.js#L22
      sonosUri = `x-rincon-cpcontainer:0006206c${ encodedSpotifyUri }`;
    }
    const metadata = createSpotifyMetadata(encodedSpotifyUri, type);
    const promise = sonosDiscovery.zones[0].coordinator.addURIToQueue(sonosUri, metadata);
    reactToPromise({ promise, bot, message });
  }
};
