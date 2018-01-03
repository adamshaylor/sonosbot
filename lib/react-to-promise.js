const reactToPromise = ({ promise, bot, message }) => {
  promise.then(() => {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'white_check_mark'
    });
  });

  promise.catch(() => {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'warning'
    });
  });
};

module.exports = reactToPromise;
