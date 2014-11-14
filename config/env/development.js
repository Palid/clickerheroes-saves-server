'use strict';

module.exports = {
  db: {
    url: "mongodb://localhost/clicker-heroes-dev"
  },
  app: {
    name: "Clicker Heroes Cloud DEV"
  },
  facebook: {
    clientID: "TODO",
    clientSecret: "TODO",
    callbackURL: "localhost:3000/auth/facebook/callback"
  },
  twitter: {
    clientID: "TODO",
    clientSecret: "TODO",
    callbackURL: "localhost:3000/auth/twitter/callback"
  },
  github: {
    clientID: "TODO",
    clientSecret: "TODO",
    callbackURL: "localhost:3000/auth/github/callback"
  },
  google: {
    clientID: "TODO",
    clientSecret: "TODO",
    callbackURL: "localhost:3000/auth/google/callback"
  },
  reddit: {
    clientID: "TODO",
    clientSecret: "TODO",
    callbackURL: "localhost:3000/auth/google/callback"
  }
};
