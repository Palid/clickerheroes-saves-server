'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');
  /**
   * TODO
   */
  // authTypes = [
  //   'github',
  //   'twitter',
  //   'facebook',
  //   'google',
  //   'reddit'
  // ];

/**
 * User Schema
 */
var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  saveID: String,
  lastLogin: Date,
  lastValidLogin: Date,
  /**
   * TODO
   */
  // facebook: {},
  // twitter: {},
  // github: {},
  // google: {},
  // reddit: {}
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
}).get(function() {
  return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
  return value && value.length;
};

UserSchema.path('username').validate(function(username) {
  /**
   * TODO
   */
  // if you are authenticating by any of the oauth strategies, don't validate
  // if (authTypes.indexOf(this.provider) !== -1) return true;
  if (username.length > 25) return false;
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashedPassword').validate(function(hashedPassword) {
  /**
   * TODO
   */
  // if you are authenticating by any of the oauth strategies, don't validate
  // if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashedPassword.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password))
    next(new Error('Invalid password'));
  // TODO
  // if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1)
  //   next(new Error('Invalid password'));
  else next();
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};
mongoose.model('User', UserSchema);
