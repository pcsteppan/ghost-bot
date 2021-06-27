import { Message, User } from "discord.js";
import { GameState } from "./GameState";
import { createEventAction } from "./Utils";
import { StateEvent } from './Types';

const Discord = require('discord.js');
const {token, prefix, registeredChannelID} = require('../resources/config.json');
const client = new Discord.Client();
const dictionary = require('../resources/dict.json');

"use strict"; 

client.login(token);

function isRegisteredChannel(id: string) {
    return id === registeredChannelID;
}

const gameState = new GameState(dictionary);

// mutate game state
const StateEventActions : 
    {[key: string] : (msg: Message, gameState: GameState, ...args: any[]) => void} 
    = {

    "lobby" : createEventAction(StateEvent.LOBBY, (msg: Message, gameState: GameState, ...args : any[]) => {
        // success
        console.log("lobby started");
        msg.channel.send("Lobby is now open to _!join_.");
    }, () => {
        // fail
        console.log("action unavailable");
    }),
    "join" : createEventAction(StateEvent.JOIN, (msg: Message, gameState: GameState, ...args : any[]) => {
        // success
        gameState.addPlayer(msg.author)
            ? msg.channel.send(msg.author.username + " has joined.")
            : msg.channel.send(msg.author.username + " has already joined.")
    }, () => {
        // fail
    }),
    "quit" : createEventAction(StateEvent.QUIT, (msg: Message, gameState: GameState, ...args : any[]) => {
        // success
        gameState.reset();
        msg.channel.send("Quitting out, bye bye.")
    }, () => {
        // fail
    }),
    "submit" : createEventAction(StateEvent.SUBMIT, (msg: Message, gameState: GameState, ...args : any[]) => {
        // success
        const submittedWord : string = args[0].toUpperCase();
        if(gameState.activeChallenge){
            const winsChallenge = submittedWord.toUpperCase().includes(gameState.word) 
                                    && submittedWord.length > gameState.word.length
                                    && gameState.isWordInDictionary(submittedWord.toUpperCase());

            const previousPlayer = gameState.getPreviousPlayer();
            const currentPlayer = gameState.getCurrentPlayer();

            if(winsChallenge) {
                previousPlayer.losePoint();
                msg.channel.send(submittedWord + " is a valid and real word, nice.")
                msg.channel.send(previousPlayer.user.username + " loses the challenge, and a point. You're at " + previousPlayer.score + " points.")
            } else {
                currentPlayer.losePoint();
                msg.channel.send(submittedWord + " is not a valid or real word, sorry.")
                msg.channel.send(currentPlayer.user.username + " loses the challenge, and a point. You're at " + currentPlayer.score + " points.")
            }
            gameState.activeChallenge = false;
            StateEventActions["return-to-lobby"](msg, gameState, ...args);
        }
        else if(gameState.setWord(submittedWord)){
            if(gameState.isWordInDictionary(gameState.word) && gameState.word.length > 4){
                gameState.getCurrentPlayer().losePoint();
                msg.channel.send(gameState.getCurrentPlayerName() + " you completed a word! You lose a point. You're at " + gameState.getCurrentPlayer().score + " points.");
                StateEventActions["return-to-lobby"](msg, gameState, ...args);
            }
            else {
                gameState.nextPlayer();
                msg.channel.send(`**${gameState.word}** is the current word, ${gameState.getCurrentPlayerName()} you're up next.`);
            }
        } else {
            msg.channel.send(submittedWord + " is not a valid word, please try again.")
        }
    }, () => {
        // fail
    }),
    "start" : createEventAction(StateEvent.START, (msg: Message, gameState: GameState, ...args : any[]) => {
        // success
        gameState.nextPlayer();
        msg.channel.send("The game has begun. " + gameState.getCurrentPlayerName() + " is up. Start with !submit and a letter.");
    }, () => {
        // fail
    }),
    "challenge" : createEventAction(StateEvent.CHALLENGE, (msg: Message, gameState: GameState, ...args : any[]) => {
        // success
        // still move to next players as submit will check previous player (the challenger)

        const challengingPlayerName = gameState.getCurrentPlayerName();
        gameState.nextPlayer();
        const challengedPlayerName = gameState.getCurrentPlayerName();

        msg.channel.send(challengingPlayerName + " is challenging " + challengedPlayerName + ".");
        msg.channel.send(challengedPlayerName + " !submit the word that you had in mind (it must be real, at least five letters long, and contain the partial word).")
        gameState.activeChallenge = true;
        gameState.nextPlayer();
    }, () => {
        // fail
    }),
    "return-to-lobby" : createEventAction(StateEvent.RETURN_TO_LOBBY, (msg: Message, gameState: GameState, ...args : any[]) => {
        console.log("returning to lobby");
        msg.channel.send("Returning to lobby, !start when ready for another round.");
        // resets word and current player
        gameState.returnToLobby();
    }, () => {

    })


}

// do not mutate game state
const queries : 
    {[key: string] : (msg: Message, gameState: GameState, ...args: any[]) => void} 
    = {

    "current-player" : (msg, gameState, ...args) => {
        const currentPlayerUserName = gameState.getCurrentPlayer().user.username;
        msg.channel.send(currentPlayerUserName);
    },
    "current-gamestate" : (msg, gameState, ...args) => {
        const currentGameState = gameState.activeState.name;
        msg.channel.send(currentGameState);
    },
    "current-word" : (msg, gameState, ...args) => {
        const currentWord = gameState.word;
        msg.channel.send(`**${currentWord}**`);
    },
    "scores" : (msg, gameState, ...args) => {
        const scores = gameState.players.map(player => `${player.user.username}: ${player.score}`).join('\n');
        msg.channel.send(scores);
    }


}

client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', (msg: Message) => {
    console.log(msg.content);

    if(isRegisteredChannel(msg.channel.id))
    {
        if (!msg.content.startsWith(prefix) || msg.author.bot) return;

        const args = msg.content.slice(prefix.length).trim().split(' ');
        const firstArg = args.shift();
        const command = (firstArg !== undefined)
                            ? firstArg
                            : "";

        console.log("Command: ", command);
        console.log("Args: ", args);

        // primary commands
        if(Object.keys(StateEventActions).includes(command))
            StateEventActions[command](msg, gameState, ...args);
        // secondary commands (queries that don't mutate gamestate)
        else if (Object.keys(queries).includes(command))
            queries[command](msg, gameState, ...args);
        
    }
})
