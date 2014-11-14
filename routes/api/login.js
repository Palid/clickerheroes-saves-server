"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
  User = mongoose.model('User');



/* POST register */
router
  .post('/', function(req, res) {
    if (req.body.login && req.body.password) {
      User.findOne({
        username: req.body.login
      }, function(err, doc) {
        console.log()
        if (err) {
          res.send({
            "status": "ERROR",
            "description": "Database error",
            "code": "I'm a teapot"
          });
        } else if (doc) {
          var logins = {
            lastLogin: Date.now()
          };
          if (doc.authenticate(req.body.password)) {
            logins.lastValidLogin = Date.now();
            res.send({
              "status": "OK",
              "saveID": doc.saveID
            });
          } else {
            res.send({
              "status": "ERROR",
              "description": "Wrong password",
              "code": "I'm a teapot"
            });
          }
          User.update({
            _id: doc._id
          }, logins, function(err){
            if (err) {
              console.log(err);
            }
          });
        } else {
          res.send({
            "status": "ERROR",
            "description": "User not found",
            "code": "I'm a teapot"
          });
        }
      });
    } else {
      res.send({
        "status": "ERROR",
        "description": "Wrong request.",
        "requestExample": {
          "login": "Potato",
          "password": "aBigOne"
        }
      });
    }
  });

module.exports = router;
