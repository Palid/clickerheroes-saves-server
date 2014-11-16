"use strict";

var path = require('path');
var USERSCRIPT_DIR = path.resolve(__dirname, '../../userscript');

var express = require('express');
var router = express.Router();

var serveIndex = require('serve-index');
var serveStatic = require('serve-static');


router
  .param('file', function(req, res, next, file) {
    req.fileToServe = file;
    next();
  })
  .get('/', serveIndex(USERSCRIPT_DIR))
  .get('/:file', serveStatic(USERSCRIPT_DIR));

module.exports = router;
