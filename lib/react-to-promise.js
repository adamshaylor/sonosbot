const reactToPromise = ({ promise, bot, message }) => {
  promise.then(() => {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'white_check_mark'
    });
  });

  promise.catch(error => {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'warning'
    });
    console.error(error);
  });
};

module.exports = reactToPromise;
