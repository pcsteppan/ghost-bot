"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.createEventAction = exports.isAlpha = exports.isValidNewWord = void 0;
function isValidNewWord(oldWord, newWord) {
    return newWord.includes(oldWord) && newWord.length == oldWord.length + 1 && isAlpha(newWord);
}
exports.isValidNewWord = isValidNewWord;
function isAlpha(str) {
    return str.match(/^[a-z]+$/i) !== null;
}
exports.isAlpha = isAlpha;
function createEventAction(event, success, fail) {
    return function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        gameState.transition(event)
            ? success.apply(void 0, __spreadArray([msg, gameState], args)) : fail.apply(void 0, __spreadArray([msg, gameState], args));
    };
}
exports.createEventAction = createEventAction;
