"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Save = mongoose.model('Save');

var saveUtil = require('../../util/save-util.js');

function updateSave(req, res) {
  var lastAccessDate = Date.now();
  Save.update({
    _id: req.save._id
  }, {
    lastAccessDate: lastAccessDate,
    previousSave: req.save.currentSave,
    currentSave: {
      lastChange: req.body.currentDate,
      creationDate: req.body.creationDate,
      value: JSON.parse(req.body.save)
    }
  }, function(err) {
    if (err) {
      console.log(err);
      res.send({
        "status": "ERROR",
        "description": "Wrong request",
        "code": "I'm a teapot",
        "requestExample": {
          "currentDate": Date,
          "creationDate": Date,
          "save": ""
        }
      });
    } else {
      res.send({
        "status": "OK",
        "lastAccessDate": lastAccessDate,
        "encodedSave": saveUtil.encoder(req.body.save)
      });
    }
  });
}

router
  .param('id', function(req, res, next, id) {
    Save.findOne({
      _id: id
    }, function(err, doc) {
      if (err) {
        console.log(err);
      }
      req.save = doc;
      next();
    });
  })
  .get('/:id', function(req, res) {
    if (req.save) {
     res.send({
      "status": "OK",
      "raw": {
        "currentSave": req.save.currentSave,
        "previousSave": req.save.previousSave
      },
      "encrypted": {
        "currentSave": saveUtil.encoder(JSON.stringify(req.save.currentSave)),
        "previousSave": saveUtil.encoder(JSON.stringify(req.save.previousSave))
      },
       "lastAccessDate": req.save.lastAccessDate
     });
   } else {
    res.send({
      "status": "ERROR",
      "description": "Wrong or non existant saveID",
      "code": "I'm a teapot"
    });
   }
  })
  .put('/:id', function(req, res) {
    if (req.body.forceSave) {
      updateSave(req, res);
    }
    if (req.body.creationDate >= req.save.currentSave.creationDate ||
      req.body.creationDate >= req.save.previousSave.creationDate) {
      res.send({
        "status": "ALERT",
        "description": "Current save is newer than one stored in the database.",
        "code": "I'm a teapot"
      });
    } else {
      updateSave(req, res);
    }
  });

module.exports = router;
