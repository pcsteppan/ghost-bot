import { Message } from "discord.js";
import { GameState } from "./GameState";
import { EventAction, StateEvent } from './Types';

export function isValidNewWord(oldWord: string, newWord: string) {
    return newWord.includes(oldWord) && newWord.length == oldWord.length+1 && isAlpha(newWord);
}

export function isAlpha(str: string) {
	return str.match(/^[a-z]+$/i) !== null;
}

export function createEventAction (event: StateEvent, success: EventAction, fail: EventAction) : EventAction {
    return (msg: Message, gameState: GameState, ...args: any[]) => {
        gameState.transition(event)
            ? success(msg, gameState, ...args)
            : fail(msg, gameState, ...args);
    }
}

// Durstenfeld shuffle
export function shuffleArray<T>(arr: Array<T>) : Array<T> {
    const arrCopy : Array<T> = [...arr];
    for(let i = arrCopy.length - 1; i >= 0; i--){
        const index = Math.floor(Math.random()*(i+1));

        if(index === i){
            continue;
        } else {
            const temp = arrCopy[index];
            arrCopy[index] = arrCopy[i];
            arrCopy[i] = temp;
        }
    }
    return arrCopy;
} 
