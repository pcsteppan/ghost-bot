"use strict";
exports.__esModule = true;
exports.State = exports.StateMachine = void 0;
var StateMachine = /** @class */ (function () {
    function StateMachine() {
        this.activeState = new State();
    }
    StateMachine.prototype.addStateTransition = function (event, from, to) {
        from.transitions.set(event, to);
    };
    StateMachine.prototype.transition = function (event) {
        if (this.activeState.transitions.has(event)) {
            this.activeState = this.activeState.transitions.get(event);
        }
    };
    return StateMachine;
}());
exports.StateMachine = StateMachine;
var State = /** @class */ (function () {
    function State() {
        this.actions = [];
        this.transitions = new Map();
    }
    return State;
}());
exports.State = State;
