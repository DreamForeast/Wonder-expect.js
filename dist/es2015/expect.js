import { ExpectData } from "./ExpectData";
import { Assertion } from "./Assertion";
export var expect = function (source) {
    var assertion = ExpectData.assertion;
    ExpectData.source = source;
    return assertion;
};
var _initData = function () {
    ExpectData.assertion = Assertion.create();
    ExpectData.isNot = false;
};
_initData();
//# sourceMappingURL=expect.js.map