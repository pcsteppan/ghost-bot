import { Message } from "discord.js";
import { GameState } from "./GameState";
import { StateEvent } from './Types';

export function isValidNewWord(oldWord, newWord) {
    return newWord.includes(oldWord) && newWord.length == oldWord.length+1 && isAlpha(newWord);
}

export function isAlpha(str) {
	return str.match(/^[a-z]+$/i) !== null;
}

export function createEventAction (event: StateEvent, success, fail) {
    return (msg: Message, gameState: GameState, ...args: any[]) => {
        gameState.transition(event)
            ? success(msg, gameState, ...args)
            : fail(msg, gameState, ...args);
    }
}
