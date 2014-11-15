"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var express = require('express');
var router = express.Router();

var userscript = fs.readFileSync(path.resolve(__dirname, '../../userscript/userscript.js'), 'utf-8');
var formatted = '<pre style="word-wrap: break-word; white-space: pre-wrap;">' +  _.escape(userscript) + '</pre>';

router
.get('/', function(req, res){
  res.send(formatted);
})
.get('/raw', function(req, res){
  res.send(userscript);
});

module.exports = router;
