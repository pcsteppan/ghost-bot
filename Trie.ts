import { transpileModule } from "typescript";

class TrieNode {
    static trieNodeCount: number = 0;
    id: number;
    children: Map<number, TrieNode>;
    isWord: boolean;

    constructor() {
        this.id = TrieNode.trieNodeCount++;
        this.children = new Map<number, TrieNode>();
        this.isWord = false;
    }

    addChild(char: number, child: TrieNode) {
        this.children.set(char, child);
    }

    addWord(word: string) {
        if(word === ""){
            this.isWord = true;
        } else {
            const frontChar : number = word.charCodeAt(0);
            if(this.children.has(frontChar)){
                this.children.get(frontChar).addWord(word.substring(1));
            } else {
                const child = new TrieNode();
                this.addChild(frontChar, child);
                child.addWord(word.substring(1));
            }
        }
    }

    contains(word: string) {
        if(word === "")
            return this.isWord;

        const firstChar = word.charCodeAt(0);
        if(this.children.has(firstChar)){
            return this.children.get(firstChar).contains(word.substring(1));
        } else {
            return false;
        }
    }

    print() {
        console.log(this.toString());
        this.children.forEach((v: TrieNode, k: number) => {
            console.log(`${this.id}-${String.fromCharCode(k)}->${v.id}`)
            v.print();
        });
    }

    toString(){
        return `${this.id}${this.isWord ? '+' : '-'} : [${Array.from(this.children.keys()).map(c => String.fromCharCode(c))}]`;
    }
}

module.exports = TrieNode;