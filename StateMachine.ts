export class StateMachine {
    activeState: State;

    constructor() {
        this.activeState = new State();
    }

    addStateTransition(event: stateEvent, from: State, to: State) {
        from.transitions.set(event, to);
    }

    transition(event: stateEvent) {
        if(this.activeState.transitions.has(event)){
            this.activeState = this.activeState.transitions.get(event);
        }
    }
}

export class State {
    actions: Array<action>;
    transitions: Map<stateEvent, State>;

    constructor() {
        this.actions = [];
        this.transitions = new Map<stateEvent, State>();
    }
}

export type stateEvent = string;
export type action = {[key: string] : (...args) => void};
