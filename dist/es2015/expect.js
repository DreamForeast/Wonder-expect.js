"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExpectData_1 = require("./ExpectData");
var Assertion_1 = require("./Assertion");
exports.expect = function (source) {
    var assertion = ExpectData_1.ExpectData.assertion;
    ExpectData_1.ExpectData.source = source;
    return assertion;
};
var _initData = function () {
    ExpectData_1.ExpectData.assertion = Assertion_1.Assertion.create();
    ExpectData_1.ExpectData.isNot = false;
};
_initData();
//# sourceMappingURL=expect.js.map