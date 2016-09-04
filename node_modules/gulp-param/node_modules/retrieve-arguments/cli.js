#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2)),
  pkg = require('./package.json'),
  retrieveArguments = require('./index');

if (argv.help || argv.h || argv._.length <= 0) {
  console.log([
    '# ' + pkg.name,
    pkg.description,
    '',
    'Usage',
    '-----',
    '$ retrieve-arguments node_modules/minimist',
    '$ retrieve-arguments ./index.js',
    '$ retrieve-arguments node_modules/minimist ./index.js',
  ].join('\n'));
} else {

  argv._.forEach(function(module) {
    console.log(module);
    module = process.cwd() + '/' + module;
    try {
      console.log('>', retrieveArguments(require(module)));
    } catch (e) {
      console.error(e);
    }
  });
}
