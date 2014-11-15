// CREDIT TO:
// http://clicker-heroes.com/clicker-heroes-save-data-editing-cheat/

"use strict";
const ANTI_CHEAT_CODE = 'Fe12NAfA3R6z4k0z';
const SALT = 'af0ik392jrmt0nsfdghy0';
const CHARACTERS = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

var input = document.getElementById('input');
var output = document.getElementById('output');
var jsonInput = document.getElementById('jsonInput');
var jsonOutput = document.getElementById('jsonOutput');
var decodeButton = document.getElementById('decodeButton');
var encodeButton = document.getElementById('encodeButton');
decodeButton.addEventListener('click', onDecodeButtonClick);
encodeButton.addEventListener('click', onEncodeButtonClick);

function onDecodeButtonClick(event) {
  var string = input.value;
  var antiCheatCodeIndex = string.search(ANTI_CHEAT_CODE);
  var antiCheatCodeExist = (antiCheatCodeIndex != -1);
  if (antiCheatCodeExist) string = fromAntiCheatFormat(string);
  output.value = atob(string);
}

function fromAntiCheatFormat(string) {
  var elements = string.split(ANTI_CHEAT_CODE);
  var data = unSprinkle(elements[0]);
  var hash = elements[1];
  var dataHash = getHash(data);
  if (dataHash = hash) return data;
  alert("Hash is bad");
}

function unSprinkle(string) {
  var array = string.split("");
  var result = [];
  var counter = 0;
  while (counter < array.length) {
    result[counter / 2] = array[counter];
    counter += 2;
  }
  return result.join("");
}

function getHash(string) {
  var charaters = string.split();
  charaters.sort();
  var sortedCharaters = charaters.join();
  return CryptoJS.MD5(sortedCharaters + SALT);
}

function onEncodeButtonClick(event) {
  var string = jsonInput.value;
  var base64string = btoa(string);
  var result = sprinkle(base64string) + ANTI_CHEAT_CODE + getHash(base64string);
  jsonOutput.value = result;
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
