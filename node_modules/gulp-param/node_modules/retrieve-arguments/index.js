module.exports = function(theFunction) {
  if (!isFunction(theFunction)) {
    throw new Error('No function given.');
  }
  var functionString = theFunction.toString(),
    matchedArguments = functionString.match(/function[^(]*\(([^)]*)\)/)[1]
      .split(',')
      .map(trim)
      .filter(flatten);
  return matchedArguments;
};

function trim(element) {
  return element.trim();
}

function flatten(element) {
  if (element === '' || element === null || typeof element === 'undefined') {
    return false;
  }
  return true;
}

function isFunction(theFunction) {
  return typeof theFunction === 'function';
}
