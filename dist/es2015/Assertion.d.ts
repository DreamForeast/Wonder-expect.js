export declare class Assertion {
    static create(): Assertion;
    readonly not: this;
    readonly be: this;
    readonly true: this;
    readonly false: this;
    readonly exist: this;
    readonly null: this;
    readonly undefined: this;
    equal(n: number): this;
    gt(n: number): this;
    gte(n: number): this;
    lt(n: number): this;
    lte(n: number): this;
    a(type: string): void;
    private _buildFailMsg(operationStr, target?);
    private _assert(passCondition, failMsg, target?);
    private _format(source);
}
