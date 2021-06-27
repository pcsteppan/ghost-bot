import { StateEvent } from "./Types";

export class StateMachine {
    activeState: State;

    constructor() {
        this.activeState = new State("iState");
    }

    addStateTransition(event: StateEvent, from: State, to: State) {
        from.transitions.set(event, to);
    }

    transition(event: StateEvent) {
        const toState = this.activeState.transitions.get(event);
        if(this.activeState.transitions.has(event) && toState !== undefined){
            this.activeState = toState;
            return true;
        }
        return false;
    }
}

export class State {
    transitions: Map<StateEvent, State>;
    name: string;

    constructor(name: string) {
        this.name = name;
        this.transitions = new Map<StateEvent, State>();
    }
}
