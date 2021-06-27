"use strict";
exports.__esModule = true;
var Player = /** @class */ (function () {
    function Player(user) {
        this.user = user;
        this.score = 0;
    }
    Player.prototype.losePoint = function () {
        this.score -= 1;
    };
    return Player;
}());
exports["default"] = Player;
