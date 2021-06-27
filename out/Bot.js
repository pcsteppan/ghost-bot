"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
var GameState_1 = require("./GameState");
var Utils_1 = require("./Utils");
var Types_1 = require("./Types");
var Discord = require('discord.js');
var _a = require('../resources/config.json'), token = _a.token, prefix = _a.prefix, registeredChannelID = _a.registeredChannelID;
var client = new Discord.Client();
var dictionary = require('../resources/dict.json');
"use strict";
client.login(token);
function isRegisteredChannel(id) {
    return id === registeredChannelID;
}
var gameState = new GameState_1.GameState(dictionary);
// mutate game state
var StateEventActions = {
    "lobby": Utils_1.createEventAction(Types_1.StateEvent.LOBBY, function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        // success
        console.log("lobby started");
        msg.channel.send("Lobby is now open to _!join_.");
    }, function () {
        // fail
        console.log("action unavailable");
    }),
    "join": Utils_1.createEventAction(Types_1.StateEvent.JOIN, function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        // success
        gameState.addPlayer(msg.author)
            ? msg.channel.send(msg.author.username + " has joined.")
            : msg.channel.send(msg.author.username + " has already joined.");
    }, function () {
        // fail
    }),
    "quit": Utils_1.createEventAction(Types_1.StateEvent.QUIT, function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        // success
        gameState.reset();
        msg.channel.send("Quitting out, bye bye.");
    }, function () {
        // fail
    }),
    "submit": Utils_1.createEventAction(Types_1.StateEvent.SUBMIT, function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        // success
        var submittedWord = args[0].toUpperCase();
        if (gameState.activeChallenge) {
            var winsChallenge = submittedWord.toUpperCase().includes(gameState.word)
                && submittedWord.length > gameState.word.length
                && gameState.isWordInDictionary(submittedWord.toUpperCase());
            var previousPlayer = gameState.getPreviousPlayer();
            var currentPlayer = gameState.getCurrentPlayer();
            if (winsChallenge) {
                previousPlayer.losePoint();
                msg.channel.send(submittedWord + " is a valid and real word, nice.");
                msg.channel.send(previousPlayer.user.username + " loses the challenge, and a point. You're at " + previousPlayer.score + " points.");
            }
            else {
                currentPlayer.losePoint();
                msg.channel.send(submittedWord + " is not a valid or real word, sorry.");
                msg.channel.send(currentPlayer.user.username + " loses the challenge, and a point. You're at " + currentPlayer.score + " points.");
            }
            gameState.activeChallenge = false;
            StateEventActions["return-to-lobby"].apply(StateEventActions, __spreadArray([msg, gameState], args));
        }
        else if (gameState.setWord(submittedWord)) {
            if (gameState.isWordInDictionary(gameState.word) && gameState.word.length > 4) {
                gameState.getCurrentPlayer().losePoint();
                msg.channel.send(gameState.getCurrentPlayerName() + " you completed a word! You lose a point. You're at " + gameState.getCurrentPlayer().score + " points.");
                StateEventActions["return-to-lobby"].apply(StateEventActions, __spreadArray([msg, gameState], args));
            }
            else {
                gameState.nextPlayer();
                msg.channel.send("**" + gameState.word + "** is the current word, " + gameState.getCurrentPlayerName() + " you're up next.");
            }
        }
        else {
            msg.channel.send(submittedWord + " is not a valid word, please try again.");
        }
    }, function () {
        // fail
    }),
    "start": Utils_1.createEventAction(Types_1.StateEvent.START, function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        // success
        gameState.nextPlayer();
        msg.channel.send("The game has begun. " + gameState.getCurrentPlayerName() + " is up. Start with !submit and a letter.");
    }, function () {
        // fail
    }),
    "challenge": Utils_1.createEventAction(Types_1.StateEvent.CHALLENGE, function (msg, gameState) {
        // success
        // still move to next players as submit will check previous player (the challenger)
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var challengingPlayerName = gameState.getCurrentPlayerName();
        gameState.nextPlayer();
        var challengedPlayerName = gameState.getCurrentPlayerName();
        msg.channel.send(challengingPlayerName + " is challenging " + challengedPlayerName + ".");
        msg.channel.send(challengedPlayerName + " !submit the word that you had in mind (it must be real, at least five letters long, and contain the partial word).");
        gameState.activeChallenge = true;
        gameState.nextPlayer();
    }, function () {
        // fail
    }),
    "return-to-lobby": Utils_1.createEventAction(Types_1.StateEvent.RETURN_TO_LOBBY, function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        console.log("returning to lobby");
        msg.channel.send("Returning to lobby, !start when ready for another round.");
        // resets word and current player
        gameState.returnToLobby();
    }, function () {
    })
};
// do not mutate game state
var queries = {
    "current-player": function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var currentPlayerUserName = gameState.getCurrentPlayer().user.username;
        msg.channel.send(currentPlayerUserName);
    },
    "current-gamestate": function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var currentGameState = gameState.activeState.name;
        msg.channel.send(currentGameState);
    },
    "current-word": function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var currentWord = gameState.word;
        msg.channel.send("**" + currentWord + "**");
    },
    "scores": function (msg, gameState) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var scores = gameState.players.map(function (player) { return player.user.username + ": " + player.score; }).join('\n');
        msg.channel.send(scores);
    }
};
client.once('ready', function () {
    console.log('Ready!');
});
client.on('message', function (msg) {
    console.log(msg.content);
    if (isRegisteredChannel(msg.channel.id)) {
        if (!msg.content.startsWith(prefix) || msg.author.bot)
            return;
        var args = msg.content.slice(prefix.length).trim().split(' ');
        var command = args.shift().toLowerCase();
        console.log("Command: ", command);
        console.log("Args: ", args);
        // primary commands
        if (Object.keys(StateEventActions).includes(command))
            StateEventActions[command].apply(StateEventActions, __spreadArray([msg, gameState], args));
        // secondary commands (queries that don't mutate gamestate)
        else if (Object.keys(queries).includes(command))
            queries[command].apply(queries, __spreadArray([msg, gameState], args));
    }
});
