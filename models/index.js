"use strict";
var loadDir = require('../util/load-directory.js');

module.exports = loadDir(__dirname, {
    currentDir: __dirname,
    type: '.js',
    recursive: true,
    returnDict: false
});
