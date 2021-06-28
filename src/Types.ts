import { Message } from "discord.js";
import { GameState } from "./GameState";

export enum StateEvent {
    LOBBY = "lobby",
    JOIN = "join",
    START = "start",
    SUBMIT = "submit",
    CHALLENGE = "challenge",
    RETURN_TO_LOBBY = "return-to-lobby",
    SHUFFLE_ORDER = "shuffle-order",
    QUIT = "quit"
}

export type EventAction = (msg: Message, gameState: GameState, ...args: any[]) => void;