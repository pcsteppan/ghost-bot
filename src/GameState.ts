import { State, StateMachine } from "./StateMachine";
import Player from './Player';
import TrieNode from "./Trie";
import { StateEvent } from './Types';
import { isValidNewWord } from "./Utils";
import { User } from "discord.js";

export class GameState extends StateMachine{
    players: Array<Player>;
    word: string;
    currentPlayer: number;
    trie: TrieNode;
    activeChallenge: boolean;

    constructor(wordList : Array<string>)
    {
        super();
        this.players = Array<Player>();
        this.word = "";
        this.initStateMachineState();
        this.currentPlayer = -1;
        this.trie = new TrieNode();
        wordList.forEach(word => this.trie.addWord(word.toUpperCase()));
        this.activeChallenge = false;
    }

    initStateMachineState() {
        const sDead  = new State("dead");
        const sEmptyLobby = new State("lobby_E")
        const sLobby = new State("lobby_O");
        const sGameA = new State("game_A");
        const sGameB = new State("game_B");
        const sGameC = new State("game_C");
        
        this.activeState = sDead;

        this.addStateTransition(StateEvent.LOBBY,            sDead, sEmptyLobby);

        this.addStateTransition(StateEvent.JOIN,             sEmptyLobby, sLobby);
        this.addStateTransition(StateEvent.QUIT,             sEmptyLobby, sDead);

        this.addStateTransition(StateEvent.JOIN,             sLobby, sLobby);
        this.addStateTransition(StateEvent.SHUFFLE_ORDER,    sLobby, sLobby);
        this.addStateTransition(StateEvent.START,            sLobby, sGameA);
        this.addStateTransition(StateEvent.QUIT,             sLobby, sDead);

        this.addStateTransition(StateEvent.SUBMIT,           sGameA, sGameB);
        this.addStateTransition(StateEvent.RETURN_TO_LOBBY,  sGameA, sLobby);
        this.addStateTransition(StateEvent.QUIT,             sGameA, sDead);

        this.addStateTransition(StateEvent.SUBMIT,           sGameB, sGameB);
        this.addStateTransition(StateEvent.CHALLENGE,        sGameB, sGameC);
        this.addStateTransition(StateEvent.RETURN_TO_LOBBY,  sGameB, sLobby);
        this.addStateTransition(StateEvent.QUIT,             sGameB, sDead);

        this.addStateTransition(StateEvent.SUBMIT,           sGameC, sLobby);
        this.addStateTransition(StateEvent.RETURN_TO_LOBBY,  sGameC, sLobby);
        this.addStateTransition(StateEvent.QUIT,             sGameC, sDead);
    }

    setWord(newWord: string){
        newWord = newWord.toUpperCase();
        if(isValidNewWord(this.word, newWord)){
            this.word = newWord;
            return true;
        }
        return false;
    }

    isWordInDictionary(word: string)
    {
        word = word.toUpperCase();
        return this.trie.contains(word);
    }

    nextPlayer(){
        this.currentPlayer += 1;
        this.currentPlayer %= this.players.length;
    }

    previousPlayer(){
        this.currentPlayer = (this.currentPlayer === 0) 
                                ? (this.players.length - 1)
                                : (this.currentPlayer - 1);
    }

    // add check in the event these are called when current player is -1 (unset, out-of-game default)
    getPreviousPlayer() {
        if(this.currentPlayer === -1)
            return null;
        const previousPlayerIndex = (this.currentPlayer === 0) 
                                        ? (this.players.length - 1) 
                                        : (this.currentPlayer - 1);
        return this.players[previousPlayerIndex];
    }

    getCurrentPlayer(){
        if(this.currentPlayer === -1)
            return null;
        return this.players[this.currentPlayer];
    }

    getCurrentPlayerName(){
        const currentPlayer = this.getCurrentPlayer();
        return currentPlayer?.user.username;
    }

    addPlayer(user : User) {
        if(this.players.filter(p => p.user === user).length === 0){
            this.players.push(new Player(user));
            return true;
        }
        return false;
    }

    // full reset, used when quitting
    reset() {
        this.players = [];
        this.returnToLobby();
    }

    // resets to lobby state
    returnToLobby() {
        this.word = "";
        this.currentPlayer = -1;
        this.activeChallenge = false;
    }
}