"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.GameState = void 0;
var StateMachine_1 = require("./StateMachine");
var Player_1 = require("./Player");
var Trie_1 = require("./Trie");
var Types_1 = require("./Types");
var Utils_1 = require("./Utils");
var GameState = /** @class */ (function (_super) {
    __extends(GameState, _super);
    function GameState(wordList) {
        var _this = _super.call(this) || this;
        _this.players = Array();
        _this.word = "";
        _this.initStateMachineState();
        _this.currentPlayer = -1;
        _this.trie = new Trie_1["default"]();
        wordList.forEach(function (word) { return _this.trie.addWord(word.toUpperCase()); });
        _this.activeChallenge = false;
        return _this;
    }
    GameState.prototype.initStateMachineState = function () {
        var sDead = new StateMachine_1.State("dead");
        var sEmptyLobby = new StateMachine_1.State("lobby_E");
        var sLobby = new StateMachine_1.State("lobby_O");
        var sGameA = new StateMachine_1.State("game_A");
        var sGameB = new StateMachine_1.State("game_B");
        var sGameC = new StateMachine_1.State("game_C");
        this.activeState = sDead;
        this.addStateTransition(Types_1.StateEvent.LOBBY, sDead, sEmptyLobby);
        this.addStateTransition(Types_1.StateEvent.JOIN, sEmptyLobby, sLobby);
        this.addStateTransition(Types_1.StateEvent.QUIT, sEmptyLobby, sDead);
        this.addStateTransition(Types_1.StateEvent.JOIN, sLobby, sLobby);
        this.addStateTransition(Types_1.StateEvent.SHUFFLE_ORDER, sLobby, sLobby);
        this.addStateTransition(Types_1.StateEvent.START, sLobby, sGameA);
        this.addStateTransition(Types_1.StateEvent.QUIT, sLobby, sDead);
        this.addStateTransition(Types_1.StateEvent.SUBMIT, sGameA, sGameB);
        this.addStateTransition(Types_1.StateEvent.RETURN_TO_LOBBY, sGameA, sLobby);
        this.addStateTransition(Types_1.StateEvent.QUIT, sGameA, sDead);
        this.addStateTransition(Types_1.StateEvent.SUBMIT, sGameB, sGameB);
        this.addStateTransition(Types_1.StateEvent.CHALLENGE, sGameB, sGameC);
        this.addStateTransition(Types_1.StateEvent.RETURN_TO_LOBBY, sGameB, sLobby);
        this.addStateTransition(Types_1.StateEvent.QUIT, sGameB, sDead);
        this.addStateTransition(Types_1.StateEvent.SUBMIT, sGameC, sLobby);
        this.addStateTransition(Types_1.StateEvent.RETURN_TO_LOBBY, sGameC, sLobby);
        this.addStateTransition(Types_1.StateEvent.QUIT, sGameC, sDead);
    };
    GameState.prototype.setWord = function (newWord) {
        newWord = newWord.toUpperCase();
        if (Utils_1.isValidNewWord(this.word, newWord)) {
            this.word = newWord;
            return true;
        }
        return false;
    };
    GameState.prototype.isWordInDictionary = function (word) {
        word = word.toUpperCase();
        return this.trie.contains(word);
    };
    GameState.prototype.nextPlayer = function () {
        this.currentPlayer += 1;
        this.currentPlayer %= this.players.length;
    };
    GameState.prototype.previousPlayer = function () {
        this.currentPlayer = (this.currentPlayer === 0)
            ? (this.players.length - 1)
            : (this.currentPlayer - 1);
    };
    // add check in the event these are called when current player is -1 (unset, out-of-game default)
    GameState.prototype.getPreviousPlayer = function () {
        if (this.currentPlayer === -1)
            return null;
        var previousPlayerIndex = (this.currentPlayer === 0)
            ? (this.players.length - 1)
            : (this.currentPlayer - 1);
        return this.players[previousPlayerIndex];
    };
    GameState.prototype.getCurrentPlayer = function () {
        if (this.currentPlayer === -1)
            return null;
        return this.players[this.currentPlayer];
    };
    GameState.prototype.getCurrentPlayerName = function () {
        var currentPlayer = this.getCurrentPlayer();
        if (currentPlayer === null)
            return "No one is the current player yet";
        else
            return currentPlayer.user.username;
    };
    GameState.prototype.addPlayer = function (user) {
        if (this.players.filter(function (p) { return p.user === user; }).length === 0) {
            this.players.push(new Player_1["default"](user));
            return true;
        }
        return false;
    };
    // full reset, used when quitting
    GameState.prototype.reset = function () {
        this.players = [];
        this.returnToLobby();
    };
    // resets to lobby state
    GameState.prototype.returnToLobby = function () {
        this.word = "";
        this.currentPlayer = -1;
        this.activeChallenge = false;
    };
    return GameState;
}(StateMachine_1.StateMachine));
exports.GameState = GameState;
