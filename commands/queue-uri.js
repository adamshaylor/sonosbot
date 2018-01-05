const createSpotifyMetadata = require('../lib/create-spotify-metadata.js');
const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'queue {uri}',
  canBeIssuedPrivately: false,
  description: 'add a URI (e.g. `spotify:track:7H8xq3lcxbuJJji5rbmc9g`) to the queue.',
  handler: ({ args, bot, message, sonosDiscovery }) => {
    if (!sonosDiscovery.availableServices.Spotify) {
      const promise = Promise.reject('Spotify service not available');
      reactToPromise({ promise, bot, message });
      return;
    }
    const encodedSpotifyUri = encodeURIComponent(args.uri);
    const { id, type } = sonosDiscovery.availableServices.Spotify;
    const sonosUri = `x-sonos-spotify:${ encodedSpotifyUri }?sid=${ id }`;
    const metadata = createSpotifyMetadata(encodedSpotifyUri, type);
    const promise = sonosDiscovery.zones[0].coordinator.addURIToQueue(sonosUri, metadata);
    reactToPromise({ promise, bot, message });
  }
};
