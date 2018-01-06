const createSpotifyMetadata = require('../lib/create-spotify-metadata.js');
const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'radio spotify {uri}',
  canBeIssuedPrivately: false,
  description: 'play a radio station on Spotify (e.g. `spotify:artist:2pAWfrd7WFF3XhVt9GooDL`).',
  handler: ({ args, bot, message, sonosDiscovery }) => {
    if (!sonosDiscovery.availableServices.Spotify) {
      const promise = Promise.reject('Spotify service not available');
      reactToPromise({ promise, bot, message });
      return;
    }
    const encodedSpotifyUri = encodeURIComponent(args.uri);
    const { id, type } = sonosDiscovery.availableServices.Spotify;
    const sonosUri = `x-sonosapi-stream:s${ encodedSpotifyUri }?sid=${ id }`;
    const metadata = createSpotifyMetadata(encodedSpotifyUri, type);

    const promise = sonosDiscovery.zones[0].coordinator
      .setAVTransport(sonosUri, metadata)
      .then(() => sonosDiscovery.zones[0].coordinator.play());

    reactToPromise({ promise, bot, message });
  }
};
