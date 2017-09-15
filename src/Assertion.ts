import { ExpectData } from "./ExpectData";
import { JudgeUtils } from "wonder-commonlib/dist/es2015";

export class Assertion {
    public static create() {
        var obj = new this();

        return obj;
    }

    get not() {
        ExpectData.isNot = true;

        return this;
    }

    get be() {
        return this;
    }

    get true() {
        var source = ExpectData.source;

        this._assert(!!source === true, "true");

        return this;
    }

    get false() {
        var source = ExpectData.source;

        this._assert(!!source === false, "false");

        return this;
    }

    get exist() {
        var source = ExpectData.source;

        this._assert(source !== null && source !== void 0, "exist");

        return this;
    }

    get null() {
        var source = ExpectData.source;

        this._assert(source === null, "null");

        return this;
    }

    get undefined() {
        var source = ExpectData.source;

        this._assert(source === void 0, "undefined");

        return this;
    }

    public equal(n: number) {
        var source = ExpectData.source;

        this._assert(source === n, "equal", n);

        return this;
    }

    public gt(n: number) {
        var source = ExpectData.source;

        this._assert(source > n, ">", n);

        return this;
    }

    public gte(n: number) {
        var source = ExpectData.source;

        this._assert(source >= n, ">=", n);

        return this;
    }

    public lt(n: number) {
        var source = ExpectData.source;

        this._assert(source < n, "<", n);

        return this;
    }

    public lte(n: number) {
        var source = ExpectData.source;

        this._assert(source <= n, "<=", n);

        return this;
    }

    public a(type: string) {
        var source = ExpectData.source;

        switch (type) {
            case "number":
                this._assert(JudgeUtils.isNumber(source), "number");
                break;
            case "array":
                this._assert(JudgeUtils.isArrayExactly(source), "array");
                break;
            case "boolean":
                this._assert(JudgeUtils.isBoolean(source), "boolean");
                break;
            case "string":
                this._assert(JudgeUtils.isStringExactly(source), "string");
                break;
            default:
                break;
        }
    }

    private _buildFailMsg(operationStr: string, target?: any) {
        if (!!target) {
            return `expected ${this._format(ExpectData.source)} to be ${operationStr} ${target}`;
        }

        return `expected ${this._format(ExpectData.source)} to be ${operationStr}`;
    }

    private _assert(passCondition: boolean, failMsg: string, target?: any) {
        var pass: boolean = null,
            failMessage: string = null;

        if (ExpectData.isNot) {
            pass = !passCondition;
        }
        else {
            pass = passCondition;
        }

        if (pass) {
            ExpectData.isNot = false;
            return;
        }

        failMessage = this._buildFailMsg(failMsg, target);

        if (ExpectData.isNot) {
            ExpectData.isNot = false;
            failMessage = failMessage.replace("to be", "not to be");
        }

        throw new Error(failMessage);
    }

    private _format(source: any) {
        return source;
    }
}


