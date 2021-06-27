import { StateEvent } from "./Types";

export class StateMachine {
    public activeState: State;

    constructor() {
        this.activeState = new State("iState");
    }

    addStateTransition(event: StateEvent, from: State, to: State) {
        from.transitions.set(event, to);
    }

    transition(event: StateEvent) {
        if(this.activeState.transitions.has(event)){
            this.activeState = this.activeState.transitions.get(event);
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
