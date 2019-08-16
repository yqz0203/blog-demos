(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MVVM"] = factory();
	else
		root["MVVM"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ChildScope.ts":
/*!***************************!*\
  !*** ./src/ChildScope.ts ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ChildScope; });
/* harmony import */ var _Watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Watcher */ "./src/Watcher.ts");
/* harmony import */ var _Compiler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Compiler */ "./src/Compiler.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



class ChildScope {
    constructor(el, parent) {
        this.$parentListener = (n, o, p) => {
            this.$watcher.trigger(p, n, o);
        };
        this.$parent = parent;
        this.$el = el;
        this.$watcher = new _Watcher__WEBPACK_IMPORTED_MODULE_0__["default"](this, {});
        this.$complier = new _Compiler__WEBPACK_IMPORTED_MODULE_1__["default"](this);
        this.$complier.init();
        this.$parent.$watcher.addListener('', this.$parentListener);
    }
    getValue(path) {
        const val = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["getValue"])(this, path);
        if (val === undefined) {
            return this.$parent.getValue(path);
        }
        return val;
    }
    setData(newData) {
        this.$parent.setData(newData);
    }
    getEvent(name) {
        return this.$parent.getEvent(name);
    }
    destroy() {
        this.$complier.destroy();
        this.$watcher.removeAllListeners();
        this.$parent.$watcher.removeListener('', this.$parentListener);
    }
}


/***/ }),

/***/ "./src/Compiler.ts":
/*!*************************!*\
  !*** ./src/Compiler.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Directive */ "./src/Directive.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");


class Compiler {
    constructor(owner) {
        this.directives = [];
        this.owner = owner;
    }
    init() {
        this.traversEL(this.owner.$el);
    }
    destroy() {
        this.directives.forEach(d => d.destroy());
    }
    traversEL(el) {
        if (this.traversAttr(el) === false) {
            return;
        }
        for (let i = 0; i < el.childNodes.length; i++) {
            const node = el.childNodes[i];
            // text
            if (node.nodeType === 3) {
                let nodeValue = node.nodeValue;
                let setNodeValue = (val) => {
                    // chrome 不会触发重绘
                    // if (node.nodeValue !== val) {
                    node.nodeValue = val;
                    // }
                };
                this.parseTemplateAndSet(nodeValue, setNodeValue);
            }
            else if (node.nodeType === 1) {
                this.traversEL(node);
            }
        }
    }
    traversAttr(node) {
        const attributes = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["toArray"])(node.attributes);
        let scopedAttr;
        attributes.some(item => {
            const config = _Directive__WEBPACK_IMPORTED_MODULE_0__["directiveConfigMap"].get(item.name);
            // if的优先级是最高的
            if (item.name === _Directive__WEBPACK_IMPORTED_MODULE_0__["DIRECTIVE_PREFIX"] + 'if') {
                scopedAttr = item;
            }
            if (!scopedAttr && typeof config === 'object' && config.scoped) {
                scopedAttr = item;
            }
        });
        if (scopedAttr) {
            const directive = this.initDirective(node, scopedAttr);
            if (directive && directive.$scoped) {
                return false;
            }
        }
        attributes.forEach(attr => {
            if (!attr)
                return;
            // 指令
            if (attr.name.startsWith(_Directive__WEBPACK_IMPORTED_MODULE_0__["DIRECTIVE_PREFIX"])) {
                this.initDirective(node, attr);
            }
            // dom属性
            else if (attr.name.startsWith(':')) {
                node.removeAttribute(attr.name);
                const attrName = attr.name.substr(1);
                this.parseTemplateAndSet('{{' + attr.value + '}}', (val) => {
                    // @ts-ignore
                    node[attrName] = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["toRealValue"])(val);
                });
            }
            // @ts-ignore
            // 回调函数
            else if (attr.name.startsWith('@')) {
                node.removeAttribute(attr.name);
                const eventName = attr.name.substr(1);
                let eventFuncName = attr.value;
                const parseds = [];
                const matched = eventFuncName.match(/([^()]+)\((.+)\)/);
                // 带参数的回调
                if (matched) {
                    eventFuncName = matched[1];
                    const params = matched[2];
                    params.split(',').forEach(p => {
                        const parsed = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["parseExpression"])(p, 'this.owner');
                        parseds.push(parsed);
                    });
                }
                const cb = this.owner.getEvent(eventFuncName.trim());
                if (cb) {
                    const funcs = parseds.map(parsed => {
                        return new Function('return ' + parsed.expression).bind(this);
                    });
                    node.addEventListener(eventName, e => {
                        cb.apply(null, [e, ...funcs.map(func => func())]);
                    });
                }
            }
            // html属性
            else {
                let cb = (val) => {
                    node.setAttribute(attr.name, val);
                };
                this.parseTemplateAndSet(attr.value, cb);
            }
        });
        return true;
    }
    initDirective(node, attr) {
        node.removeAttribute(attr.name);
        const directiveName = attr.name.replace(new RegExp('^' + _Directive__WEBPACK_IMPORTED_MODULE_0__["DIRECTIVE_PREFIX"]), '');
        const dd = _Directive__WEBPACK_IMPORTED_MODULE_0__["directiveConfigMap"].get(directiveName);
        if (!dd) {
            console.warn('未知的指令：', directiveName);
        }
        else {
            const directive = new _Directive__WEBPACK_IMPORTED_MODULE_0__["default"](this.owner, node, attr.value, dd);
            this.directives.push(directive);
            return directive;
        }
    }
    parseTemplateAndSet(template, setNodeValue) {
        const valueRegexp = /{{([^}]+)}}/g;
        let result = valueRegexp.exec(template);
        let allScopeKeys = [];
        let calContexts = [];
        while (result) {
            const { index } = result;
            let tpl = result[1];
            let fullTpl = result[0];
            const parsed = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["parseExpression"])(tpl, 'this.owner');
            let scopeKeys = parsed.dependencies;
            const fn = new Function('return ' + parsed.expression).bind(this);
            allScopeKeys = [...allScopeKeys, ...scopeKeys];
            calContexts = [
                ...calContexts,
                {
                    startIndex: index,
                    endIndex: index + fullTpl.length,
                    cal: () => fn.apply(this),
                },
            ];
            result = valueRegexp.exec(template);
        }
        const calValue = () => {
            let lastend = 0;
            let value = '';
            for (let i = 0, l = calContexts.length; i < l; i++) {
                value += template.slice(lastend, calContexts[i].startIndex);
                value += calContexts[i].cal();
                value += template.slice(calContexts[i].endIndex, i < l - 1 ? calContexts[i + 1].startIndex : undefined);
                lastend = calContexts[i].endIndex;
            }
            value += template.slice(lastend, calContexts[calContexts.length - 1].startIndex);
            return value;
        };
        allScopeKeys.forEach(k => {
            const listener = () => {
                setNodeValue(calValue());
            };
            this.owner.$watcher.addListener(k, listener);
            listener();
        });
    }
}
/* harmony default export */ __webpack_exports__["default"] = (Compiler);


/***/ }),

/***/ "./src/Directive.ts":
/*!**************************!*\
  !*** ./src/Directive.ts ***!
  \**************************/
