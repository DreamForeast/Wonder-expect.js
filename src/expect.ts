import { ExpectData } from "./ExpectData";
import { Assertion } from "./Assertion";

export var expect = (source: any) => {
    var assertion = ExpectData.assertion;

    ExpectData.source = source;

    return assertion;
}

var _initData = () => {
    ExpectData.assertion = Assertion.create();
    ExpectData.isNot = false;
}

_initData();
