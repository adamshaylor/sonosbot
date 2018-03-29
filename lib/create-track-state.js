const createTrackState = (sonosDiscovery, downvoteThresholdArg) => {
  let nowPlayingMessageTimestamp = '';
  let currentTrack = {};
  let netVote = 0;
  const trackChangeCallbacks = [() => netVote = 0];

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
      const isTrack = Boolean(newTrack.duration);
      const trackIsNew = isTrack && !trackIsEqual(newTrack, currentTrack);
      if (trackIsNew) {
        currentTrack = newTrack;
        trackChangeCallbacks.forEach(callback => callback(currentTrack));
      }
    };
    updateCurrentTrack();
    // Resort to polling as listening to events like 'last-change' doesn't
    // appear to do anything.
    setInterval(updateCurrentTrack, 200);
  });

  return {
    get currentTrack() {
      return Object.assign({}, currentTrack);
    },
    onTrackChange(callback) {
      trackChangeCallbacks.push(callback);
    },
    get nowPlayingMessageTimestamp() {
      return nowPlayingMessageTimestamp;
    },
    set nowPlayingMessageTimestamp(newTimestamp) {
      nowPlayingMessageTimestamp = newTimestamp;
    },
    get netVote() {
      return netVote;
    },
    set netVote(newNetVote) {
      netVote = newNetVote;
    },
    get downvoteThreshold() {
      return downvoteThresholdArg;
    }
  };
};

module.exports = createTrackState;
