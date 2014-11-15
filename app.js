"use strict";
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
// var expressSession = require('express-session');
// var passport = require('passport');

var app = express();

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(expressSession({
//   secret: "TODO",
//   resave: false,
//   saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(allowCrossDomain);

//Initializing system variables
var config;
if (process.env.NODE_ENV === "development") {
  config = require('./config/env/development.js');
} else {
  config = {};
}
var mongoose = require('mongoose');

//Bootstrap db connection
mongoose.connect(process.env.MONGOSOUP_URL || config.db);

// load models
require('./models/index.js');
// load routes
var routes = require('./routes');

app.use('/', routes.home);
app.use('/api', routes.api);
app.use('/login', routes.login);
app.use('/register', routes.register);
app.use('/save', routes.save);
app.use('/userscript', routes.userscript);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
