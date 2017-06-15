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

        this._assert(!!source === true, this._buildFailMsg("true"));

        return this;
    }

    get false() {
        var source = ExpectData.source;

        this._assert(!!source === false, this._buildFailMsg("false"));

        return this;
    }

    get exist() {
        var source = ExpectData.source;

        this._assert(source !== null && source !== void 0, this._buildFailMsg("exist"));

        return this;
    }

    public equal(n: number) {
        var source = ExpectData.source;

        this._assert(source === n, this._buildFailMsg("equal", n));

        return this;
    }

    public gt(n: number) {
        var source = ExpectData.source;

        this._assert(source > n, this._buildFailMsg(">", n));

        return this;
    }

    public gte(n: number) {
        var source = ExpectData.source;

        this._assert(source >= n, this._buildFailMsg(">=", n));

        return this;
    }

    public lt(n: number) {
        var source = ExpectData.source;

        this._assert(source < n, this._buildFailMsg("<", n));

        return this;
    }

    public lte(n: number) {
        var source = ExpectData.source;

        this._assert(source <= n, this._buildFailMsg("<=", n));

        return this;
    }

    public a(type: string) {
        var source = ExpectData.source;

        switch (type) {
            case "number":
                this._assert(JudgeUtils.isNumber(source), this._buildFailMsg("number"));
                break;
            case "array":
                this._assert(JudgeUtils.isArrayExactly(source), this._buildFailMsg("array"));
                break;
            case "boolean":
                this._assert(JudgeUtils.isBoolean(source), this._buildFailMsg("boolean"));
                break;
            case "string":
                this._assert(JudgeUtils.isStringExactly(source), this._buildFailMsg("string"));
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

    private _assert(passCondition: boolean, failMsg: string) {
        var pass: boolean = null,
            failMessage = failMsg;

        if (ExpectData.isNot) {
            pass = !passCondition;
            ExpectData.isNot = false;

            failMessage = failMessage.replace("to be", "not to be");
        }
        else {
            pass = passCondition;
        }

        if (pass) {
            return;
        }

        throw new Error(failMessage);
    }

    private _format(source: any) {
        return source;
    }
}