/*! exports provided: directiveConfigMap, DIRECTIVE_PREFIX, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "directiveConfigMap", function() { return directiveConfigMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DIRECTIVE_PREFIX", function() { return DIRECTIVE_PREFIX; });
class Directive {
    constructor(owner, el, path, config) {
        this.$el = el;
        this.$owner = owner;
        if (typeof config === 'function') {
            this.config = {
                bind: config,
                update: config,
            };
        }
        else {
            this.config = config;
        }
        this.$owner.$watcher.addListener(path, val => {
            if (this.config.update) {
                this.config.update.call(this, el, { value: val, expression: path });
            }
        });
        this.config.bind.call(this, el, {
            value: this.$owner.getValue(path),
            expression: path,
        });
        this.$scoped = this.config.scoped || false;
    }
    destroy() {
        if (this.config.unbind) {
            this.config.unbind.call(this, this.$el);
        }
    }
}
const directiveConfigMap = new Map();
const DIRECTIVE_PREFIX = 'x-';
/* harmony default export */ __webpack_exports__["default"] = (Directive);


/***/ }),

/***/ "./src/MVVM.ts":
/*!*********************!*\
  !*** ./src/MVVM.ts ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Watcher */ "./src/Watcher.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _Directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Directive */ "./src/Directive.ts");
/* harmony import */ var _Compiler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Compiler */ "./src/Compiler.ts");
/* harmony import */ var _ChildScope__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ChildScope */ "./src/ChildScope.ts");





class MVVM {
    constructor(config) {
        this.$el = config.el;
        this.$watcher = new _Watcher__WEBPACK_IMPORTED_MODULE_0__["default"](this, config.data);
        this.$complier = new _Compiler__WEBPACK_IMPORTED_MODULE_3__["default"](this);
        this.config = config;
        this.initMethods();
        this.initComputed();
        this.initWatch();
        this.$complier.init();
        this.config.created && this.config.created.call(this);
    }
    setData(newData) {
        if (!newData)
            return;
        Object.keys(newData).forEach(k => {
            // @ts-ignore
            this[k] = newData[k];
        });
    }
    getValue(path) {
        return Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getValue"])(this, path);
    }
    getEvent(name) {
        return this[name] ? this[name].bind(this) : '';
    }
    destroy() {
        this.$complier.destroy();
        this.$watcher.removeAllListeners();
        this.config.destroyed && this.config.destroyed.call(this);
    }
    initComputed() {
        const computed = this.config.computed || {};
        const computedKeys = Object.keys(computed);
        computedKeys.forEach(ckey => {
            if (typeof computed[ckey] === 'function') {
                const cb = () => {
                    this[ckey] = computed[ckey].call(this);
                    this.$watcher.trigger(ckey, this[ckey], '');
                };
                this.$watcher.addListener('', cb);
            }
            else if (Array.isArray(computed[ckey])) {
                const value = [...computed[ckey]];
                const fn = value.pop();
                value.forEach(path => {
                    const cb = () => {
                        this[ckey] = fn.call(this);
                        this.$watcher.trigger(ckey, this[ckey], '');
                    };
                    this.$watcher.addListener(path, cb);
                    cb();
                });
            }
        });
    }
    initWatch() {
        const watch = this.config.watch || {};
        const watchKeys = Object.keys(watch);
        watchKeys.forEach(key => {
            this.$watcher.addListener(key, (n, o, key) => {
                watch[key].call(this, n, o);
            });
        });
    }
    initMethods() {
        Object.keys(this.config.methods || {}).forEach(key => {
            // @ts-ignore
            this[key] = this.config.methods[key].bind(this);
        });
    }
}
MVVM.directive = function (name, config) {
    _Directive__WEBPACK_IMPORTED_MODULE_2__["directiveConfigMap"].set(name, config);
};
// 内置指令
MVVM.directive('model', {
    bind(el, binding) {
        this.callback = (e) => {
            const val = e.target.value;
            Object(_utils__WEBPACK_IMPORTED_MODULE_1__["setValue"])(this.$owner, binding.expression, val);
        };
        el.addEventListener('input', this.callback);
        el.value = binding.value;
    },
    update(el, binding) {
        if (el.value === binding.value)
            return;
        el.value = binding.value;
    },
    unbind(el) {
        el.removeEventListener('input', this.callback);
    },
});
MVVM.directive('show', (el, binding) => {
    el.style.display = binding.value ? '' : 'none';
});
MVVM.directive('if', {
    scoped: true,
    bind(el, binding) {
        const html = el.outerHTML;
        this.cEl = document.createComment('-- if block --');
        this.el = el;
        this.onHide = function () {
            this.childScope && this.childScope.destroy();
            this.el.replaceWith(this.cEl);
        };
        this.onShow = function () {
            let nEl = document.createElement('div');
            nEl.innerHTML = html;
            nEl = nEl.firstChild;
            this.el.replaceWith(nEl);
            this.el = nEl;
            this.childScope = new _ChildScope__WEBPACK_IMPORTED_MODULE_4__["default"](this.el, this.$owner);
            this.cEl.replaceWith(this.el);
        };
        if (binding.value === false) {
            this.onHide();
        }
        else {
            this.onShow();
        }
    },
    update(el, binding) {
        if (binding.value === false) {
            this.onHide();
        }
        else {
            this.onShow();
        }
    },
    unbind(el) {
        this.onHide();
    },
});
/* harmony default export */ __webpack_exports__["default"] = (MVVM);


/***/ }),

/***/ "./src/Watcher.ts":
/*!************************!*\
  !*** ./src/Watcher.ts ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

class Token {
    constructor(config) {
        const scope = this;
        const { key, value, obj, cb } = config;
        this.value = value;
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveSetter() {
                return scope.value;
            },
            set: function reactiveGetter(value) {
                const oldValue = scope.value;
                scope.value = value;
                if (oldValue !== value) {
                    cb(value, oldValue);
                }
            },
        });
    }
}
const GLOABL_KEY = 'GLOABL';
class Watcher {
    constructor(owner, data) {
        this.listeners = {};
        Object(_utils__WEBPACK_IMPORTED_MODULE_0__["mergeDescriptor"])(owner, this.traverseData(data));
        this.owner = owner;
    }
    traverseData(data, path = '') {
        const result = {};
        Object.keys(data).forEach(key => {
            const fullPath = (path ? path + '.' : '') + key;
            new Token({
                obj: result,
                key,
                value: Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isPlainObject"])(data[key])
                    ? this.traverseData(data[key], fullPath)
                    : data[key],
                cb: (newVal, oldValue) => {
                    this.handleValueChange(fullPath, newVal, oldValue);
                },
            });
        });
        return result;
    }
    handleValueChange(fullPath, newValue, oldValue) {
        let parent = this.owner;
        const pathArr = fullPath.split('.');
        if (pathArr.length >= 2) {
            parent = new Function('data', `return data.${pathArr.slice(0, pathArr.length - 1).join('.')}`)(this.owner);
        }
        const key = pathArr.pop();
        if (Object(_utils__WEBPACK_IMPORTED_MODULE_0__["isPlainObject"])(newValue)) {
            new Token({
                obj: parent,
                key,
                value: this.traverseData(newValue, fullPath),
                cb: (_newValue, _oldValue) => {
                    this.handleValueChange(fullPath, _newValue, _oldValue);
                },
            });
        }
        this.trigger(fullPath, newValue, oldValue);
    }
    addListener(path, cb) {
        if (!path) {
            path = GLOABL_KEY;
        }
        if (!this.listeners[path]) {
            this.listeners[path] = [];
        }
        this.listeners[path].push(cb);
    }
    removeListener(path, cb) {
        if (!path) {
            path = GLOABL_KEY;
        }
        if (!cb) {
            delete this.listeners[path];
        }
        else {
            (this.listeners[path] || []).filter(item => item === cb);
        }
    }
    removeAllListeners() {
        this.listeners = {};
    }
    trigger(path, newValue, oldValue) {
        if (!path) {
            path = GLOABL_KEY;
        }
        if (!this.listeners[path]) {
            this.listeners[path] = [];
        }
        this.listeners[path].forEach(cb => cb(newValue, oldValue, path));
        // 改变了对象，那么子级也应该收到通知
        Object.keys(this.listeners).forEach(key => {
            if (key !== path && key.startsWith(path)) {
                const k = key.replace(path + '.', '');
                const oldV = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getValue"])(oldValue, k);
                const newV = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getValue"])(newValue, k);
                this.listeners[key].forEach(cb => cb(newV, oldV, key));
            }
        });
        (this.listeners[GLOABL_KEY] || []).forEach(cb => cb(newValue, oldValue, path));
    }
}
// const owner: any = {};
// const watcher = new Watcher(owner, {
//   a: 10,
//   b: {
//     c: 12,
//   },
// });
// watcher.addListener('b', (p1, p2) => {
//   console.log('b changed', p1, p2);
// });
// watcher.addListener('b.c', (p1, p2) => {
//   console.log('b.c changed', p1, p2);
// });
// owner.b = { c: 15 };
// owner.b.c = 'wahahaha';
/* harmony default export */ __webpack_exports__["default"] = (Watcher);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MVVM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MVVM */ "./src/MVVM.ts");

