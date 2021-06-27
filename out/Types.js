"use strict";
exports.__esModule = true;
exports.StateEvent = void 0;
var StateEvent;
(function (StateEvent) {
    StateEvent[StateEvent["LOBBY"] = 0] = "LOBBY";
    StateEvent[StateEvent["JOIN"] = 1] = "JOIN";
    StateEvent[StateEvent["START"] = 2] = "START";
    StateEvent[StateEvent["SUBMIT"] = 3] = "SUBMIT";
    StateEvent[StateEvent["CHALLENGE"] = 4] = "CHALLENGE";
    StateEvent[StateEvent["RETURN_TO_LOBBY"] = 5] = "RETURN_TO_LOBBY";
    StateEvent[StateEvent["QUIT"] = 6] = "QUIT";
})(StateEvent = exports.StateEvent || (exports.StateEvent = {}));
