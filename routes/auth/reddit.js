"use strict";
var crypto = require('crypto');

var express = require('express');
var router = express.Router();
var passport = require('passport');

router
  .get('/reddit', function(req, res, next) {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
      state: req.session.state,
      duration: 'permanent',
    })(req, res, next);
  })
  .get('/reddit/callback', function(req, res, next) {
    // Check for origin via state token
    if (req.query.state === req.session.state){
      passport.authenticate('reddit', {
        successRedirect: '/save',
        failureRedirect: '/login'
      })(req, res, next);
    } else {
      var err = new Error('Forbidden');
      err.status = 403;
      next(err);
    }
  });

module.exports = router;
