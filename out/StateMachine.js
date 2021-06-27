"use strict";
exports.__esModule = true;
exports.State = exports.StateMachine = void 0;
var StateMachine = /** @class */ (function () {
    function StateMachine() {
        this.activeState = new State("iState");
    }
    StateMachine.prototype.addStateTransition = function (event, from, to) {
        from.transitions.set(event, to);
    };
    StateMachine.prototype.transition = function (event) {
        var toState = this.activeState.transitions.get(event);
        if (this.activeState.transitions.has(event) && toState !== undefined) {
            this.activeState = toState;
            return true;
        }
        return false;
    };
    return StateMachine;
}());
exports.StateMachine = StateMachine;
var State = /** @class */ (function () {
    function State(name) {
        this.name = name;
        this.transitions = new Map();
    }
    return State;
}());
exports.State = State;
