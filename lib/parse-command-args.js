const parseCommandArgs = (message, commandSignature) => {
  const whitespaceRegExp = /\s+/g;
  const quoteRegExp = /"/g;
  const signatureTerms = commandSignature.split(whitespaceRegExp);

  const accumulateQuotedTerms = (messageTerms, unparsedTerm) => {
    const prevTerm = messageTerms[messageTerms.length - 1] || '';
    const startsWithQuoteRegExp = /^"/;
    const endsWithQuoteRegExp = /"$/;
    if (startsWithQuoteRegExp.test(prevTerm) && !endsWithQuoteRegExp.test(prevTerm)) {
      messageTerms[messageTerms.length - 1] = `${ messageTerms[messageTerms.length - 1] } ${ unparsedTerm }`;
    }
    else {
      messageTerms.push(unparsedTerm);
    }
    return messageTerms;
  };

  const messageTerms = message.split(whitespaceRegExp)
    .reduce(accumulateQuotedTerms, [])
    .map(term => term.replace(quoteRegExp, ''));

  return messageTerms.reduce((args, messageTerm, termIndex) => {
    const signatureTerm = signatureTerms[termIndex] || '';
    const argSignifierRegExp = /[{}]/g;
    const isArg = argSignifierRegExp.test(signatureTerm);
    if (isArg) {
      const argName = signatureTerm.replace(argSignifierRegExp, '');
      args[argName] = messageTerm;
    }
    return args;
  }, {});
};

module.exports = parseCommandArgs;
