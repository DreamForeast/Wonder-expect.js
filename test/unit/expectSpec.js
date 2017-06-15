describe("expect", function() {
    var et = wdet.expect;

    var errMsg;

    beforeEach(function(){

    });

    describe("property judge", function() {
        beforeEach(function(){

        });

        it("exist", function(){
            errMsg = "to be exist";

            expect(function () {
                et(null).exist;
            }).toThrow(errMsg);

            expect(function () {
                et(undefined).exist;
            }).toThrow(errMsg);

            expect(function () {
                et(true).exist;
            }).not.toThrow();

            expect(function () {
                et(1).exist;
            }).not.toThrow();

            expect(function () {
                et("aaa").exist;
            }).not.toThrow();
        });
        it("not", function () {
            errMsg = "not to be";

            expect(function () {
                et("aaa").not.be.a("string");
            }).toThrow(errMsg);

            expect(function () {
                et("aaa").be.a("string");
            }).not.toThrow();
        });
        it("true", function () {
            errMsg = "to be true";

            expect(function () {
                et(false).true
            }).toThrow(errMsg);

            expect(function () {
                et(0).true
            }).toThrow(errMsg);

            expect(function () {
                et(1).true
                et(true).true
            }).not.toThrow();
        });
    });

    describe("method judge", function() {
        beforeEach(function(){

        });

        it("equal", function(){
            errMsg = "to be equal";

            expect(function () {
                et(1).equal(2);
            }).toThrow(errMsg);

            expect(function () {
                et(true).equal(2);
            }).toThrow(errMsg);

            expect(function () {
                et(true).equal(false);
            }).toThrow(errMsg);

            expect(function () {
                et(2).equal(2);
                et("aaa").equal("aaa");
            }).not.toThrow();
        });
        it("a", function(){
            errMsg = "to be";

            expect(function () {
                et(1).be.a("string")
            }).toThrow("to be string");

            expect(function () {
                et("aa").be.a("number")
            }).toThrow("to be number");

            expect(function () {
                et(1).be.a("boolean");
            }).toThrow("to be boolean");

            expect(function () {
                et("aaa").be.a("array");
            }).toThrow("to be array");

            expect(function () {
                et(2).be.a("number");
                et("aaa").be.a("string");
                et(false).be.a("boolean");
                et([1,2]).be.a("array");
            }).not.toThrow();
        });
    });
});
