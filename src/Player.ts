import { User } from "discord.js";

export default class Player {
    score : number;
    user: User;
    name: string;

    constructor(user: User, customName = "") {
        this.name = (customName == "" ? user.username : customName);
        this.user = user;
        this.score = 0;
    }

    losePoint() {
        this.score -= 1;
    }
}