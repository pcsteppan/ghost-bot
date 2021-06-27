"use strict";
exports.__esModule = true;
var TrieNode = /** @class */ (function () {
    function TrieNode() {
        this.id = TrieNode.trieNodeCount++;
        this.children = new Map();
        this.isWord = false;
    }
    TrieNode.prototype.addChild = function (char, child) {
        this.children.set(char, child);
    };
    TrieNode.prototype.addWord = function (word) {
        if (word === "") {
            this.isWord = true;
        }
        else {
            var frontChar = word.charCodeAt(0);
            if (this.children.has(frontChar)) {
                this.children.get(frontChar).addWord(word.substring(1));
            }
            else {
                var child = new TrieNode();
                this.addChild(frontChar, child);
                child.addWord(word.substring(1));
            }
        }
    };
    TrieNode.prototype.contains = function (word) {
        if (word === "")
            return this.isWord;
        var firstChar = word.charCodeAt(0);
        if (this.children.has(firstChar)) {
            return this.children.get(firstChar).contains(word.substring(1));
        }
        else {
            return false;
        }
    };
    TrieNode.prototype.wordsStartingWith = function (prefix) {
        if (prefix == "") {
            var childrensSuffixes_1 = [];
            if (this.children.size > 0) {
                this.children.forEach(function (v, k) {
                    childrensSuffixes_1 = childrensSuffixes_1
                        .concat(v.wordsStartingWith("")
                        .map(function (substring) { return String.fromCharCode(k) + substring; }));
                });
            }
            else {
                childrensSuffixes_1.push("");
            }
            return childrensSuffixes_1;
        }
        else {
            var firstChar = prefix.charCodeAt(0);
            if (this.children.has(firstChar)) {
                return this.children
                    .get(firstChar)
                    .wordsStartingWith(prefix.substring(1))
                    .map(function (substring) { return prefix.charAt(0) + substring; });
            }
            else {
                return [];
            }
        }
    };
    TrieNode.prototype.print = function () {
        var _this = this;
        console.log(this.toString());
        this.children.forEach(function (v, k) {
            console.log(_this.id + "-" + String.fromCharCode(k) + "->" + v.id);
            v.print();
        });
    };
    TrieNode.prototype.toString = function () {
        return "" + this.id + (this.isWord ? '+' : '-') + " : [" + Array.from(this.children.keys()).map(function (c) { return String.fromCharCode(c); }) + "]";
    };
    TrieNode.trieNodeCount = 0;
    return TrieNode;
}());
exports["default"] = TrieNode;
