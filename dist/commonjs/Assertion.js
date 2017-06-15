"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExpectData_1 = require("./ExpectData");
var es2015_1 = require("wonder-commonlib/dist/es2015");
var Assertion = (function () {
    function Assertion() {
    }
    Assertion.create = function () {
        var obj = new this();
        return obj;
    };
    Object.defineProperty(Assertion.prototype, "not", {
        get: function () {
            ExpectData_1.ExpectData.isNot = true;
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Assertion.prototype, "be", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Assertion.prototype, "true", {
        get: function () {
            var source = ExpectData_1.ExpectData.source;
            this._assert(!!source === true, this._buildFailMsg("true"));
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Assertion.prototype, "false", {
        get: function () {
            var source = ExpectData_1.ExpectData.source;
            this._assert(!!source === false, this._buildFailMsg("false"));
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Assertion.prototype, "exist", {
        get: function () {
            var source = ExpectData_1.ExpectData.source;
            this._assert(source !== null && source !== void 0, this._buildFailMsg("exist"));
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Assertion.prototype.equal = function (n) {
        var source = ExpectData_1.ExpectData.source;
        this._assert(source === n, this._buildFailMsg("equal", n));
        return this;
    };
    Assertion.prototype.gt = function (n) {
        var source = ExpectData_1.ExpectData.source;
        this._assert(source > n, this._buildFailMsg(">", n));
        return this;
    };
    Assertion.prototype.gte = function (n) {
        var source = ExpectData_1.ExpectData.source;
        this._assert(source >= n, this._buildFailMsg(">=", n));
        return this;
    };
    Assertion.prototype.lt = function (n) {
        var source = ExpectData_1.ExpectData.source;
        this._assert(source < n, this._buildFailMsg("<", n));
        return this;
    };
    Assertion.prototype.lte = function (n) {
        var source = ExpectData_1.ExpectData.source;
        this._assert(source <= n, this._buildFailMsg("<=", n));
        return this;
    };
    Assertion.prototype.a = function (type) {
        var source = ExpectData_1.ExpectData.source;
        switch (type) {
            case "number":
                this._assert(es2015_1.JudgeUtils.isNumber(source), this._buildFailMsg("number"));
                break;
            case "array":
                this._assert(es2015_1.JudgeUtils.isArrayExactly(source), this._buildFailMsg("array"));
                break;
            case "boolean":
                this._assert(es2015_1.JudgeUtils.isBoolean(source), this._buildFailMsg("boolean"));
                break;
            case "string":
                this._assert(es2015_1.JudgeUtils.isStringExactly(source), this._buildFailMsg("string"));
                break;
            default:
                break;
        }
    };
    Assertion.prototype._buildFailMsg = function (operationStr, target) {
        if (!!target) {
            return "expected " + this._format(ExpectData_1.ExpectData.source) + " to be " + operationStr + " " + target;
        }
        return "expected " + this._format(ExpectData_1.ExpectData.source) + " to be " + operationStr;
    };
    Assertion.prototype._assert = function (passCondition, failMsg) {
        var pass = null, failMessage = failMsg;
        if (ExpectData_1.ExpectData.isNot) {
            pass = !passCondition;
            ExpectData_1.ExpectData.isNot = false;
            failMessage = failMessage.replace("to be", "not to be");
        }
        else {
            pass = passCondition;
        }
        if (pass) {
            return;
        }
        throw new Error(failMessage);
    };
    Assertion.prototype._format = function (source) {
        return source;
    };
    return Assertion;
}());
exports.Assertion = Assertion;
//# sourceMappingURL=Assertion.js.map