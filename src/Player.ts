import { User } from "discord.js";

export default class Player {
    score : number;
    user: User;

    constructor(user: User) {
        this.user = user;
        this.score = 0;
    }

    losePoint() {
        this.score -= 1;
    }
}