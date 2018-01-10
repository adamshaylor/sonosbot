const createTrackState = sonosDiscovery => {
  let currentTrack = {};
  const callbacks = [];

  // The uri stays the same for radios regardless of track
  const trackIsEqual = (trackA, trackB) => {
    const propertyIsEqual = property => trackA[property] === trackB[property];
    return [
      'title',
      'artist',
      'album'
    ].every(propertyIsEqual);
  };

  // Treat a topology-change event as a ready event
  sonosDiscovery.once('topology-change', () => {
    const updateCurrentTrack = () => {
      const newTrack = sonosDiscovery.zones[0].coordinator.state.currentTrack;
      if (!trackIsEqual(newTrack, currentTrack)) {
        currentTrack = newTrack;
        callbacks.forEach(callback => callback(currentTrack));
      }
    };
    updateCurrentTrack();
    // Resort to polling as listening to events like 'last-change' doesn't
    // appear to do anything.
    setInterval(updateCurrentTrack, 200);
  });


  const getCurrentTrack = () => Object.assign({}, currentTrack);

  const onTrackChange = callback => {
    callbacks.push(callback);
  };

  return {
    getCurrentTrack,
    onTrackChange
  };
};

module.exports = createTrackState;
