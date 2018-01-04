// The sonos package uses callback arguments in the reverse order of what
// Bluebird.promisifyAll() expects, so we have to write this utility by hand.

const parseFunction = require('parse-function')({ ecmaVersion: 2017 });

const callbackArgName = 'callback';

const addAsyncVersion = (originalFn, parsedFn, context) => {
  context[originalFn.name + 'Async'] = () => {
    return new Promise((resolve, reject) => {
      const argsArray = Array.from(arguments);
      const indexOfCallback = parsedFn.args.indexOf(callbackArgName);
      const originalCallback = argsArray[indexOfCallback];
      argsArray[indexOfCallback] = (err, data) => {
        originalCallback.apply(context, arguments);
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      };
    });
  };
};

const promisifySonos = sonos => {
  const contexts = [
    sonos,
    sonos.Sonos.prototype,
    sonos.search().constructor.prototype
  ];

  contexts.forEach(context => {
    Object.keys(context).forEach(property => {
      const value = context[property];
      const isFunction = typeof value === 'function';
      const parsedFn = isFunction ? parseFunction.parse(value) : () => null;
      const hasCallback = isFunction ? parsedFn.args.some(arg => arg === callbackArgName) : false;

      if (hasCallback) {
        addAsyncVersion(value, parsedFn, context);
      }
    });
  });
};

module.exports = promisifySonos;
