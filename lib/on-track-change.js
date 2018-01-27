const onTrackChange = (newTrack, trackState, bot, channel) => {
  const { artist, title } = newTrack;
  bot.say(
    {
      channel: channel.id,
      text: `Now playing *${ title || '_none_' }* by *${ artist || '_none_' }*`
    },
    (error, response) => {
      if (error) {
        throw new Error(error);
      }
      trackState.nowPlayingMessageTimestamp = response.ts;
    }
  );
};

module.exports = onTrackChange;
