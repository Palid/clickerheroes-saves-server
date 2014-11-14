'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Record schema
 */
var SaveSchema = new Schema({
  currentSave: {
    lastChange: Date,
    creationDate: Date,
    value: String
  },
  previousSave: {
    lastChange: Date,
    creationDate: Date,
    value: String
  },
  lastAccessDate: Date
});


mongoose.model('Save', SaveSchema);
