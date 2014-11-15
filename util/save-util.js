"use strict";

var crypto = require('crypto');

// CREDIT TO:
// http://clicker-heroes.com/clicker-heroes-save-data-editing-cheat/
// I probably wouldn't do it so fast without copy-pasting from the site.


var ANTI_CHEAT_CODE = 'Fe12NAfA3R6z4k0z';
var SALT = 'af0ik392jrmt0nsfdghy0';
var CHARACTERS = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

function getHash(string) {
  var charaters = string.split();
  charaters.sort();
  var sortedCharaters = charaters.join();
  return crypto.createHash('md5')
    .update(sortedCharaters + SALT)
    .digest('hex');
}


function unSprinkle(string) {
  var array = string.split("");
  var len = array.length;
  var result = [];
  var counter = 0;
  while (counter < len) {
    result[counter / 2] = array[counter];
    counter += 2;
  }
  return result.join("");
}

function fromAntiCheatFormat(string) {
  var elements = string.split(ANTI_CHEAT_CODE);
  var data = unSprinkle(elements[0]);
  if (elements.length >= 2) {
    // elements[1] should be hash. Hopefully.
    if (getHash(data) === elements[1]) {
      return data;
    } else {
      var ERR = new Error("Hash is bad.");
      ERR.status = 100;
      return ERR;
    }
  } else {
    return data;
  }
}

function sprinkle(string) {
  var characters;
  var randomIndex;
  var array = string.split("");
  var result = [];
  var counter = 0;
  while (counter < array.length) {
    result[counter * 2] = array[counter];
    characters = CHARACTERS;
    randomIndex = Math.floor(Math.random() * (characters.length - 1));
    result[counter * 2 + 1] = characters.substr(randomIndex, 1);
    counter++;
  }
  return result.join("");
}

function decode(string) {
  if (string.search(ANTI_CHEAT_CODE) === -1) {
    string = fromAntiCheatFormat(string);
  }
  try {
    return new Buffer(string, 'base64').toString('binary');
  } catch (e) {
    return e;
  }
}

function encode(string) {
  try {
    var base64string = new Buffer(string).toString('base64');
    var result = sprinkle(base64string) + ANTI_CHEAT_CODE + getHash(base64string);
    return result;
  } catch (e) {
    return e;
  }
}

module.exports = {
  decoder: decode,
  encoder: encode
};
