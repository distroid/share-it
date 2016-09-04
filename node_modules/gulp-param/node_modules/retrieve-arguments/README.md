retrieve-arguments
==================
[![Build Status](https://travis-ci.org/stoeffel/retrieve-arguments.svg)](https://travis-ci.org/stoeffel/retrieve-arguments)

> Retrieves the argumentnames of a function

Installation
------------

`npm install retrieve-arguments`

Usage
-----

```js
var retrieveArguments = require('retrieve-arguments');

retrieveArguments(function(element, index, array) {/*...*/}); // => ['element', 'index', 'array']
retrieveArguments(function() {/*...*/}); // => []
retrieveArguments(function ( test )) {/*...*/}); // => ['test']
```

CLI
---

```bash
$ retrieve-arguments node_modules/minimist
$ retrieve-arguments ./index.js
$ retrieve-arguments node_modules/minimist ./index.js
```
