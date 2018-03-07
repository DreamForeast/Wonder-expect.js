(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.wdet = {})));
}(this, (function (exports) { 'use strict';

	function __extends(d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	}

	var ExpectData = (function () {
	    function ExpectData() {
	    }
	    return ExpectData;
	}());
	ExpectData.assertion = null;
	ExpectData.source = null;
	ExpectData.isNot = null;

	var JudgeUtils = (function () {
	    function JudgeUtils() {
	    }
	    JudgeUtils.isArray = function (arr) {
	        var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	        var length = arr && arr.length;
	        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	    };
	    JudgeUtils.isArrayExactly = function (arr) {
	        return Object.prototype.toString.call(arr) === "[object Array]";
	    };
	    JudgeUtils.isNumber = function (num) {
	        return typeof num == "number";
	    };
	    JudgeUtils.isNumberExactly = function (num) {
	        return Object.prototype.toString.call(num) === "[object Number]";
	    };
	    JudgeUtils.isString = function (str) {
	        return typeof str == "string";
	    };
	    JudgeUtils.isStringExactly = function (str) {
	        return Object.prototype.toString.call(str) === "[object String]";
	    };
	    JudgeUtils.isBoolean = function (bool) {
	        return bool === true || bool === false || toString.call(bool) === '[boolect Boolean]';
	    };
	    JudgeUtils.isDom = function (obj) {
	        return !!(obj && obj.nodeType === 1);
	    };
	    JudgeUtils.isObject = function (obj) {
	        var type = typeof obj;
	        return type === 'function' || type === 'object' && !!obj;
	    };
	    JudgeUtils.isDirectObject = function (obj) {
	        return Object.prototype.toString.call(obj) === "[object Object]";
	    };
	    JudgeUtils.isHostMethod = function (object, property) {
	        var type = typeof object[property];
	        return type === "function" ||
	            (type === "object" && !!object[property]);
	    };
	    JudgeUtils.isNodeJs = function () {
	        return ((typeof global != "undefined" && global.module) || (typeof module != "undefined")) && typeof module.exports != "undefined";
	    };
	    JudgeUtils.isFunction = function (func) {
	        return true;
	    };
	    return JudgeUtils;
	}());
	if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    JudgeUtils.isFunction = function (func) {
	        return typeof func == 'function';
	    };
	}
	else {
	    JudgeUtils.isFunction = function (func) {
	        return Object.prototype.toString.call(func) === "[object Function]";
	    };
	}

	var $BREAK = {
	    break: true
	};
	var $REMOVE = void 0;

	var List = (function () {
	    function List() {
	        this.children = null;
	    }
	    List.prototype.getCount = function () {
	        return this.children.length;
	    };
	    List.prototype.hasChild = function (child) {
	        var c = null, children = this.children;
	        for (var i = 0, len = children.length; i < len; i++) {
	            c = children[i];
	            if (child.uid && c.uid && child.uid == c.uid) {
	                return true;
	            }
	            else if (child === c) {
	                return true;
	            }
	        }
	        return false;
	    };
	    List.prototype.hasChildWithFunc = function (func) {
	        for (var i = 0, len = this.children.length; i < len; i++) {
	            if (func(this.children[i], i)) {
	                return true;
	            }
	        }
	        return false;
	    };
	    List.prototype.getChildren = function () {
	        return this.children;
	    };
	    List.prototype.getChild = function (index) {
	        return this.children[index];
	    };
	    List.prototype.addChild = function (child) {
	        this.children.push(child);
	        return this;
	    };
	    List.prototype.addChildren = function (arg) {
	        if (JudgeUtils.isArray(arg)) {
	            var children = arg;
	            this.children = this.children.concat(children);
	        }
	        else if (arg instanceof List) {
	            var children = arg;
	            this.children = this.children.concat(children.getChildren());
	        }
	        else {
	            var child = arg;
	            this.addChild(child);
	        }
	        return this;
	    };
	    List.prototype.setChildren = function (children) {
	        this.children = children;
	        return this;
	    };
	    List.prototype.unShiftChild = function (child) {
	        this.children.unshift(child);
	    };
	    List.prototype.removeAllChildren = function () {
	        this.children = [];
	        return this;
	    };
	    List.prototype.forEach = function (func, context) {
	        this._forEach(this.children, func, context);
	        return this;
	    };
	    List.prototype.toArray = function () {
	        return this.children;
	    };
	    List.prototype.copyChildren = function () {
	        return this.children.slice(0);
	    };
	    List.prototype.removeChildHelper = function (arg) {
	        var result = null;
	        if (JudgeUtils.isFunction(arg)) {
	            var func = arg;
	            result = this._removeChild(this.children, func);
	        }
	        else if (arg.uid) {
	            result = this._removeChild(this.children, function (e) {
	                if (!e.uid) {
	                    return false;
	                }
	                return e.uid === arg.uid;
	            });
	        }
	        else {
	            result = this._removeChild(this.children, function (e) {
	                return e === arg;
	            });
	        }
	        return result;
	    };
	    List.prototype._forEach = function (arr, func, context) {
	        var scope = context, i = 0, len = arr.length;
	        for (i = 0; i < len; i++) {
	            if (func.call(scope, arr[i], i) === $BREAK) {
	                break;
	            }
	        }
	    };
	    List.prototype._removeChild = function (arr, func) {
	        var self = this, removedElementArr = [], remainElementArr = [];
	        this._forEach(arr, function (e, index) {
	            if (!!func.call(self, e)) {
	                removedElementArr.push(e);
	            }
	            else {
	                remainElementArr.push(e);
	            }
	        });
	        this.children = remainElementArr;
	        return removedElementArr;
	    };
	    return List;
	}());

	var ExtendUtils = (function () {
	    function ExtendUtils() {
	    }
	    ExtendUtils.extendDeep = function (parent, child, filter) {
	        if (filter === void 0) { filter = function (val, i) { return true; }; }
	        var i = null, len = 0, toStr = Object.prototype.toString, sArr = "[object Array]", sOb = "[object Object]", type = "", _child = null;
	        if (toStr.call(parent) === sArr) {
	            _child = child || [];
	            for (i = 0, len = parent.length; i < len; i++) {
	                var member = parent[i];
	                if (!filter(member, i)) {
	                    continue;
	                }
	                if (member.clone) {
	                    _child[i] = member.clone();
	                    continue;
	                }
	                type = toStr.call(member);
	                if (type === sArr || type === sOb) {
	                    _child[i] = type === sArr ? [] : {};
	                    ExtendUtils.extendDeep(member, _child[i]);
	                }
	                else {
	                    _child[i] = member;
	                }
	            }
	        }
	        else if (toStr.call(parent) === sOb) {
	            _child = child || {};
	            for (i in parent) {
	                var member = parent[i];
	                if (!filter(member, i)) {
	                    continue;
	                }
	                if (member.clone) {
	                    _child[i] = member.clone();
	                    continue;
	                }
	                type = toStr.call(member);
	                if (type === sArr || type === sOb) {
	                    _child[i] = type === sArr ? [] : {};
	                    ExtendUtils.extendDeep(member, _child[i]);
	                }
	                else {
	                    _child[i] = member;
	                }
	            }
	        }
	        else {
	            _child = parent;
	        }
	        return _child;
	    };
	    ExtendUtils.extend = function (destination, source) {
	        var property = "";
	        for (property in source) {
	            destination[property] = source[property];
	        }
	        return destination;
	    };
	    ExtendUtils.copyPublicAttri = function (source) {
	        var property = null, destination = {};
	        this.extendDeep(source, destination, function (item, property) {
	            return property.slice(0, 1) !== "_"
	                && !JudgeUtils.isFunction(item);
	        });
	        return destination;
	    };
	    return ExtendUtils;
	}());

	var Collection = (function (_super) {
	    __extends(Collection, _super);
	    function Collection(children) {
	        if (children === void 0) { children = []; }
	        var _this = _super.call(this) || this;
	        _this.children = children;
	        return _this;
	    }
	    Collection.create = function (children) {
	        if (children === void 0) { children = []; }
	        var obj = new this(children);
	        return obj;
	    };
	    Collection.prototype.clone = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        var target = null, isDeep = null;
	        if (args.length === 0) {
	            isDeep = false;
	            target = Collection.create();
	        }
	        else if (args.length === 1) {
	            if (JudgeUtils.isBoolean(args[0])) {
	                target = Collection.create();
	                isDeep = args[0];
	            }
	            else {
	                target = args[0];
	                isDeep = false;
	            }
	        }
	        else {
	            target = args[0];
	            isDeep = args[1];
	        }
	        if (isDeep === true) {
	            target.setChildren(ExtendUtils.extendDeep(this.children));
	        }
	        else {
	            target.setChildren(ExtendUtils.extend([], this.children));
	        }
	        return target;
	    };
	    Collection.prototype.filter = function (func) {
	        var children = this.children, result = [], value = null;
	        for (var i = 0, len = children.length; i < len; i++) {
	            value = children[i];
	            if (func.call(children, value, i)) {
	                result.push(value);
	            }
	        }
	        return Collection.create(result);
	    };
	    Collection.prototype.findOne = function (func) {
	        var scope = this.children, result = null;
	        this.forEach(function (value, index) {
	            if (!func.call(scope, value, index)) {
	                return;
	            }
	            result = value;
	            return $BREAK;
	        });
	        return result;
	    };
	    Collection.prototype.reverse = function () {
	        return Collection.create(this.copyChildren().reverse());
	    };
	    Collection.prototype.removeChild = function (arg) {
	        return Collection.create(this.removeChildHelper(arg));
	    };
	    Collection.prototype.sort = function (func, isSortSelf) {
	        if (isSortSelf === void 0) { isSortSelf = false; }
	        if (isSortSelf) {
	            this.children.sort(func);
	            return this;
	        }
	        return Collection.create(this.copyChildren().sort(func));
	    };
	    Collection.prototype.map = function (func) {
	        var resultArr = [];
	        this.forEach(function (e, index) {
	            var result = func(e, index);
	            if (result !== $REMOVE) {
	                resultArr.push(result);
	            }
	        });
	        return Collection.create(resultArr);
	    };
	    Collection.prototype.removeRepeatItems = function () {
	        var noRepeatList = Collection.create();
	        this.forEach(function (item) {
	            if (noRepeatList.hasChild(item)) {
	                return;
	            }
	            noRepeatList.addChild(item);
	        });
	        return noRepeatList;
	    };
	    Collection.prototype.hasRepeatItems = function () {
	        var noRepeatList = Collection.create(), hasRepeat = false;
	        this.forEach(function (item) {
	            if (noRepeatList.hasChild(item)) {
	                hasRepeat = true;
	                return $BREAK;
	            }
	            noRepeatList.addChild(item);
	        });
	        return hasRepeat;
	    };
	    return Collection;
	}(List));

	var Log = (function () {
	    function Log() {
	    }
	    Log.log = function () {
	        var messages = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            messages[_i] = arguments[_i];
	        }
	        if (!this._exec("log", messages)) {
	            root.alert(messages.join(","));
	        }
	        this._exec("trace", messages);
	    };
	    Log.assert = function (cond) {
	        if (cond) {
	            if (!this._exec("assert", arguments, 1)) {
	                this.log.apply(this, Array.prototype.slice.call(arguments, 1));
	            }
	        }
	    };
	    Log.error = function (cond) {
	        if (cond) {
	            throw new Error(Array.prototype.slice.call(arguments, 1).join("\n"));
	        }
	    };
	    Log.warn = function () {
	        var result = this._exec("warn", arguments);
	        if (!result) {
	            this.log.apply(this, arguments);
	        }
	        else {
	            this._exec("trace", ["warn trace"]);
	        }
	    };
	    Log._exec = function (consoleMethod, args, sliceBegin) {
	        if (sliceBegin === void 0) { sliceBegin = 0; }
	        if (root.console && root.console[consoleMethod]) {
	            root.console[consoleMethod].apply(root.console, Array.prototype.slice.call(args, sliceBegin));
	            return true;
	        }
	        return false;
	    };
	    return Log;
	}());
	Log.info = {
	    INVALID_PARAM: "invalid parameter",
	    helperFunc: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        var result = "";
	        args.forEach(function (val) {
	            result += String(val) + " ";
	        });
	        return result.slice(0, -1);
	    },
	    assertion: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        if (args.length === 2) {
	            return this.helperFunc(args[0], args[1]);
	        }
	        else if (args.length === 3) {
	            return this.helperFunc(args[1], args[0], args[2]);
	        }
	        else {
	            throw new Error("args.length must <= 3");
	        }
	    },
	    FUNC_INVALID: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("invalid");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_MUST: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("must");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_MUST_BE: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("must be");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_MUST_NOT_BE: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("must not be");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_SHOULD: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("should");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_SHOULD_NOT: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("should not");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_SUPPORT: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("support");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_NOT_SUPPORT: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("not support");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_MUST_DEFINE: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("must define");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_MUST_NOT_DEFINE: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("must not define");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_UNKNOW: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("unknow");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_EXPECT: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("expect");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_UNEXPECT: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("unexpect");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_EXIST: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("exist");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_NOT_EXIST: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("not exist");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_ONLY: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("only");
	        return this.assertion.apply(this, args);
	    },
	    FUNC_CAN_NOT: function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        args.unshift("can't");
	        return this.assertion.apply(this, args);
	    }
	};

	var root;
	if (JudgeUtils.isNodeJs() && typeof global != "undefined") {
	    root = global;
	}
	else if (typeof window != "undefined") {
	    root = window;
	}
	else if (typeof self != "undefined") {
	    root = self;
	}
	else {
	    Log.error("no avaliable root!");
	}

	var Hash = (function () {
	    function Hash(children) {
	        if (children === void 0) { children = {}; }
	        this._children = null;
	        this._children = children;
	    }
	    Hash.create = function (children) {
	        if (children === void 0) { children = {}; }
	        var obj = new this(children);
	        return obj;
	    };
	    Hash.prototype.getChildren = function () {
	        return this._children;
	    };
	    Hash.prototype.getCount = function () {
	        var result = 0, children = this._children, key = null;
	        for (key in children) {
	            if (children.hasOwnProperty(key)) {
	                result++;
	            }
	        }
	        return result;
	    };
	    Hash.prototype.getKeys = function () {
	        var result = Collection.create(), children = this._children, key = null;
	        for (key in children) {
	            if (children.hasOwnProperty(key)) {
	                result.addChild(key);
	            }
	        }
	        return result;
	    };
	    Hash.prototype.getValues = function () {
	        var result = Collection.create(), children = this._children, key = null;
	        for (key in children) {
	            if (children.hasOwnProperty(key)) {
	                result.addChild(children[key]);
	            }
	        }
	        return result;
	    };
	    Hash.prototype.getChild = function (key) {
	        return this._children[key];
	    };
	    Hash.prototype.setValue = function (key, value) {
	        this._children[key] = value;
	        return this;
	    };
	    Hash.prototype.addChild = function (key, value) {
	        this._children[key] = value;
	        return this;
	    };
	    Hash.prototype.addChildren = function (arg) {
	        var i = null, children = null;
	        if (arg instanceof Hash) {
	            children = arg.getChildren();
	        }
	        else {
	            children = arg;
	        }
	        for (i in children) {
	            if (children.hasOwnProperty(i)) {
	                this.addChild(i, children[i]);
	            }
	        }
	        return this;
	    };
	    Hash.prototype.appendChild = function (key, value) {
	        if (this._children[key] instanceof Collection) {
	            var c = (this._children[key]);
	            c.addChild(value);
	        }
	        else {
	            this._children[key] = (Collection.create().addChild(value));
	        }
	        return this;
	    };
	    Hash.prototype.setChildren = function (children) {
	        this._children = children;
	    };
	    Hash.prototype.removeChild = function (arg) {
	        var result = [];
	        if (JudgeUtils.isString(arg)) {
	            var key = arg;
	            result.push(this._children[key]);
	            this._children[key] = void 0;
	            delete this._children[key];
	        }
	        else if (JudgeUtils.isFunction(arg)) {
	            var func_1 = arg, self_1 = this;
	            this.forEach(function (val, key) {
	                if (func_1(val, key)) {
	                    result.push(self_1._children[key]);
	                    self_1._children[key] = void 0;
	                    delete self_1._children[key];
	                }
	            });
	        }
	        return Collection.create(result);
	    };
	    Hash.prototype.removeAllChildren = function () {
	        this._children = {};
	    };
	    Hash.prototype.hasChild = function (key) {
	        return this._children[key] !== void 0;
	    };
	    Hash.prototype.hasChildWithFunc = function (func) {
	        var result = false;
	        this.forEach(function (val, key) {
	            if (func(val, key)) {
	                result = true;
	                return $BREAK;
	            }
	        });
	        return result;
	    };
	    Hash.prototype.forEach = function (func, context) {
	        var children = this._children;
	        for (var i in children) {
	            if (children.hasOwnProperty(i)) {
	                if (func.call(context, children[i], i) === $BREAK) {
	                    break;
	                }
	            }
	        }
	        return this;
	    };
	    Hash.prototype.filter = function (func) {
	        var result = {}, children = this._children, value = null;
	        for (var key in children) {
	            if (children.hasOwnProperty(key)) {
	                value = children[key];
	                if (func.call(children, value, key)) {
	                    result[key] = value;
	                }
	            }
	        }
	        return Hash.create(result);
	    };
	    Hash.prototype.findOne = function (func) {
	        var result = [], self = this, scope = this._children;
	        this.forEach(function (val, key) {
	            if (!func.call(scope, val, key)) {
	                return;
	            }
	            result = [key, self.getChild(key)];
	            return $BREAK;
	        });
	        return result;
	    };
	    Hash.prototype.map = function (func) {
	        var resultMap = {};
	        this.forEach(function (val, key) {
	            var result = func(val, key);
	            if (result !== $REMOVE) {
	                Log.error(!JudgeUtils.isArray(result) || result.length !== 2, Log.info.FUNC_MUST_BE("iterator", "[key, value]"));
	                resultMap[result[0]] = result[1];
	            }
	        });
	        return Hash.create(resultMap);
	    };
	    Hash.prototype.toCollection = function () {
	        var result = Collection.create();
	        this.forEach(function (val, key) {
	            if (val instanceof Collection) {
	                result.addChildren(val);
	            }
	            else {
	                result.addChild(val);
	            }
	        });
	        return result;
	    };
	    Hash.prototype.toArray = function () {
	        var result = [];
	        this.forEach(function (val, key) {
	            if (val instanceof Collection) {
	                result = result.concat(val.getChildren());
	            }
	            else {
	                result.push(val);
	            }
	        });
	        return result;
	    };
	    Hash.prototype.clone = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        var target = null, isDeep = null;
	        if (args.length === 0) {
	            isDeep = false;
	            target = Hash.create();
	        }
	        else if (args.length === 1) {
	            if (JudgeUtils.isBoolean(args[0])) {
	                target = Hash.create();
	                isDeep = args[0];
	            }
	            else {
	                target = args[0];
	                isDeep = false;
	            }
	        }
	        else {
	            target = args[0];
	            isDeep = args[1];
	        }
	        if (isDeep === true) {
	            target.setChildren(ExtendUtils.extendDeep(this._children));
	        }
	        else {
	            target.setChildren(ExtendUtils.extend({}, this._children));
	        }
	        return target;
	    };
	    return Hash;
	}());

	var Queue = (function (_super) {
	    __extends(Queue, _super);
	    function Queue(children) {
	        if (children === void 0) { children = []; }
	        var _this = _super.call(this) || this;
	        _this.children = children;
	        return _this;
	    }
	    Queue.create = function (children) {
	        if (children === void 0) { children = []; }
	        var obj = new this(children);
	        return obj;
	    };
	    Object.defineProperty(Queue.prototype, "front", {
	        get: function () {
	            return this.children[this.children.length - 1];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Queue.prototype, "rear", {
	        get: function () {
	            return this.children[0];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Queue.prototype.push = function (element) {
	        this.children.unshift(element);
	    };
	    Queue.prototype.pop = function () {
	        return this.children.pop();
	    };
	    Queue.prototype.clear = function () {
	        this.removeAllChildren();
	    };
	    return Queue;
	}(List));

	var Stack = (function (_super) {
	    __extends(Stack, _super);
	    function Stack(children) {
	        if (children === void 0) { children = []; }
	        var _this = _super.call(this) || this;
	        _this.children = children;
	        return _this;
	    }
	    Stack.create = function (children) {
	        if (children === void 0) { children = []; }
	        var obj = new this(children);
	        return obj;
	    };
	    Object.defineProperty(Stack.prototype, "top", {
	        get: function () {
	            return this.children[this.children.length - 1];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Stack.prototype.push = function (element) {
	        this.children.push(element);
	    };
	    Stack.prototype.pop = function () {
	        return this.children.pop();
	    };
	    Stack.prototype.clear = function () {
	        this.removeAllChildren();
	    };
	    Stack.prototype.clone = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        var target = null, isDeep = null;
	        if (args.length === 0) {
	            isDeep = false;
	            target = Stack.create();
	        }
	        else if (args.length === 1) {
	            if (JudgeUtils.isBoolean(args[0])) {
	                target = Stack.create();
	                isDeep = args[0];
	            }
	            else {
	                target = args[0];
	                isDeep = false;
	            }
	        }
	        else {
	            target = args[0];
	            isDeep = args[1];
	        }
	        if (isDeep === true) {
	            target.setChildren(ExtendUtils.extendDeep(this.children));
	        }
	        else {
	            target.setChildren(ExtendUtils.extend([], this.children));
	        }
	        return target;
	    };
	    Stack.prototype.filter = function (func) {
	        var children = this.children, result = [], value = null;
	        for (var i = 0, len = children.length; i < len; i++) {
	            value = children[i];
	            if (func.call(children, value, i)) {
	                result.push(value);
	            }
	        }
	        return Collection.create(result);
	    };
	    Stack.prototype.findOne = function (func) {
	        var scope = this.children, result = null;
	        this.forEach(function (value, index) {
	            if (!func.call(scope, value, index)) {
	                return;
	            }
	            result = value;
	            return $BREAK;
	        });
	        return result;
	    };
	    Stack.prototype.reverse = function () {
	        return Collection.create(this.copyChildren().reverse());
	    };
	    Stack.prototype.removeChild = function (arg) {
	        return Collection.create(this.removeChildHelper(arg));
	    };
	    Stack.prototype.sort = function (func, isSortSelf) {
	        if (isSortSelf === void 0) { isSortSelf = false; }
	        if (isSortSelf) {
	            this.children.sort(func);
	            return this;
	        }
	        return Collection.create(this.copyChildren().sort(func));
	    };
	    Stack.prototype.map = function (func) {
	        var resultArr = [];
	        this.forEach(function (e, index) {
	            var result = func(e, index);
	            if (result !== $REMOVE) {
	                resultArr.push(result);
	            }
	        });
	        return Collection.create(resultArr);
	    };
	    Stack.prototype.removeRepeatItems = function () {
	        var noRepeatList = Collection.create();
	        this.forEach(function (item) {
	            if (noRepeatList.hasChild(item)) {
	                return;
	            }
	            noRepeatList.addChild(item);
	        });
	        return noRepeatList;
	    };
	    Stack.prototype.hasRepeatItems = function () {
	        var noRepeatList = Collection.create(), hasRepeat = false;
	        this.forEach(function (item) {
	            if (noRepeatList.hasChild(item)) {
	                hasRepeat = true;
	                return $BREAK;
	            }
	            noRepeatList.addChild(item);
	        });
	        return hasRepeat;
	    };
	    return Stack;
	}(List));

	var DomQuery = (function () {
	    function DomQuery() {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        this._doms = null;
	        if (JudgeUtils.isDom(args[0])) {
	            this._doms = [args[0]];
	        }
	        else if (this._isDomEleStr(args[0])) {
	            this._doms = [this._buildDom(args[0])];
	        }
	        else {
	            this._doms = document.querySelectorAll(args[0]);
	        }
	        return this;
	    }
	    DomQuery.create = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        var obj = new this(args[0]);
	        return obj;
	    };
	    DomQuery.prototype.get = function (index) {
	        return this._doms[index];
	    };
	    DomQuery.prototype.prepend = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        var targetDom = null;
	        targetDom = this._buildDom(args[0]);
	        for (var _a = 0, _b = this._doms; _a < _b.length; _a++) {
	            var dom = _b[_a];
	            if (dom.nodeType === 1) {
	                dom.insertBefore(targetDom, dom.firstChild);
	            }
	        }
	        return this;
	    };
	    DomQuery.prototype.prependTo = function (eleStr) {
	        var targetDom = null;
	        targetDom = DomQuery.create(eleStr);
	        for (var _i = 0, _a = this._doms; _i < _a.length; _i++) {
	            var dom = _a[_i];
	            if (dom.nodeType === 1) {
	                targetDom.prepend(dom);
	            }
	        }
	        return this;
	    };
	    DomQuery.prototype.remove = function () {
	        for (var _i = 0, _a = this._doms; _i < _a.length; _i++) {
	            var dom = _a[_i];
	            if (dom && dom.parentNode && dom.tagName != 'BODY') {
	                dom.parentNode.removeChild(dom);
	            }
	        }
	        return this;
	    };
	    DomQuery.prototype.css = function (property, value) {
	        for (var _i = 0, _a = this._doms; _i < _a.length; _i++) {
	            var dom = _a[_i];
	            dom.style[property] = value;
	        }
	    };
	    DomQuery.prototype.attr = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        if (args.length === 1) {
	            var name = args[0];
	            return this.get(0).getAttribute(name);
	        }
	        else {
	            var name = args[0], value = args[1];
	            for (var _a = 0, _b = this._doms; _a < _b.length; _a++) {
	                var dom = _b[_a];
	                dom.setAttribute(name, value);
	            }
	        }
	    };
	    DomQuery.prototype.text = function (str) {
	        var dom = this.get(0);
	        if (str !== void 0) {
	            if (dom.textContent !== void 0) {
	                dom.textContent = str;
	            }
	            else {
	                dom.innerText = str;
	            }
	        }
	        else {
	            return dom.textContent !== void 0 ? dom.textContent : dom.innerText;
	        }
	    };
	    DomQuery.prototype._isDomEleStr = function (eleStr) {
	        return eleStr.match(/<(\w+)[^>]*><\/\1>/) !== null;
	    };
	    DomQuery.prototype._buildDom = function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        if (JudgeUtils.isString(args[0])) {
	            var div = this._createElement("div"), eleStr = args[0];
	            div.innerHTML = eleStr;
	            return div.firstChild;
	        }
	        return args[0];
	    };
	    DomQuery.prototype._createElement = function (eleStr) {
	        return document.createElement(eleStr);
	    };
	    return DomQuery;
	}());

	var Assertion = (function () {
	    function Assertion() {
	    }
	    Assertion.create = function () {
	        var obj = new this();
	        return obj;
	    };
	    Object.defineProperty(Assertion.prototype, "not", {
	        get: function () {
	            ExpectData.isNot = true;
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
	            var source = ExpectData.source;
	            this._assert(!!source === true, "true");
	            return this;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Assertion.prototype, "false", {
	        get: function () {
	            var source = ExpectData.source;
	            this._assert(!!source === false, "false");
	            return this;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Assertion.prototype, "exist", {
	        get: function () {
	            var source = ExpectData.source;
	            this._assert(source !== null && source !== void 0, "exist");
	            return this;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Assertion.prototype, "null", {
	        get: function () {
	            var source = ExpectData.source;
	            this._assert(source === null, "null");
	            return this;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Assertion.prototype, "undefined", {
	        get: function () {
	            var source = ExpectData.source;
	            this._assert(source === void 0, "undefined");
	            return this;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Assertion.prototype.equal = function (n) {
	        var source = ExpectData.source;
	        this._assert(source === n, "equal", n);
	        return this;
	    };
	    Assertion.prototype.gt = function (n) {
	        var source = ExpectData.source;
	        this._assert(source > n, ">", n);
	        return this;
	    };
	    Assertion.prototype.gte = function (n) {
	        var source = ExpectData.source;
	        this._assert(source >= n, ">=", n);
	        return this;
	    };
	    Assertion.prototype.lt = function (n) {
	        var source = ExpectData.source;
	        this._assert(source < n, "<", n);
	        return this;
	    };
	    Assertion.prototype.lte = function (n) {
	        var source = ExpectData.source;
	        this._assert(source <= n, "<=", n);
	        return this;
	    };
	    Assertion.prototype.a = function (type) {
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
	    };
	    Assertion.prototype._buildFailMsg = function (operationStr, target) {
	        if (!!target) {
	            return "expected " + this._format(ExpectData.source) + " to be " + operationStr + " " + target;
	        }
	        return "expected " + this._format(ExpectData.source) + " to be " + operationStr;
	    };
	    Assertion.prototype._assert = function (passCondition, failMsg, target) {
	        var pass = null, failMessage = null;
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
	    };
	    Assertion.prototype._format = function (source) {
	        return source;
	    };
	    return Assertion;
	}());

	var expect = function (source) {
	    var assertion = ExpectData.assertion;
	    ExpectData.source = source;
	    return assertion;
	};
	var _initData = function () {
	    ExpectData.assertion = Assertion.create();
	    ExpectData.isNot = false;
	};
	_initData();

	exports.Assertion = Assertion;
	exports.ExpectData = ExpectData;
	exports.expect = expect;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=wdet.js.map
