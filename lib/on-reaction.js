const onReaction = (bot, message, trackState, sonosDiscovery) => {
  if (message.item.ts !== trackState.nowPlayingMessageTimestamp) {
    return;
  }
  bot.api.reactions.get(
    {
      timestamp: trackState.nowPlayingMessageTimestamp,
      channel: message.item.channel,
    },
    (error, response) => {
      if (error) {
        throw new Error(error);
      }

      const { message } = response;
      const { reactions } = message;

      // Respect any skin tone without allowing them to be used to vote more
      // than once.
      const userIdsToVoteValues = reactions.reduce((userIdsToVoteValues, reaction) => {
        const isUpvote = /^\+1/.test(reaction.name);
        const isDownvote = /^-1/.test(reaction.name);
        reaction.users.forEach(userId => {
          if (typeof userIdsToVoteValues[userId] === 'number') {
            // Voting more than once results in a neutral vote
            userIdsToVoteValues[userId] = 0;
          }
          else if (isUpvote) {
            userIdsToVoteValues[userId] = 1;
          }
          else if (isDownvote) {
            userIdsToVoteValues[userId] = -1;
          }
        });
        return userIdsToVoteValues;
      }, {});

      const netVote = Object.keys(userIdsToVoteValues).reduce((netVote, userId) => {
        const voteValue = userIdsToVoteValues[userId];
        return netVote + voteValue;
      }, 0);

      trackState.netVote = netVote;

      if (netVote <= (-1 * trackState.downvoteThreshold)) {
        // TODO: announce track change
        console.log(message);
        sonosDiscovery.zones[0].coordinator.nextTrack();
      }
    }
  );
};

module.exports = onReaction;
