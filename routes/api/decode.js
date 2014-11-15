"use strict";
var express = require('express');
var router = express.Router();

var saveUtil = require('../../util/save-util.js');

router
  .post('/encode', function(req, res){
    res.send({
      "status": "OK",
      encoded: saveUtil.encoder(req.body.save),
    });
  })
  .post('/decode', function(req, res){
    res.send({
      "status": "OK",
      decoded: saveUtil.decoder(req.body.save)
    });
  });

module.exports = router;
