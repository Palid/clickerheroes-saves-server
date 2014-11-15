"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Save = mongoose.model('Save');

/* POST register */
router
  .post('/', function(req, res) {
    User.findOne({
      username: req.body.login
    }, function(err, user) {
      if (err) {
        console.log(err);
        res.send({
          "status": "ERROR",
          "description": "Database error",
          "code": "I'm a teapot"
        });
      }
      if (!user) {
        user = new User({
          username: req.body.login,
          password: req.body.password
        });
        user.save(function(err, doc) {
          if (err) {
            console.log(err);
            if (err.code === "11000") {
              res.send({
                "status": "ERROR",
                "description": "User already exists",
                "code": "11000"
              });
            } else {
              res.send({
                "status": "ERROR",
                "description": "Database error",
                "code": "I'm a teapot"
              });
            }
          } else {
            Save.create({}, function(err, save) {
              console.log(doc);
              if (err) {
                res.send({
                  "status": "ERROR",
                  "description": "Database error",
                  "code": "I'm a teapot"
                });
              }
              User.update({
                _id: doc._id
              }, {
                saveID: save._id
              }, function(err){
                if (err) console.log(err);
              });
              res.send({
                "status": "OK",
                "saveID": save._id
              });
            });
          }
        });
      } else {
        res.send({
          "status": "ERROR",
          "description": "User already exists",
          "code": "11000"
        });
      }
    });
  });

module.exports = router;
