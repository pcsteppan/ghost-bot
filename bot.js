const Discord = require('discord.js');
const {token, prefix} = require('./config.json');
const client = new Discord.Client();
const TrieNode = require('./Trie');
const dictionary = require('./dict.json');
client.login(token);


function isRegisteredChannel(id) {
    return id === '856651191404199956';
}

class State {
    // players
    // word
    // currentState
        // awaiting player action
        // finished
        // inSetup
    
    constructor()
    {
        this.players = [];
        this.word = "";
        this.currentState="IN_SETUP";
        this.currentPlayer=-1;
        this.trie = new TrieNode();
        dictionary.forEach(word => this.trie.addWord(word["word"]));
    }

    getStatus() {
        return `status: ${this.currentState}, word: ${this.word}, currentPlayer: ${this.getCurrentPlayerName()}`;
    }

    getCurrentPlayerName() {
        return (this.currentPlayer < 0) ? "No one yet!" : this.players[this.currentPlayer].name;
    }

    reset()
    {
        this.players = [];
        this.word = "";
        this.currentPlayer = -1;
        this.currentState = "IN_SETUP";
    }

    addPlayer(...names)
    {
        names[0].forEach(x => {
            console.log(x);
            this.players.push(new Player(x));
        })
    }
    
    next()
    {
        this.currentPlayer += 1;
        this.currentPlayer %= this.players.length;
        this.currentState = "IN_GAME";
    }

    sumbitWord(word)
    {
        if(isValidNewWord(this.word, word)){
            this.word = word;
            this.next();
            return true;
        }
        return false;
    }

    checkIfWordIsValid(word)
    {
        return this.trie.contains(word);
    }
}

class Player {
    // name
    static playerCount = 0;
    // score
    constructor(name) {
        this.playerID = this.playerCount;
        this.name = name;
        this.playerCount++;
    }

}

function isValidNewWord(oldWord, newWord) {
    return newWord.includes(oldWord) && newWord.length == oldWord.length+1 && isAlpha(newWord);
}

function isAlpha(str) {
	return str.match(/^[a-z]+$/i) !== null;
}

const state = new State();

client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', (msg) => {
    console.log(msg.content);

    if(isRegisteredChannel(msg.channel.id))
    {
        if (!msg.content.startsWith(prefix) || msg.author.bot) return;

        const args = msg.content.slice(prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();

        console.log("Command: ", command);
        console.log("Args: ", args);

        switch(command)
        {
            case "setup":
                state.addPlayer(args);
            break;
            case "addPlayer":
                state.addPlayer(args);
            break;
            case "reset":
                state.reset();
            break;
            case "status":
                msg.channel.send(state.getStatus());
            break;
            case "start":
                state.next();
                msg.channel.send(`It's ${state.getCurrentPlayerName()}'s turn.`)
            break;
            case "submit":
                if(state.sumbitWord(args[0].toUpperCase())){
                    msg.channel.send(`The word is now **${state.word}** and it's ${state.getCurrentPlayerName()}'s turn.`);
                } else {
                    msg.channel.send('That isn\'t a valid word.');
                }
            break;
            case "checkword":
                const word = args[0].toLowerCase();
                const isValid = state.checkIfWordIsValid(word);
                msg.channel.send(`${word.toUpperCase()} ${isValid ? "is" : "isn't"} a valid word.`)
            break;
            case "kill":
                msg.channel.send("Oh... ok. Bye...");
                state.reset();
            break;
            case "ghost,attack!":
                msg.channel.send("Not very effective, idiot");
            break;
            case "join":
                const user = msg.author.username;
                state.addPlayer([user]);
                msg.channel.send(msg.author.username + " joined.");
            break;
        }
    }
})