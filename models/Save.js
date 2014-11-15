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
    value: Object
  },
  previousSave: {
    lastChange: Date,
    creationDate: Date,
    value: Object
  },
  lastAccessDate: Date
});


mongoose.model('Save', SaveSchema);