/* harmony default export */ __webpack_exports__["default"] = (_MVVM__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: getValue, setValue, isPlainObject, mergeDescriptor, parseExpression, toRealValue, toArray */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getValue", function() { return getValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setValue", function() { return setValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPlainObject", function() { return isPlainObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeDescriptor", function() { return mergeDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseExpression", function() { return parseExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRealValue", function() { return toRealValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toArray", function() { return toArray; });
function getValue(obj, path, defaultVal = undefined) {
    let val = obj;
    try {
        val = new Function('data', `return data.${path}`)(obj);
    }
    catch (e) {
        return defaultVal;
    }
    return val === undefined ? defaultVal : val;
}
function setValue(obj, path, val) {
    try {
        new Function('data', `data.${path}=${JSON.stringify(val)}`)(obj);
    }
    catch (e) {
        return;
    }
}
function isPlainObject(obj) {
    return typeof obj === 'object' && obj.constructor === Object;
}
function mergeDescriptor(a, b) {
    for (let key in b) {
        Object.defineProperty(a, key, 
        // @ts-ignore
        Object.getOwnPropertyDescriptor(b, key));
    }
}
function parseExpression(expression, scopeName = 'this') {
    let index = 0;
    let max = expression.length;
    let result = '';
    let dependencies = [];
    while (index < max) {
        let char = expression.charAt(index);
        if (/'|"/.test(char)) {
            const c = char;
            let str = "'";
            char = expression.charAt(++index);
            while (char !== undefined && char !== c) {
                str += char;
                char = expression.charAt(++index);
            }
            result += str;
            result += "'";
            index++;
            continue;
        }
        let VARIABLES = /[A-Za-z_]/;
        if (VARIABLES.test(char)) {
            let value = '';
            let path = '';
            let paths = [];
            while (char && /[A-Za-z_0-9.()]/.test(char)) {
                value += char;
                if (char === '.') {
                    paths.push(path);
                    path = '';
                }
                else {
                    path += char;
                }
                char = expression[++index] || '';
            }
            // 特殊值
            if (['true', 'false', 'null', 'undefined'].indexOf(path) >= 0) {
                result += path;
            }
            else {
                if (/^[A-Za-z_0-9]+$/.test(path)) {
                    paths.push(path);
                }
                dependencies.push(paths.join('.'));
                result += scopeName + '.getValue("' + value + '")';
                index++;
                continue;
            }
        }
        result += char;
        index++;
    }
    return {
        expression: result,
        dependencies,
    };
}
function toRealValue(value) {
    if (!value)
        return value;
    if (/^[0-9]?(\.[0-9]+)?$/.test(value)) {
        return Number(value);
    }
    else if (value === 'true') {
        return true;
    }
    else if (value === 'false') {
        return false;
    }
    else if (value === 'null') {
        return null;
    }
    else if (value === 'undefined') {
        return undefined;
    }
    return value;
}
function toArray(value) {
    return Array.prototype.slice.call(value);
}


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9NVlZNL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9NVlZNL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01WVk0vLi9zcmMvQ2hpbGRTY29wZS50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL0NvbXBpbGVyLnRzIiwid2VicGFjazovL01WVk0vLi9zcmMvRGlyZWN0aXZlLnRzIiwid2VicGFjazovL01WVk0vLi9zcmMvTVZWTS50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL1dhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vTVZWTS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7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Q2Q7U0FBTSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7UUFDM0IsT0FBTyxJQUFJLENBQUM7S0FDYjtTQUFNLElBQUksS0FBSyxLQUFLLFdBQVcsRUFBRTtRQUNoQyxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVNLFNBQVMsT0FBTyxDQUFVLEtBQW1CO0lBQ2xELE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk1WVk1cIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTVZWTVwiXSA9IGZhY3RvcnkoKTtcbn0pKHdpbmRvdywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgSU93bmVyIGZyb20gJy4vSU93bmVyJztcbmltcG9ydCBXYXRjaGVyIGZyb20gJy4vV2F0Y2hlcic7XG5pbXBvcnQgQ29tcGlsZXIgZnJvbSAnLi9Db21waWxlcic7XG5pbXBvcnQgeyBnZXRWYWx1ZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGlsZFNjb3BlIGltcGxlbWVudHMgSU93bmVyIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICAkcGFyZW50OiBJT3duZXI7XG4gICR3YXRjaGVyOiBXYXRjaGVyO1xuICAkZWw6IGFueTtcbiAgJGNvbXBsaWVyOiBDb21waWxlcjtcbiAgJHBhcmVudExpc3RlbmVyID0gKG46IGFueSwgbzogYW55LCBwOiBzdHJpbmcpID0+IHtcbiAgICB0aGlzLiR3YXRjaGVyLnRyaWdnZXIocCwgbiwgbyk7XG4gIH07XG5cbiAgY29uc3RydWN0b3IoZWw6IGFueSwgcGFyZW50OiBJT3duZXIpIHtcbiAgICB0aGlzLiRwYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy4kZWwgPSBlbDtcbiAgICB0aGlzLiR3YXRjaGVyID0gbmV3IFdhdGNoZXIodGhpcywge30pO1xuICAgIHRoaXMuJGNvbXBsaWVyID0gbmV3IENvbXBpbGVyKHRoaXMpO1xuICAgIHRoaXMuJGNvbXBsaWVyLmluaXQoKTtcblxuICAgIHRoaXMuJHBhcmVudC4kd2F0Y2hlci5hZGRMaXN0ZW5lcignJywgdGhpcy4kcGFyZW50TGlzdGVuZXIpO1xuICB9XG5cbiAgZ2V0VmFsdWUocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgdmFsID0gZ2V0VmFsdWUodGhpcywgcGF0aCk7XG5cbiAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLiRwYXJlbnQuZ2V0VmFsdWUocGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIHNldERhdGEobmV3RGF0YTogYW55KSB7XG4gICAgdGhpcy4kcGFyZW50LnNldERhdGEobmV3RGF0YSk7XG4gIH1cblxuICBnZXRFdmVudChuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy4kcGFyZW50LmdldEV2ZW50KG5hbWUpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLiRjb21wbGllci5kZXN0cm95KCk7XG4gICAgdGhpcy4kd2F0Y2hlci5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLiRwYXJlbnQuJHdhdGNoZXIucmVtb3ZlTGlzdGVuZXIoJycsIHRoaXMuJHBhcmVudExpc3RlbmVyKTtcbiAgfVxufVxuIiwiaW1wb3J0IERpcmVjdGl2ZSwgeyBkaXJlY3RpdmVDb25maWdNYXAsIERJUkVDVElWRV9QUkVGSVggfSBmcm9tICcuL0RpcmVjdGl2ZSc7XG5pbXBvcnQgeyBwYXJzZUV4cHJlc3Npb24sIHRvUmVhbFZhbHVlLCB0b0FycmF5IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgSU93bmVyIGZyb20gJy4vSU93bmVyJztcblxuY2xhc3MgQ29tcGlsZXIge1xuICBvd25lcjogSU93bmVyO1xuICBkaXJlY3RpdmVzOiBEaXJlY3RpdmVbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKG93bmVyOiBJT3duZXIpIHtcbiAgICB0aGlzLm93bmVyID0gb3duZXI7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMudHJhdmVyc0VMKHRoaXMub3duZXIuJGVsKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5kaXJlY3RpdmVzLmZvckVhY2goZCA9PiBkLmRlc3Ryb3koKSk7XG4gIH1cblxuICBwcml2YXRlIHRyYXZlcnNFTChlbDogSFRNTEVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy50cmF2ZXJzQXR0cihlbCkgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBub2RlOiBhbnkgPSBlbC5jaGlsZE5vZGVzW2ldO1xuXG4gICAgICAvLyB0ZXh0XG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMykge1xuICAgICAgICBsZXQgbm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWUhO1xuXG4gICAgICAgIGxldCBzZXROb2RlVmFsdWUgPSAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAvLyBjaHJvbWUg5LiN5Lya6Kem5Y+R6YeN57uYXG4gICAgICAgICAgLy8gaWYgKG5vZGUubm9kZVZhbHVlICE9PSB2YWwpIHtcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHZhbDtcbiAgICAgICAgICAvLyB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wYXJzZVRlbXBsYXRlQW5kU2V0KG5vZGVWYWx1ZSwgc2V0Tm9kZVZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICB0aGlzLnRyYXZlcnNFTChub2RlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyYXZlcnNBdHRyKG5vZGU6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRvQXJyYXkobm9kZS5hdHRyaWJ1dGVzKTtcblxuICAgIGxldCBzY29wZWRBdHRyOiBhbnk7XG5cbiAgICBhdHRyaWJ1dGVzLnNvbWUoaXRlbSA9PiB7XG4gICAgICBjb25zdCBjb25maWcgPSBkaXJlY3RpdmVDb25maWdNYXAuZ2V0KGl0ZW0ubmFtZSk7XG5cbiAgICAgIC8vIGlm55qE5LyY5YWI57qn5piv5pyA6auY55qEXG4gICAgICBpZiAoaXRlbS5uYW1lID09PSBESVJFQ1RJVkVfUFJFRklYICsgJ2lmJykge1xuICAgICAgICBzY29wZWRBdHRyID0gaXRlbTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFzY29wZWRBdHRyICYmIHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnICYmIGNvbmZpZy5zY29wZWQpIHtcbiAgICAgICAgc2NvcGVkQXR0ciA9IGl0ZW07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoc2NvcGVkQXR0cikge1xuICAgICAgY29uc3QgZGlyZWN0aXZlID0gdGhpcy5pbml0RGlyZWN0aXZlKG5vZGUsIHNjb3BlZEF0dHIpO1xuXG4gICAgICBpZiAoZGlyZWN0aXZlICYmIGRpcmVjdGl2ZS4kc2NvcGVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhdHRyaWJ1dGVzLmZvckVhY2goYXR0ciA9PiB7XG4gICAgICBpZiAoIWF0dHIpIHJldHVybjtcblxuICAgICAgLy8g5oyH5LukXG4gICAgICBpZiAoYXR0ci5uYW1lLnN0YXJ0c1dpdGgoRElSRUNUSVZFX1BSRUZJWCkpIHtcbiAgICAgICAgdGhpcy5pbml0RGlyZWN0aXZlKG5vZGUsIGF0dHIpO1xuICAgICAgfVxuICAgICAgLy8gZG9t5bGe5oCnXG4gICAgICBlbHNlIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aCgnOicpKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgICAgIGNvbnN0IGF0dHJOYW1lID0gYXR0ci5uYW1lLnN1YnN0cigxKTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQoJ3t7JyArIGF0dHIudmFsdWUgKyAnfX0nLCAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgbm9kZVthdHRyTmFtZV0gPSB0b1JlYWxWYWx1ZSh2YWwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIC8vIOWbnuiwg+WHveaVsFxuICAgICAgZWxzZSBpZiAoYXR0ci5uYW1lLnN0YXJ0c1dpdGgoJ0AnKSkge1xuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgICBjb25zdCBldmVudE5hbWUgPSBhdHRyLm5hbWUuc3Vic3RyKDEpO1xuICAgICAgICBsZXQgZXZlbnRGdW5jTmFtZSA9IGF0dHIudmFsdWU7XG4gICAgICAgIGNvbnN0IHBhcnNlZHM6IEFycmF5PFJldHVyblR5cGU8dHlwZW9mIHBhcnNlRXhwcmVzc2lvbj4+ID0gW107XG4gICAgICAgIGNvbnN0IG1hdGNoZWQgPSBldmVudEZ1bmNOYW1lLm1hdGNoKC8oW14oKV0rKVxcKCguKylcXCkvKTtcbiAgICAgICAgLy8g5bim5Y+C5pWw55qE5Zue6LCDXG4gICAgICAgIGlmIChtYXRjaGVkKSB7XG4gICAgICAgICAgZXZlbnRGdW5jTmFtZSA9IG1hdGNoZWRbMV07XG4gICAgICAgICAgY29uc3QgcGFyYW1zID0gbWF0Y2hlZFsyXTtcbiAgICAgICAgICBwYXJhbXMuc3BsaXQoJywnKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VFeHByZXNzaW9uKHAsICd0aGlzLm93bmVyJyk7XG4gICAgICAgICAgICBwYXJzZWRzLnB1c2gocGFyc2VkKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNiID0gdGhpcy5vd25lci5nZXRFdmVudChldmVudEZ1bmNOYW1lLnRyaW0oKSk7XG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNvbnN0IGZ1bmNzID0gcGFyc2Vkcy5tYXAocGFyc2VkID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgcGFyc2VkLmV4cHJlc3Npb24pLmJpbmQodGhpcyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICAgICAgICBjYi5hcHBseShudWxsLCBbZSwgLi4uZnVuY3MubWFwKGZ1bmMgPT4gZnVuYygpKV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBodG1s5bGe5oCnXG4gICAgICBlbHNlIHtcbiAgICAgICAgbGV0IGNiID0gKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCB2YWwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucGFyc2VUZW1wbGF0ZUFuZFNldChhdHRyLnZhbHVlLCBjYik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdERpcmVjdGl2ZShub2RlOiBhbnksIGF0dHI6IEF0dHIpIHtcbiAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgIGNvbnN0IGRpcmVjdGl2ZU5hbWUgPSBhdHRyLm5hbWUucmVwbGFjZShcbiAgICAgIG5ldyBSZWdFeHAoJ14nICsgRElSRUNUSVZFX1BSRUZJWCksXG4gICAgICAnJ1xuICAgICk7XG4gICAgY29uc3QgZGQgPSBkaXJlY3RpdmVDb25maWdNYXAuZ2V0KGRpcmVjdGl2ZU5hbWUpO1xuXG4gICAgaWYgKCFkZCkge1xuICAgICAgY29uc29sZS53YXJuKCfmnKrnn6XnmoTmjIfku6TvvJonLCBkaXJlY3RpdmVOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGlyZWN0aXZlID0gbmV3IERpcmVjdGl2ZSh0aGlzLm93bmVyLCBub2RlLCBhdHRyLnZhbHVlLCBkZCk7XG4gICAgICB0aGlzLmRpcmVjdGl2ZXMucHVzaChkaXJlY3RpdmUpO1xuXG4gICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VUZW1wbGF0ZUFuZFNldChcbiAgICB0ZW1wbGF0ZTogc3RyaW5nLFxuICAgIHNldE5vZGVWYWx1ZTogKHZhbDogc3RyaW5nKSA9PiB2b2lkXG4gICkge1xuICAgIGNvbnN0IHZhbHVlUmVnZXhwID0gL3t7KFtefV0rKX19L2c7XG5cbiAgICBsZXQgcmVzdWx0ID0gdmFsdWVSZWdleHAuZXhlYyh0ZW1wbGF0ZSk7XG4gICAgbGV0IGFsbFNjb3BlS2V5czogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgY2FsQ29udGV4dHM6IEFycmF5PHtcbiAgICAgIHN0YXJ0SW5kZXg6IG51bWJlcjtcbiAgICAgIGVuZEluZGV4OiBudW1iZXI7XG4gICAgICBjYWw6ICgpID0+IHN0cmluZztcbiAgICB9PiA9IFtdO1xuXG4gICAgd2hpbGUgKHJlc3VsdCkge1xuICAgICAgY29uc3QgeyBpbmRleCB9ID0gcmVzdWx0O1xuICAgICAgbGV0IHRwbCA9IHJlc3VsdFsxXTtcbiAgICAgIGxldCBmdWxsVHBsID0gcmVzdWx0WzBdO1xuXG4gICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUV4cHJlc3Npb24odHBsLCAndGhpcy5vd25lcicpO1xuICAgICAgbGV0IHNjb3BlS2V5cyA9IHBhcnNlZC5kZXBlbmRlbmNpZXM7XG5cbiAgICAgIGNvbnN0IGZuID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gJyArIHBhcnNlZC5leHByZXNzaW9uKS5iaW5kKHRoaXMpO1xuXG4gICAgICBhbGxTY29wZUtleXMgPSBbLi4uYWxsU2NvcGVLZXlzLCAuLi5zY29wZUtleXNdO1xuICAgICAgY2FsQ29udGV4dHMgPSBbXG4gICAgICAgIC4uLmNhbENvbnRleHRzLFxuICAgICAgICB7XG4gICAgICAgICAgc3RhcnRJbmRleDogaW5kZXgsXG4gICAgICAgICAgZW5kSW5kZXg6IGluZGV4ICsgZnVsbFRwbC5sZW5ndGgsXG4gICAgICAgICAgY2FsOiAoKSA9PiBmbi5hcHBseSh0aGlzKSxcbiAgICAgICAgfSxcbiAgICAgIF07XG5cbiAgICAgIHJlc3VsdCA9IHZhbHVlUmVnZXhwLmV4ZWModGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbFZhbHVlID0gKCkgPT4ge1xuICAgICAgbGV0IGxhc3RlbmQgPSAwO1xuICAgICAgbGV0IHZhbHVlID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGNhbENvbnRleHRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShsYXN0ZW5kLCBjYWxDb250ZXh0c1tpXS5zdGFydEluZGV4KTtcbiAgICAgICAgdmFsdWUgKz0gY2FsQ29udGV4dHNbaV0uY2FsKCk7XG4gICAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKFxuICAgICAgICAgIGNhbENvbnRleHRzW2ldLmVuZEluZGV4LFxuICAgICAgICAgIGkgPCBsIC0gMSA/IGNhbENvbnRleHRzW2kgKyAxXS5zdGFydEluZGV4IDogdW5kZWZpbmVkXG4gICAgICAgICk7XG4gICAgICAgIGxhc3RlbmQgPSBjYWxDb250ZXh0c1tpXS5lbmRJbmRleDtcbiAgICAgIH1cblxuICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UoXG4gICAgICAgIGxhc3RlbmQsXG4gICAgICAgIGNhbENvbnRleHRzW2NhbENvbnRleHRzLmxlbmd0aCAtIDFdLnN0YXJ0SW5kZXhcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgYWxsU2NvcGVLZXlzLmZvckVhY2goayA9PiB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgc2V0Tm9kZVZhbHVlKGNhbFZhbHVlKCkpO1xuICAgICAgfTtcbiAgICAgIHRoaXMub3duZXIuJHdhdGNoZXIuYWRkTGlzdGVuZXIoaywgbGlzdGVuZXIpO1xuICAgICAgbGlzdGVuZXIoKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb21waWxlcjtcbiIsImltcG9ydCBJT3duZXIgZnJvbSAnLi9JT3duZXInO1xuXG50eXBlIE9iamVjdERpcmVjdGl2ZUNvbmZpZyA9IHtcbiAgc2NvcGVkPzogYm9vbGVhbjtcbiAgYmluZCh0aGlzOiBEaXJlY3RpdmUsIGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogYW55KTogdm9pZDtcbiAgdXBkYXRlPyh0aGlzOiBEaXJlY3RpdmUsIGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogYW55KTogdm9pZDtcbiAgdW5iaW5kPyh0aGlzOiBEaXJlY3RpdmUsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQ7XG59O1xuXG50eXBlIEZ1bmN0aW9uRGlyZWN0aXZlQ29uZmlnID0gKGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgdHlwZSBEaXJlY3RpdmVDb25maWcgPSBPYmplY3REaXJlY3RpdmVDb25maWcgfCBGdW5jdGlvbkRpcmVjdGl2ZUNvbmZpZztcblxuY2xhc3MgRGlyZWN0aXZlIHtcbiAgcHJpdmF0ZSBjb25maWc6IE9iamVjdERpcmVjdGl2ZUNvbmZpZztcbiAgJGVsOiBIVE1MRWxlbWVudDtcbiAgJG93bmVyOiBJT3duZXI7XG4gICRzY29wZWQ6IGJvb2xlYW47XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbiAgY29uc3RydWN0b3IoXG4gICAgb3duZXI6IElPd25lcixcbiAgICBlbDogSFRNTEVsZW1lbnQsXG4gICAgcGF0aDogc3RyaW5nLFxuICAgIGNvbmZpZzogRGlyZWN0aXZlQ29uZmlnXG4gICkge1xuICAgIHRoaXMuJGVsID0gZWw7XG4gICAgdGhpcy4kb3duZXIgPSBvd25lcjtcblxuICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgYmluZDogY29uZmlnLFxuICAgICAgICB1cGRhdGU6IGNvbmZpZyxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIH1cblxuICAgIHRoaXMuJG93bmVyLiR3YXRjaGVyLmFkZExpc3RlbmVyKHBhdGgsIHZhbCA9PiB7XG4gICAgICBpZiAodGhpcy5jb25maWcudXBkYXRlKSB7XG4gICAgICAgIHRoaXMuY29uZmlnLnVwZGF0ZS5jYWxsKHRoaXMsIGVsLCB7IHZhbHVlOiB2YWwsIGV4cHJlc3Npb246IHBhdGggfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbmZpZy5iaW5kLmNhbGwodGhpcywgZWwsIHtcbiAgICAgIHZhbHVlOiB0aGlzLiRvd25lci5nZXRWYWx1ZShwYXRoKSxcbiAgICAgIGV4cHJlc3Npb246IHBhdGgsXG4gICAgfSk7XG5cbiAgICB0aGlzLiRzY29wZWQgPSB0aGlzLmNvbmZpZy5zY29wZWQgfHwgZmFsc2U7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy51bmJpbmQpIHtcbiAgICAgIHRoaXMuY29uZmlnLnVuYmluZC5jYWxsKHRoaXMsIHRoaXMuJGVsKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRpcmVjdGl2ZUNvbmZpZ01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXJlY3RpdmVDb25maWc+KCk7XG5cbmV4cG9ydCBjb25zdCBESVJFQ1RJVkVfUFJFRklYID0gJ3gtJztcblxuZXhwb3J0IGRlZmF1bHQgRGlyZWN0aXZlO1xuIiwiaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi9XYXRjaGVyJztcbmltcG9ydCB7IHNldFZhbHVlLCBnZXRWYWx1ZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRGlyZWN0aXZlQ29uZmlnLCBkaXJlY3RpdmVDb25maWdNYXAgfSBmcm9tICcuL0RpcmVjdGl2ZSc7XG5pbXBvcnQgQ29tcGlsZXIgZnJvbSAnLi9Db21waWxlcic7XG5pbXBvcnQgSU93bmVyIGZyb20gJy4vSU93bmVyJztcbmltcG9ydCBDaGlsZFNjb3BlIGZyb20gJy4vQ2hpbGRTY29wZSc7XG5cbmludGVyZmFjZSBNVlZNQ29uZmlnIHtcbiAgZWw6IEhUTUxFbGVtZW50O1xuICBkYXRhOiBhbnk7XG4gIGNyZWF0ZWQ/OiAoKSA9PiB2b2lkO1xuICBkZXN0cm95ZWQ/OiAoKSA9PiB2b2lkO1xuICB3YXRjaD86IHsgW2tleTogc3RyaW5nXTogKG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpID0+IHZvaWQgfTtcbiAgY29tcHV0ZWQ6IGFueTtcbiAgbWV0aG9kczogYW55O1xufVxuXG5jbGFzcyBNVlZNIGltcGxlbWVudHMgSU93bmVyIHtcbiAgc3RhdGljIGRpcmVjdGl2ZSA9IGZ1bmN0aW9uKG5hbWU6IHN0cmluZywgY29uZmlnOiBEaXJlY3RpdmVDb25maWcpIHtcbiAgICBkaXJlY3RpdmVDb25maWdNYXAuc2V0KG5hbWUsIGNvbmZpZyk7XG4gIH07XG5cbiAgJGVsOiBIVE1MRWxlbWVudDtcbiAgJHdhdGNoZXI6IFdhdGNoZXI7XG4gICRjb21wbGllcjogQ29tcGlsZXI7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcblxuICBwcml2YXRlIGNvbmZpZzogTVZWTUNvbmZpZztcbiAgY29uc3RydWN0b3IoY29uZmlnOiBNVlZNQ29uZmlnKSB7XG4gICAgdGhpcy4kZWwgPSBjb25maWcuZWw7XG4gICAgdGhpcy4kd2F0Y2hlciA9IG5ldyBXYXRjaGVyKHRoaXMsIGNvbmZpZy5kYXRhKTtcbiAgICB0aGlzLiRjb21wbGllciA9IG5ldyBDb21waWxlcih0aGlzKTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIHRoaXMuaW5pdE1ldGhvZHMoKTtcbiAgICB0aGlzLmluaXRDb21wdXRlZCgpO1xuICAgIHRoaXMuaW5pdFdhdGNoKCk7XG4gICAgdGhpcy4kY29tcGxpZXIuaW5pdCgpO1xuICAgIHRoaXMuY29uZmlnLmNyZWF0ZWQgJiYgdGhpcy5jb25maWcuY3JlYXRlZC5jYWxsKHRoaXMpO1xuICB9XG5cbiAgc2V0RGF0YShuZXdEYXRhOiBhbnkpIHtcbiAgICBpZiAoIW5ld0RhdGEpIHJldHVybjtcbiAgICBPYmplY3Qua2V5cyhuZXdEYXRhKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpc1trXSA9IG5ld0RhdGFba107XG4gICAgfSk7XG4gIH1cblxuICBnZXRWYWx1ZShwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gZ2V0VmFsdWUodGhpcywgcGF0aCk7XG4gIH1cblxuICBnZXRFdmVudChuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpc1tuYW1lXSA/IHRoaXNbbmFtZV0uYmluZCh0aGlzKSA6ICcnO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLiRjb21wbGllci5kZXN0cm95KCk7XG4gICAgdGhpcy4kd2F0Y2hlci5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLmNvbmZpZy5kZXN0cm95ZWQgJiYgdGhpcy5jb25maWcuZGVzdHJveWVkLmNhbGwodGhpcyk7XG4gIH1cblxuICBwcml2YXRlIGluaXRDb21wdXRlZCgpIHtcbiAgICBjb25zdCBjb21wdXRlZCA9IHRoaXMuY29uZmlnLmNvbXB1dGVkIHx8IHt9O1xuICAgIGNvbnN0IGNvbXB1dGVkS2V5cyA9IE9iamVjdC5rZXlzKGNvbXB1dGVkKTtcblxuICAgIGNvbXB1dGVkS2V5cy5mb3JFYWNoKGNrZXkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBjb21wdXRlZFtja2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzW2NrZXldID0gY29tcHV0ZWRbY2tleV0uY2FsbCh0aGlzKTtcbiAgICAgICAgICB0aGlzLiR3YXRjaGVyLnRyaWdnZXIoY2tleSwgdGhpc1tja2V5XSwgJycpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiR3YXRjaGVyLmFkZExpc3RlbmVyKCcnLCBjYik7XG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY29tcHV0ZWRbY2tleV0pKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gWy4uLmNvbXB1dGVkW2NrZXldXTtcbiAgICAgICAgY29uc3QgZm4gPSB2YWx1ZS5wb3AoKTtcbiAgICAgICAgdmFsdWUuZm9yRWFjaChwYXRoID0+IHtcbiAgICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXNbY2tleV0gPSBmbi5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy4kd2F0Y2hlci50cmlnZ2VyKGNrZXksIHRoaXNbY2tleV0sICcnKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMuJHdhdGNoZXIuYWRkTGlzdGVuZXIocGF0aCwgY2IpO1xuICAgICAgICAgIGNiKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0V2F0Y2goKSB7XG4gICAgY29uc3Qgd2F0Y2ggPSB0aGlzLmNvbmZpZy53YXRjaCB8fCB7fTtcbiAgICBjb25zdCB3YXRjaEtleXMgPSBPYmplY3Qua2V5cyh3YXRjaCk7XG4gICAgd2F0Y2hLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHRoaXMuJHdhdGNoZXIuYWRkTGlzdGVuZXIoa2V5LCAobiwgbywga2V5KSA9PiB7XG4gICAgICAgIHdhdGNoW2tleV0uY2FsbCh0aGlzLCBuLCBvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0TWV0aG9kcygpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5tZXRob2RzIHx8IHt9KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzW2tleV0gPSB0aGlzLmNvbmZpZy5tZXRob2RzW2tleV0uYmluZCh0aGlzKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vLyDlhoXnva7mjIfku6Rcbk1WVk0uZGlyZWN0aXZlKCdtb2RlbCcsIHtcbiAgYmluZChlbDogYW55LCBiaW5kaW5nKSB7XG4gICAgdGhpcy5jYWxsYmFjayA9IChlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHZhbCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgc2V0VmFsdWUodGhpcy4kb3duZXIsIGJpbmRpbmcuZXhwcmVzc2lvbiwgdmFsKTtcbiAgICB9O1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5jYWxsYmFjayk7XG4gICAgZWwudmFsdWUgPSBiaW5kaW5nLnZhbHVlO1xuICB9LFxuICB1cGRhdGUoZWw6IGFueSwgYmluZGluZykge1xuICAgIGlmIChlbC52YWx1ZSA9PT0gYmluZGluZy52YWx1ZSkgcmV0dXJuO1xuICAgIGVsLnZhbHVlID0gYmluZGluZy52YWx1ZTtcbiAgfSxcbiAgdW5iaW5kKGVsKSB7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmNhbGxiYWNrKTtcbiAgfSxcbn0pO1xuXG5NVlZNLmRpcmVjdGl2ZSgnc2hvdycsIChlbCwgYmluZGluZykgPT4ge1xuICBlbC5zdHlsZS5kaXNwbGF5ID0gYmluZGluZy52YWx1ZSA/ICcnIDogJ25vbmUnO1xufSk7XG5cbk1WVk0uZGlyZWN0aXZlKCdpZicsIHtcbiAgc2NvcGVkOiB0cnVlLFxuICBiaW5kKGVsOiBIVE1MRWxlbWVudCwgYmluZGluZykge1xuICAgIGNvbnN0IGh0bWwgPSBlbC5vdXRlckhUTUw7XG4gICAgdGhpcy5jRWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCctLSBpZiBibG9jayAtLScpO1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLm9uSGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jaGlsZFNjb3BlICYmIHRoaXMuY2hpbGRTY29wZS5kZXN0cm95KCk7XG4gICAgICB0aGlzLmVsLnJlcGxhY2VXaXRoKHRoaXMuY0VsKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vblNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBuRWw6IGFueSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbkVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICBuRWwgPSBuRWwuZmlyc3RDaGlsZDtcblxuICAgICAgdGhpcy5lbC5yZXBsYWNlV2l0aChuRWwpO1xuICAgICAgdGhpcy5lbCA9IG5FbDtcbiAgICAgIHRoaXMuY2hpbGRTY29wZSA9IG5ldyBDaGlsZFNjb3BlKHRoaXMuZWwsIHRoaXMuJG93bmVyKTtcbiAgICAgIHRoaXMuY0VsLnJlcGxhY2VXaXRoKHRoaXMuZWwpO1xuICAgIH07XG5cbiAgICBpZiAoYmluZGluZy52YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuICB1cGRhdGUoZWw6IGFueSwgYmluZGluZykge1xuICAgIGlmIChiaW5kaW5nLnZhbHVlID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG4gIHVuYmluZChlbCkge1xuICAgIHRoaXMub25IaWRlKCk7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTVZWTTtcbiIsImltcG9ydCB7IGdldFZhbHVlLCBpc1BsYWluT2JqZWN0LCBtZXJnZURlc2NyaXB0b3IgfSBmcm9tICcuL3V0aWxzJztcblxudHlwZSBDYWxsYmFjayA9ICh2YWw6IGFueSwgb2xkVmFsdWU6IGFueSkgPT4gdm9pZDtcbnR5cGUgQ2FsbGJhY2tXaXRoUGF0aCA9ICh2YWw6IGFueSwgb2xkVmFsdWU6IGFueSwgcGF0aDogc3RyaW5nKSA9PiB2b2lkO1xuXG5jbGFzcyBUb2tlbiB7XG4gIHByaXZhdGUgdmFsdWU6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IHsgb2JqOiBhbnk7IGtleTogc3RyaW5nOyB2YWx1ZTogYW55OyBjYjogQ2FsbGJhY2sgfSkge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcztcbiAgICBjb25zdCB7IGtleSwgdmFsdWUsIG9iaiwgY2IgfSA9IGNvbmZpZztcblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gcmVhY3RpdmVTZXR0ZXIoKSB7XG4gICAgICAgIHJldHVybiBzY29wZS52YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlR2V0dGVyKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gc2NvcGUudmFsdWU7XG4gICAgICAgIHNjb3BlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICBjYih2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IEdMT0FCTF9LRVkgPSAnR0xPQUJMJztcblxuY2xhc3MgV2F0Y2hlciB7XG4gIG93bmVyOiBhbnk7XG4gIGxpc3RlbmVyczoge1xuICAgIFtwYXRoOiBzdHJpbmddOiBDYWxsYmFja1dpdGhQYXRoW107XG4gIH0gPSB7fTtcbiAgY29uc3RydWN0b3Iob3duZXI6IGFueSwgZGF0YTogYW55KSB7XG4gICAgbWVyZ2VEZXNjcmlwdG9yKG93bmVyLCB0aGlzLnRyYXZlcnNlRGF0YShkYXRhKSk7XG4gICAgdGhpcy5vd25lciA9IG93bmVyO1xuICB9XG5cbiAgdHJhdmVyc2VEYXRhKGRhdGE6IGFueSwgcGF0aCA9ICcnKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgZnVsbFBhdGggPSAocGF0aCA/IHBhdGggKyAnLicgOiAnJykgKyBrZXk7XG5cbiAgICAgIG5ldyBUb2tlbih7XG4gICAgICAgIG9iajogcmVzdWx0LFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiBpc1BsYWluT2JqZWN0KGRhdGFba2V5XSlcbiAgICAgICAgICA/IHRoaXMudHJhdmVyc2VEYXRhKGRhdGFba2V5XSwgZnVsbFBhdGgpXG4gICAgICAgICAgOiBkYXRhW2tleV0sXG4gICAgICAgIGNiOiAobmV3VmFsLCBvbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGgsIG5ld1ZhbCwgb2xkVmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGhhbmRsZVZhbHVlQ2hhbmdlKGZ1bGxQYXRoOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpIHtcbiAgICBsZXQgcGFyZW50ID0gdGhpcy5vd25lcjtcbiAgICBjb25zdCBwYXRoQXJyID0gZnVsbFBhdGguc3BsaXQoJy4nKTtcbiAgICBpZiAocGF0aEFyci5sZW5ndGggPj0gMikge1xuICAgICAgcGFyZW50ID0gbmV3IEZ1bmN0aW9uKFxuICAgICAgICAnZGF0YScsXG4gICAgICAgIGByZXR1cm4gZGF0YS4ke3BhdGhBcnIuc2xpY2UoMCwgcGF0aEFyci5sZW5ndGggLSAxKS5qb2luKCcuJyl9YFxuICAgICAgKSh0aGlzLm93bmVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBrZXk6IHN0cmluZyA9IHBhdGhBcnIucG9wKCkhO1xuXG4gICAgaWYgKGlzUGxhaW5PYmplY3QobmV3VmFsdWUpKSB7XG4gICAgICBuZXcgVG9rZW4oe1xuICAgICAgICBvYmo6IHBhcmVudCxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogdGhpcy50cmF2ZXJzZURhdGEobmV3VmFsdWUsIGZ1bGxQYXRoKSxcbiAgICAgICAgY2I6IChfbmV3VmFsdWUsIF9vbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGgsIF9uZXdWYWx1ZSwgX29sZFZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcihmdWxsUGF0aCwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIGFkZExpc3RlbmVyKHBhdGg6IHN0cmluZywgY2I6IENhbGxiYWNrV2l0aFBhdGgpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbcGF0aF0pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0ucHVzaChjYik7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihwYXRoOiBzdHJpbmcsIGNiPzogQ2FsbGJhY2tXaXRoUGF0aCkge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IEdMT0FCTF9LRVk7XG4gICAgfVxuXG4gICAgaWYgKCFjYikge1xuICAgICAgZGVsZXRlIHRoaXMubGlzdGVuZXJzW3BhdGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICAodGhpcy5saXN0ZW5lcnNbcGF0aF0gfHwgW10pLmZpbHRlcihpdGVtID0+IGl0ZW0gPT09IGNiKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVBbGxMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgfVxuXG4gIHRyaWdnZXIocGF0aDogc3RyaW5nLCBuZXdWYWx1ZTogYW55LCBvbGRWYWx1ZTogYW55KSB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gR0xPQUJMX0tFWTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubGlzdGVuZXJzW3BhdGhdKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyc1twYXRoXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdLmZvckVhY2goY2IgPT4gY2IobmV3VmFsdWUsIG9sZFZhbHVlLCBwYXRoKSk7XG5cbiAgICAvLyDmlLnlj5jkuoblr7nosaHvvIzpgqPkuYjlrZDnuqfkuZ/lupTor6XmlLbliLDpgJrnn6VcbiAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKGtleSAhPT0gcGF0aCAmJiBrZXkuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICBjb25zdCBrID0ga2V5LnJlcGxhY2UocGF0aCArICcuJywgJycpO1xuICAgICAgICBjb25zdCBvbGRWID0gZ2V0VmFsdWUob2xkVmFsdWUsIGspO1xuICAgICAgICBjb25zdCBuZXdWID0gZ2V0VmFsdWUobmV3VmFsdWUsIGspO1xuICAgICAgICB0aGlzLmxpc3RlbmVyc1trZXldLmZvckVhY2goY2IgPT4gY2IobmV3Viwgb2xkViwga2V5KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAodGhpcy5saXN0ZW5lcnNbR0xPQUJMX0tFWV0gfHwgW10pLmZvckVhY2goY2IgPT5cbiAgICAgIGNiKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgcGF0aClcbiAgICApO1xuICB9XG59XG5cbi8vIGNvbnN0IG93bmVyOiBhbnkgPSB7fTtcblxuLy8gY29uc3Qgd2F0Y2hlciA9IG5ldyBXYXRjaGVyKG93bmVyLCB7XG4vLyAgIGE6IDEwLFxuLy8gICBiOiB7XG4vLyAgICAgYzogMTIsXG4vLyAgIH0sXG4vLyB9KTtcblxuLy8gd2F0Y2hlci5hZGRMaXN0ZW5lcignYicsIChwMSwgcDIpID0+IHtcbi8vICAgY29uc29sZS5sb2coJ2IgY2hhbmdlZCcsIHAxLCBwMik7XG4vLyB9KTtcblxuLy8gd2F0Y2hlci5hZGRMaXN0ZW5lcignYi5jJywgKHAxLCBwMikgPT4ge1xuLy8gICBjb25zb2xlLmxvZygnYi5jIGNoYW5nZWQnLCBwMSwgcDIpO1xuLy8gfSk7XG5cbi8vIG93bmVyLmIgPSB7IGM6IDE1IH07XG4vLyBvd25lci5iLmMgPSAnd2FoYWhhaGEnO1xuXG5leHBvcnQgZGVmYXVsdCBXYXRjaGVyO1xuIiwiaW1wb3J0IE1WVk0gZnJvbSAnLi9NVlZNJztcblxuZXhwb3J0IGRlZmF1bHQgTVZWTTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRWYWx1ZShvYmo6IGFueSwgcGF0aDogc3RyaW5nLCBkZWZhdWx0VmFsID0gdW5kZWZpbmVkKSB7XG4gIGxldCB2YWwgPSBvYmo7XG4gIHRyeSB7XG4gICAgdmFsID0gbmV3IEZ1bmN0aW9uKCdkYXRhJywgYHJldHVybiBkYXRhLiR7cGF0aH1gKShvYmopO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWw7XG4gIH1cbiAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbCA6IHZhbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFZhbHVlKG9iajogYW55LCBwYXRoOiBzdHJpbmcsIHZhbDogYW55KSB7XG4gIHRyeSB7XG4gICAgbmV3IEZ1bmN0aW9uKCdkYXRhJywgYGRhdGEuJHtwYXRofT0ke0pTT04uc3RyaW5naWZ5KHZhbCl9YCkob2JqKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmo6IGFueSkge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlc2NyaXB0b3IoYTogYW55LCBiOiBhbnkpIHtcbiAgZm9yIChsZXQga2V5IGluIGIpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICBhLFxuICAgICAga2V5LFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiLCBrZXkpXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKFxuICBleHByZXNzaW9uOiBzdHJpbmcsXG4gIHNjb3BlTmFtZTogc3RyaW5nID0gJ3RoaXMnXG4pIHtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IG1heCA9IGV4cHJlc3Npb24ubGVuZ3RoO1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGxldCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG5cbiAgd2hpbGUgKGluZGV4IDwgbWF4KSB7XG4gICAgbGV0IGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdChpbmRleCk7XG5cbiAgICBpZiAoLyd8XCIvLnRlc3QoY2hhcikpIHtcbiAgICAgIGNvbnN0IGMgPSBjaGFyO1xuICAgICAgbGV0IHN0ciA9IFwiJ1wiO1xuICAgICAgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KCsraW5kZXgpO1xuICAgICAgd2hpbGUgKGNoYXIgIT09IHVuZGVmaW5lZCAmJiBjaGFyICE9PSBjKSB7XG4gICAgICAgIHN0ciArPSBjaGFyO1xuICAgICAgICBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoKytpbmRleCk7XG4gICAgICB9XG4gICAgICByZXN1bHQgKz0gc3RyO1xuICAgICAgcmVzdWx0ICs9IFwiJ1wiO1xuICAgICAgaW5kZXgrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGxldCBWQVJJQUJMRVMgPSAvW0EtWmEtel9dLztcbiAgICBpZiAoVkFSSUFCTEVTLnRlc3QoY2hhcikpIHtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuXG4gICAgICBsZXQgcGF0aCA9ICcnO1xuICAgICAgbGV0IHBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgd2hpbGUgKGNoYXIgJiYgL1tBLVphLXpfMC05LigpXS8udGVzdChjaGFyKSkge1xuICAgICAgICB2YWx1ZSArPSBjaGFyO1xuXG4gICAgICAgIGlmIChjaGFyID09PSAnLicpIHtcbiAgICAgICAgICBwYXRocy5wdXNoKHBhdGgpO1xuICAgICAgICAgIHBhdGggPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRoICs9IGNoYXI7XG4gICAgICAgIH1cbiAgICAgICAgY2hhciA9IGV4cHJlc3Npb25bKytpbmRleF0gfHwgJyc7XG4gICAgICB9XG5cbiAgICAgIC8vIOeJueauiuWAvFxuICAgICAgaWYgKFsndHJ1ZScsICdmYWxzZScsICdudWxsJywgJ3VuZGVmaW5lZCddLmluZGV4T2YocGF0aCkgPj0gMCkge1xuICAgICAgICByZXN1bHQgKz0gcGF0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICgvXltBLVphLXpfMC05XSskLy50ZXN0KHBhdGgpKSB7XG4gICAgICAgICAgcGF0aHMucHVzaChwYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlcGVuZGVuY2llcy5wdXNoKHBhdGhzLmpvaW4oJy4nKSk7XG4gICAgICAgIHJlc3VsdCArPSBzY29wZU5hbWUgKyAnLmdldFZhbHVlKFwiJyArIHZhbHVlICsgJ1wiKSc7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdCArPSBjaGFyO1xuICAgIGluZGV4Kys7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGV4cHJlc3Npb246IHJlc3VsdCxcbiAgICBkZXBlbmRlbmNpZXMsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1JlYWxWYWx1ZSh2YWx1ZTogYW55KSB7XG4gIGlmICghdmFsdWUpIHJldHVybiB2YWx1ZTtcblxuICBpZiAoL15bMC05XT8oXFwuWzAtOV0rKT8kLy50ZXN0KHZhbHVlKSkge1xuICAgIHJldHVybiBOdW1iZXIodmFsdWUpO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ251bGwnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXk8VCA9IGFueT4odmFsdWU6IEFycmF5TGlrZTxUPik6IEFycmF5PFQ+IHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHZhbHVlKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=