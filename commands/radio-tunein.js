const createTuneInMetadata = require('../lib/create-tunein-metadata.js');
const reactToPromise = require('../lib/react-to-promise.js');

module.exports = {
  signature: 'radio tunein {id}',
  canBeIssuedPrivately: false,
  description: 'play a radio station on TuneIn (e.g. `KMHD-891-s34028`).',
  handler: ({ args, bot, message, sonosDiscovery }) => {
    if (!sonosDiscovery.availableServices.TuneIn) {
      const promise = Promise.reject('TuneIn service not available');
      reactToPromise({ promise, bot, message });
      return;
    }
    const { id, type } = sonosDiscovery.availableServices.TuneIn;
    const sonosUri = `x-sonosapi-stream:s${ args.id }?sid=${ id }`;
    const metadata = createTuneInMetadata(args.id, type);

    const promise = sonosDiscovery.zones[0].coordinator
      .setAVTransport(sonosUri, metadata)
      .then(() => sonosDiscovery.zones[0].coordinator.play());

    reactToPromise({ promise, bot, message });
  }
};
