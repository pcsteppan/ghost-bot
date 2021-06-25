const dict = require('./dict.json');
const TrieNode = require('./Trie');
const assert = require('assert');
const {performance} = require('perf_hooks');
const { StateMachine, State } = require('./StateMachine');


describe('Trie', () => {

    let head;

    beforeEach(() => {
        head = new TrieNode();
    })

    afterEach(() => {
        TrieNode.trieNodeCount = 0;
    })

    describe('.addChild', () => {
        it('adds a child to an empty trie', () => {
            const cCode = char('c');
            const newNode = new TrieNode();

            head.addChild(cCode, newNode);

            assert.ok(head.children.get(cCode) === newNode);
        });
    });
    
    describe('.addWord', () => {
        it('adds a word to an empty trie', () => {
            const word = 'cat';

            head.addWord(word);

            const charCodes = Array.from('cat').map(c => char(c));
            let currentNode = head;

            charCodes.forEach(c => {
                const child = currentNode.children.get(c);
                assert.ok(child instanceof TrieNode);
                currentNode = child;
            });

            assert.ok(currentNode.isWord);
        });

        it('adds a second word with a different suffix correctly', () => {
            const word1 = 'cat';
            const word2 = 'car';

            head.addWord(word1);
            head.addWord(word2);

            const charCodes = charCodesFromString('cat');
            let currentNode = head;

            charCodes.forEach(c => {
                const child = currentNode.children.get(c);
                assert.ok(child instanceof TrieNode);
                if(c === charCodes[1]){
                    assert.ok(child.children.size === 2);
                    assert.ok(child.children.has(char('r')));
                    assert.ok(child.children.get(char('r')).isWord);
                }
                currentNode = child;
            });

            assert.ok(currentNode.isWord);
            
        });

        it('does not take forever to add all the words in the english dictionary', () => {
            const t0 = performance.now();
            dict.forEach(word => {
                head.addWord(word["word"]);
            })
            const t1 = performance.now();

        });
    });

    describe('.contains', () => {
        it('returns true for words contained in the trie', () => {
            head.addWord('cat');

            assert.ok(head.contains('cat'));
        });

        it('returns false for strings contained in the trie that are not words', () => {
            head.addWord('cats');

            assert.ok(!(head.contains('cat')));
        });
    })

    describe('.wordsStartingWith', () => {
        it('returns the correct words that start with a given prefix', () => {
            head.addWord('cots');
            head.addWord('dogs');
            head.addWord('core');
            head.addWord('colder');
            head.addWord('callous');
            head.addWord('continuity');

            const wordsStartingWithC = head.wordsStartingWith('co');

            assert.ok(head.wordsStartingWith('co').length === 4);
        })
    })

});

const charCodesFromString = (str) => {
    return Array.from(str).map(char);
}

const char = (str) => {
    return str.charCodeAt(0);
}

describe('StateMachine', () => {
    describe('.addTransition', () => {
        it('transitions from one state to another when called with the correct event', () => {
            const machine = new StateMachine();
            const stateA = new State();
            const stateB = new State();

            machine.activeState = stateA;
            machine.addStateTransition("start", stateA, stateB);

            machine.transition("start");

            assert.ok(machine.activeState === stateB);
        })

        
    })
})