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
    constructor(el, parent, data = {}) {
        this.$parentListener = (n, o, p) => {
            this.$watcher.trigger(p, n, o);
        };
        this.$parent = parent;
        this.$el = el;
        this.$watcher = new _Watcher__WEBPACK_IMPORTED_MODULE_0__["default"](this, data);
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
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

class Directive {
    constructor(owner, el, exp, config) {
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
        const { expression, dependencies } = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["parseExpression"])(exp, 'this.$owner');
        const fn = new Function('return ' + expression).bind(this);
        this.listener = () => {
            const value = fn();
            if (this.config.update) {
                this.config.update.call(this, el, { value, expression: exp });
            }
        };
        dependencies.forEach(dp => {
            this.$owner.$watcher.addListener(dp, this.listener);
        });
        this.removeListeners = () => {
            dependencies.forEach(dp => this.$owner.$watcher.removeListener(dp, this.listener));
        };
        this.config.bind.call(this, el, {
            value: fn(),
            expression: exp,
        });
        this.$scoped = this.config.scoped || false;
    }
    destroy() {
        if (this.config.unbind) {
            this.config.unbind.call(this, this.$el);
        }
        this.removeListeners();
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
            this.$owner.setData({ [binding.expression]: val });
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
    destroy() {
        this.removeAllListeners();
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
        if (char === '{' || char === ',') {
            result += char;
            char = expression.charAt(++index);
            while (char !== ':') {
                result += char;
                char = expression.charAt(++index);
            }
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
            index--;
            char = '';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9NVlZNL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9NVlZNL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01WVk0vLi9zcmMvQ2hpbGRTY29wZS50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL0NvbXBpbGVyLnRzIiwid2VicGFjazovL01WVk0vLi9zcmMvRGlyZWN0aXZlLnRzIiwid2VicGFjazovL01WVk0vLi9zcmMvTVZWTS50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL1dhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vTVZWTS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7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O0tBQ2I7U0FBTSxJQUFJLEtBQUssS0FBSyxXQUFXLEVBQUU7UUFDaEMsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFTSxTQUFTLE9BQU8sQ0FBVSxLQUFtQjtJQUNsRCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJNVlZNXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk1WVk1cIl0gPSBmYWN0b3J5KCk7XG59KSh3aW5kb3csIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHsgSU93bmVyLCBJRGVzdHJveSB9IGZyb20gJy4vdHlwaW5nJztcbmltcG9ydCBXYXRjaGVyIGZyb20gJy4vV2F0Y2hlcic7XG5pbXBvcnQgQ29tcGlsZXIgZnJvbSAnLi9Db21waWxlcic7XG5pbXBvcnQgeyBnZXRWYWx1ZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGlsZFNjb3BlIGltcGxlbWVudHMgSU93bmVyLCBJRGVzdHJveSB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbiAgJHBhcmVudDogSU93bmVyO1xuICAkd2F0Y2hlcjogV2F0Y2hlcjtcbiAgJGVsOiBhbnk7XG4gICRjb21wbGllcjogQ29tcGlsZXI7XG4gICRwYXJlbnRMaXN0ZW5lciA9IChuOiBhbnksIG86IGFueSwgcDogc3RyaW5nKSA9PiB7XG4gICAgdGhpcy4kd2F0Y2hlci50cmlnZ2VyKHAsIG4sIG8pO1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGVsOiBhbnksIHBhcmVudDogSU93bmVyLCBkYXRhOiBhbnkgPSB7fSkge1xuICAgIHRoaXMuJHBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLiRlbCA9IGVsO1xuICAgIHRoaXMuJHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih0aGlzLCBkYXRhKTtcbiAgICB0aGlzLiRjb21wbGllciA9IG5ldyBDb21waWxlcih0aGlzKTtcbiAgICB0aGlzLiRjb21wbGllci5pbml0KCk7XG5cbiAgICB0aGlzLiRwYXJlbnQuJHdhdGNoZXIuYWRkTGlzdGVuZXIoJycsIHRoaXMuJHBhcmVudExpc3RlbmVyKTtcbiAgfVxuXG4gIGdldFZhbHVlKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHZhbCA9IGdldFZhbHVlKHRoaXMsIHBhdGgpO1xuXG4gICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy4kcGFyZW50LmdldFZhbHVlKHBhdGgpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBzZXREYXRhKG5ld0RhdGE6IGFueSkge1xuICAgIHRoaXMuJHBhcmVudC5zZXREYXRhKG5ld0RhdGEpO1xuICB9XG5cbiAgZ2V0RXZlbnQobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuJHBhcmVudC5nZXRFdmVudChuYW1lKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kY29tcGxpZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuJHdhdGNoZXIucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgdGhpcy4kcGFyZW50LiR3YXRjaGVyLnJlbW92ZUxpc3RlbmVyKCcnLCB0aGlzLiRwYXJlbnRMaXN0ZW5lcik7XG4gIH1cbn1cbiIsImltcG9ydCBEaXJlY3RpdmUsIHsgZGlyZWN0aXZlQ29uZmlnTWFwLCBESVJFQ1RJVkVfUFJFRklYIH0gZnJvbSAnLi9EaXJlY3RpdmUnO1xuaW1wb3J0IHsgcGFyc2VFeHByZXNzaW9uLCB0b1JlYWxWYWx1ZSwgdG9BcnJheSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgSU93bmVyLCBJRGVzdHJveSB9IGZyb20gJy4vdHlwaW5nJztcblxuY2xhc3MgQ29tcGlsZXIgaW1wbGVtZW50cyBJRGVzdHJveSB7XG4gIG93bmVyOiBJT3duZXI7XG4gIGRpcmVjdGl2ZXM6IERpcmVjdGl2ZVtdID0gW107XG5cbiAgY29uc3RydWN0b3Iob3duZXI6IElPd25lcikge1xuICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy50cmF2ZXJzRUwodGhpcy5vd25lci4kZWwpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRpcmVjdGl2ZXMuZm9yRWFjaChkID0+IGQuZGVzdHJveSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgdHJhdmVyc0VMKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLnRyYXZlcnNBdHRyKGVsKSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IGVsLmNoaWxkTm9kZXNbaV07XG5cbiAgICAgIC8vIHRleHRcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIGxldCBub2RlVmFsdWUgPSBub2RlLm5vZGVWYWx1ZSE7XG5cbiAgICAgICAgbGV0IHNldE5vZGVWYWx1ZSA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIGNocm9tZSDkuI3kvJrop6blj5Hph43nu5hcbiAgICAgICAgICAvLyBpZiAobm9kZS5ub2RlVmFsdWUgIT09IHZhbCkge1xuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gdmFsO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQobm9kZVZhbHVlLCBzZXROb2RlVmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIHRoaXMudHJhdmVyc0VMKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhdmVyc0F0dHIobm9kZTogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdG9BcnJheShub2RlLmF0dHJpYnV0ZXMpO1xuXG4gICAgbGV0IHNjb3BlZEF0dHI6IGFueTtcblxuICAgIGF0dHJpYnV0ZXMuc29tZShpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGRpcmVjdGl2ZUNvbmZpZ01hcC5nZXQoaXRlbS5uYW1lKTtcblxuICAgICAgLy8gaWbnmoTkvJjlhYjnuqfmmK/mnIDpq5jnmoRcbiAgICAgIGlmIChpdGVtLm5hbWUgPT09IERJUkVDVElWRV9QUkVGSVggKyAnaWYnKSB7XG4gICAgICAgIHNjb3BlZEF0dHIgPSBpdGVtO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNjb3BlZEF0dHIgJiYgdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgJiYgY29uZmlnLnNjb3BlZCkge1xuICAgICAgICBzY29wZWRBdHRyID0gaXRlbTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChzY29wZWRBdHRyKSB7XG4gICAgICBjb25zdCBkaXJlY3RpdmUgPSB0aGlzLmluaXREaXJlY3RpdmUobm9kZSwgc2NvcGVkQXR0cik7XG5cbiAgICAgIGlmIChkaXJlY3RpdmUgJiYgZGlyZWN0aXZlLiRzY29wZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgIGlmICghYXR0cikgcmV0dXJuO1xuXG4gICAgICAvLyDmjIfku6RcbiAgICAgIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aChESVJFQ1RJVkVfUFJFRklYKSkge1xuICAgICAgICB0aGlzLmluaXREaXJlY3RpdmUobm9kZSwgYXR0cik7XG4gICAgICB9XG4gICAgICAvLyBkb23lsZ7mgKdcbiAgICAgIGVsc2UgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKCc6JykpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICAgICAgY29uc3QgYXR0ck5hbWUgPSBhdHRyLm5hbWUuc3Vic3RyKDEpO1xuXG4gICAgICAgIHRoaXMucGFyc2VUZW1wbGF0ZUFuZFNldCgne3snICsgYXR0ci52YWx1ZSArICd9fScsICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBub2RlW2F0dHJOYW1lXSA9IHRvUmVhbFZhbHVlKHZhbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgLy8g5Zue6LCD5Ye95pWwXG4gICAgICBlbHNlIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aCgnQCcpKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGF0dHIubmFtZS5zdWJzdHIoMSk7XG4gICAgICAgIGxldCBldmVudEZ1bmNOYW1lID0gYXR0ci52YWx1ZTtcbiAgICAgICAgY29uc3QgcGFyc2VkczogQXJyYXk8UmV0dXJuVHlwZTx0eXBlb2YgcGFyc2VFeHByZXNzaW9uPj4gPSBbXTtcbiAgICAgICAgY29uc3QgbWF0Y2hlZCA9IGV2ZW50RnVuY05hbWUubWF0Y2goLyhbXigpXSspXFwoKC4rKVxcKS8pO1xuICAgICAgICAvLyDluKblj4LmlbDnmoTlm57osINcbiAgICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgICBldmVudEZ1bmNOYW1lID0gbWF0Y2hlZFsxXTtcbiAgICAgICAgICBjb25zdCBwYXJhbXMgPSBtYXRjaGVkWzJdO1xuICAgICAgICAgIHBhcmFtcy5zcGxpdCgnLCcpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUV4cHJlc3Npb24ocCwgJ3RoaXMub3duZXInKTtcbiAgICAgICAgICAgIHBhcnNlZHMucHVzaChwYXJzZWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2IgPSB0aGlzLm93bmVyLmdldEV2ZW50KGV2ZW50RnVuY05hbWUudHJpbSgpKTtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY29uc3QgZnVuY3MgPSBwYXJzZWRzLm1hcChwYXJzZWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbigncmV0dXJuICcgKyBwYXJzZWQuZXhwcmVzc2lvbikuYmluZCh0aGlzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBlID0+IHtcbiAgICAgICAgICAgIGNiLmFwcGx5KG51bGwsIFtlLCAuLi5mdW5jcy5tYXAoZnVuYyA9PiBmdW5jKCkpXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGh0bWzlsZ7mgKdcbiAgICAgIGVsc2Uge1xuICAgICAgICBsZXQgY2IgPSAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIHZhbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wYXJzZVRlbXBsYXRlQW5kU2V0KGF0dHIudmFsdWUsIGNiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0RGlyZWN0aXZlKG5vZGU6IGFueSwgYXR0cjogQXR0cikge1xuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgY29uc3QgZGlyZWN0aXZlTmFtZSA9IGF0dHIubmFtZS5yZXBsYWNlKFxuICAgICAgbmV3IFJlZ0V4cCgnXicgKyBESVJFQ1RJVkVfUFJFRklYKSxcbiAgICAgICcnXG4gICAgKTtcbiAgICBjb25zdCBkZCA9IGRpcmVjdGl2ZUNvbmZpZ01hcC5nZXQoZGlyZWN0aXZlTmFtZSk7XG5cbiAgICBpZiAoIWRkKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+acquefpeeahOaMh+S7pO+8micsIGRpcmVjdGl2ZU5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkaXJlY3RpdmUgPSBuZXcgRGlyZWN0aXZlKHRoaXMub3duZXIsIG5vZGUsIGF0dHIudmFsdWUsIGRkKTtcbiAgICAgIHRoaXMuZGlyZWN0aXZlcy5wdXNoKGRpcmVjdGl2ZSk7XG5cbiAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZVRlbXBsYXRlQW5kU2V0KFxuICAgIHRlbXBsYXRlOiBzdHJpbmcsXG4gICAgc2V0Tm9kZVZhbHVlOiAodmFsOiBzdHJpbmcpID0+IHZvaWRcbiAgKSB7XG4gICAgY29uc3QgdmFsdWVSZWdleHAgPSAve3soW159XSspfX0vZztcblxuICAgIGxldCByZXN1bHQgPSB2YWx1ZVJlZ2V4cC5leGVjKHRlbXBsYXRlKTtcbiAgICBsZXQgYWxsU2NvcGVLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBjYWxDb250ZXh0czogQXJyYXk8e1xuICAgICAgc3RhcnRJbmRleDogbnVtYmVyO1xuICAgICAgZW5kSW5kZXg6IG51bWJlcjtcbiAgICAgIGNhbDogKCkgPT4gc3RyaW5nO1xuICAgIH0+ID0gW107XG5cbiAgICB3aGlsZSAocmVzdWx0KSB7XG4gICAgICBjb25zdCB7IGluZGV4IH0gPSByZXN1bHQ7XG4gICAgICBsZXQgdHBsID0gcmVzdWx0WzFdO1xuICAgICAgbGV0IGZ1bGxUcGwgPSByZXN1bHRbMF07XG5cbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlRXhwcmVzc2lvbih0cGwsICd0aGlzLm93bmVyJyk7XG4gICAgICBsZXQgc2NvcGVLZXlzID0gcGFyc2VkLmRlcGVuZGVuY2llcztcblxuICAgICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgcGFyc2VkLmV4cHJlc3Npb24pLmJpbmQodGhpcyk7XG5cbiAgICAgIGFsbFNjb3BlS2V5cyA9IFsuLi5hbGxTY29wZUtleXMsIC4uLnNjb3BlS2V5c107XG4gICAgICBjYWxDb250ZXh0cyA9IFtcbiAgICAgICAgLi4uY2FsQ29udGV4dHMsXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFydEluZGV4OiBpbmRleCxcbiAgICAgICAgICBlbmRJbmRleDogaW5kZXggKyBmdWxsVHBsLmxlbmd0aCxcbiAgICAgICAgICBjYWw6ICgpID0+IGZuLmFwcGx5KHRoaXMpLFxuICAgICAgICB9LFxuICAgICAgXTtcblxuICAgICAgcmVzdWx0ID0gdmFsdWVSZWdleHAuZXhlYyh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FsVmFsdWUgPSAoKSA9PiB7XG4gICAgICBsZXQgbGFzdGVuZCA9IDA7XG4gICAgICBsZXQgdmFsdWUgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gY2FsQ29udGV4dHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKGxhc3RlbmQsIGNhbENvbnRleHRzW2ldLnN0YXJ0SW5kZXgpO1xuICAgICAgICB2YWx1ZSArPSBjYWxDb250ZXh0c1tpXS5jYWwoKTtcbiAgICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UoXG4gICAgICAgICAgY2FsQ29udGV4dHNbaV0uZW5kSW5kZXgsXG4gICAgICAgICAgaSA8IGwgLSAxID8gY2FsQ29udGV4dHNbaSArIDFdLnN0YXJ0SW5kZXggOiB1bmRlZmluZWRcbiAgICAgICAgKTtcbiAgICAgICAgbGFzdGVuZCA9IGNhbENvbnRleHRzW2ldLmVuZEluZGV4O1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShcbiAgICAgICAgbGFzdGVuZCxcbiAgICAgICAgY2FsQ29udGV4dHNbY2FsQ29udGV4dHMubGVuZ3RoIC0gMV0uc3RhcnRJbmRleFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBhbGxTY29wZUtleXMuZm9yRWFjaChrID0+IHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBzZXROb2RlVmFsdWUoY2FsVmFsdWUoKSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5vd25lci4kd2F0Y2hlci5hZGRMaXN0ZW5lcihrLCBsaXN0ZW5lcik7XG4gICAgICBsaXN0ZW5lcigpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBpbGVyO1xuIiwiaW1wb3J0IHsgSU93bmVyLCBJRGVzdHJveSB9IGZyb20gJy4vdHlwaW5nJztcbmltcG9ydCB7IHBhcnNlRXhwcmVzc2lvbiB9IGZyb20gJy4vdXRpbHMnO1xuXG50eXBlIE9iamVjdERpcmVjdGl2ZUNvbmZpZyA9IHtcbiAgc2NvcGVkPzogYm9vbGVhbjtcbiAgYmluZCh0aGlzOiBEaXJlY3RpdmUsIGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogYW55KTogdm9pZDtcbiAgdXBkYXRlPyh0aGlzOiBEaXJlY3RpdmUsIGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogYW55KTogdm9pZDtcbiAgdW5iaW5kPyh0aGlzOiBEaXJlY3RpdmUsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQ7XG59O1xuXG50eXBlIEZ1bmN0aW9uRGlyZWN0aXZlQ29uZmlnID0gKGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgdHlwZSBEaXJlY3RpdmVDb25maWcgPSBPYmplY3REaXJlY3RpdmVDb25maWcgfCBGdW5jdGlvbkRpcmVjdGl2ZUNvbmZpZztcblxuY2xhc3MgRGlyZWN0aXZlIGltcGxlbWVudHMgSURlc3Ryb3kge1xuICBwcml2YXRlIGNvbmZpZzogT2JqZWN0RGlyZWN0aXZlQ29uZmlnO1xuICBwcml2YXRlIGxpc3RlbmVyOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIHJlbW92ZUxpc3RlbmVyczogKCkgPT4gdm9pZDtcbiAgJGVsOiBIVE1MRWxlbWVudDtcbiAgJG93bmVyOiBJT3duZXI7XG4gICRzY29wZWQ6IGJvb2xlYW47XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbiAgY29uc3RydWN0b3IoXG4gICAgb3duZXI6IElPd25lcixcbiAgICBlbDogSFRNTEVsZW1lbnQsXG4gICAgZXhwOiBzdHJpbmcsXG4gICAgY29uZmlnOiBEaXJlY3RpdmVDb25maWdcbiAgKSB7XG4gICAgdGhpcy4kZWwgPSBlbDtcbiAgICB0aGlzLiRvd25lciA9IG93bmVyO1xuXG4gICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgICBiaW5kOiBjb25maWcsXG4gICAgICAgIHVwZGF0ZTogY29uZmlnLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgY29uc3QgeyBleHByZXNzaW9uLCBkZXBlbmRlbmNpZXMgfSA9IHBhcnNlRXhwcmVzc2lvbihleHAsICd0aGlzLiRvd25lcicpO1xuICAgIGNvbnN0IGZuID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gJyArIGV4cHJlc3Npb24pLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBmbigpO1xuICAgICAgaWYgKHRoaXMuY29uZmlnLnVwZGF0ZSkge1xuICAgICAgICB0aGlzLmNvbmZpZy51cGRhdGUuY2FsbCh0aGlzLCBlbCwgeyB2YWx1ZSwgZXhwcmVzc2lvbjogZXhwIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaChkcCA9PiB7XG4gICAgICB0aGlzLiRvd25lci4kd2F0Y2hlci5hZGRMaXN0ZW5lcihkcCwgdGhpcy5saXN0ZW5lcik7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVycyA9ICgpID0+IHtcbiAgICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKGRwID0+XG4gICAgICAgIHRoaXMuJG93bmVyLiR3YXRjaGVyLnJlbW92ZUxpc3RlbmVyKGRwLCB0aGlzLmxpc3RlbmVyKVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWcuYmluZC5jYWxsKHRoaXMsIGVsLCB7XG4gICAgICB2YWx1ZTogZm4oKSxcbiAgICAgIGV4cHJlc3Npb246IGV4cCxcbiAgICB9KTtcblxuICAgIHRoaXMuJHNjb3BlZCA9IHRoaXMuY29uZmlnLnNjb3BlZCB8fCBmYWxzZTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnVuYmluZCkge1xuICAgICAgdGhpcy5jb25maWcudW5iaW5kLmNhbGwodGhpcywgdGhpcy4kZWwpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVycygpO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkaXJlY3RpdmVDb25maWdNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlyZWN0aXZlQ29uZmlnPigpO1xuXG5leHBvcnQgY29uc3QgRElSRUNUSVZFX1BSRUZJWCA9ICd4LSc7XG5cbmV4cG9ydCBkZWZhdWx0IERpcmVjdGl2ZTtcbiIsImltcG9ydCBXYXRjaGVyIGZyb20gJy4vV2F0Y2hlcic7XG5pbXBvcnQgeyBzZXRWYWx1ZSwgZ2V0VmFsdWUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IERpcmVjdGl2ZUNvbmZpZywgZGlyZWN0aXZlQ29uZmlnTWFwIH0gZnJvbSAnLi9EaXJlY3RpdmUnO1xuaW1wb3J0IENvbXBpbGVyIGZyb20gJy4vQ29tcGlsZXInO1xuaW1wb3J0IHsgSU93bmVyIH0gZnJvbSAnLi90eXBpbmcnO1xuaW1wb3J0IENoaWxkU2NvcGUgZnJvbSAnLi9DaGlsZFNjb3BlJztcblxuaW50ZXJmYWNlIE1WVk1Db25maWcge1xuICBlbDogSFRNTEVsZW1lbnQ7XG4gIGRhdGE6IGFueTtcbiAgY3JlYXRlZD86ICgpID0+IHZvaWQ7XG4gIGRlc3Ryb3llZD86ICgpID0+IHZvaWQ7XG4gIHdhdGNoPzogeyBba2V5OiBzdHJpbmddOiAobmV3VmFsdWU6IGFueSwgb2xkVmFsdWU6IGFueSkgPT4gdm9pZCB9O1xuICBjb21wdXRlZDogYW55O1xuICBtZXRob2RzOiBhbnk7XG59XG5cbmNsYXNzIE1WVk0gaW1wbGVtZW50cyBJT3duZXIge1xuICBzdGF0aWMgZGlyZWN0aXZlID0gZnVuY3Rpb24obmFtZTogc3RyaW5nLCBjb25maWc6IERpcmVjdGl2ZUNvbmZpZykge1xuICAgIGRpcmVjdGl2ZUNvbmZpZ01hcC5zZXQobmFtZSwgY29uZmlnKTtcbiAgfTtcblxuICAkZWw6IEhUTUxFbGVtZW50O1xuICAkd2F0Y2hlcjogV2F0Y2hlcjtcbiAgJGNvbXBsaWVyOiBDb21waWxlcjtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuXG4gIHByaXZhdGUgY29uZmlnOiBNVlZNQ29uZmlnO1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IE1WVk1Db25maWcpIHtcbiAgICB0aGlzLiRlbCA9IGNvbmZpZy5lbDtcbiAgICB0aGlzLiR3YXRjaGVyID0gbmV3IFdhdGNoZXIodGhpcywgY29uZmlnLmRhdGEpO1xuICAgIHRoaXMuJGNvbXBsaWVyID0gbmV3IENvbXBpbGVyKHRoaXMpO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgdGhpcy5pbml0TWV0aG9kcygpO1xuICAgIHRoaXMuaW5pdENvbXB1dGVkKCk7XG4gICAgdGhpcy5pbml0V2F0Y2goKTtcbiAgICB0aGlzLiRjb21wbGllci5pbml0KCk7XG4gICAgdGhpcy5jb25maWcuY3JlYXRlZCAmJiB0aGlzLmNvbmZpZy5jcmVhdGVkLmNhbGwodGhpcyk7XG4gIH1cblxuICBzZXREYXRhKG5ld0RhdGE6IGFueSkge1xuICAgIGlmICghbmV3RGF0YSkgcmV0dXJuO1xuICAgIE9iamVjdC5rZXlzKG5ld0RhdGEpLmZvckVhY2goayA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzW2tdID0gbmV3RGF0YVtrXTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFZhbHVlKHBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBnZXRWYWx1ZSh0aGlzLCBwYXRoKTtcbiAgfVxuXG4gIGdldEV2ZW50KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzW25hbWVdID8gdGhpc1tuYW1lXS5iaW5kKHRoaXMpIDogJyc7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuJGNvbXBsaWVyLmRlc3Ryb3koKTtcbiAgICB0aGlzLiR3YXRjaGVyLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgIHRoaXMuY29uZmlnLmRlc3Ryb3llZCAmJiB0aGlzLmNvbmZpZy5kZXN0cm95ZWQuY2FsbCh0aGlzKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdENvbXB1dGVkKCkge1xuICAgIGNvbnN0IGNvbXB1dGVkID0gdGhpcy5jb25maWcuY29tcHV0ZWQgfHwge307XG4gICAgY29uc3QgY29tcHV0ZWRLZXlzID0gT2JqZWN0LmtleXMoY29tcHV0ZWQpO1xuXG4gICAgY29tcHV0ZWRLZXlzLmZvckVhY2goY2tleSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGNvbXB1dGVkW2NrZXldID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXNbY2tleV0gPSBjb21wdXRlZFtja2V5XS5jYWxsKHRoaXMpO1xuICAgICAgICAgIHRoaXMuJHdhdGNoZXIudHJpZ2dlcihja2V5LCB0aGlzW2NrZXldLCAnJyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuJHdhdGNoZXIuYWRkTGlzdGVuZXIoJycsIGNiKTtcbiAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjb21wdXRlZFtja2V5XSkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBbLi4uY29tcHV0ZWRbY2tleV1dO1xuICAgICAgICBjb25zdCBmbiA9IHZhbHVlLnBvcCgpO1xuICAgICAgICB2YWx1ZS5mb3JFYWNoKHBhdGggPT4ge1xuICAgICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpc1tja2V5XSA9IGZuLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB0aGlzLiR3YXRjaGVyLnRyaWdnZXIoY2tleSwgdGhpc1tja2V5XSwgJycpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy4kd2F0Y2hlci5hZGRMaXN0ZW5lcihwYXRoLCBjYik7XG4gICAgICAgICAgY2IoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGluaXRXYXRjaCgpIHtcbiAgICBjb25zdCB3YXRjaCA9IHRoaXMuY29uZmlnLndhdGNoIHx8IHt9O1xuICAgIGNvbnN0IHdhdGNoS2V5cyA9IE9iamVjdC5rZXlzKHdhdGNoKTtcbiAgICB3YXRjaEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgdGhpcy4kd2F0Y2hlci5hZGRMaXN0ZW5lcihrZXksIChuLCBvLCBrZXkpID0+IHtcbiAgICAgICAgd2F0Y2hba2V5XS5jYWxsKHRoaXMsIG4sIG8pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGluaXRNZXRob2RzKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLm1ldGhvZHMgfHwge30pLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXNba2V5XSA9IHRoaXMuY29uZmlnLm1ldGhvZHNba2V5XS5iaW5kKHRoaXMpO1xuICAgIH0pO1xuICB9XG59XG5cbi8vIOWGhee9ruaMh+S7pFxuTVZWTS5kaXJlY3RpdmUoJ21vZGVsJywge1xuICBiaW5kKGVsOiBhbnksIGJpbmRpbmcpIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gKGU6IGFueSkgPT4ge1xuICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWU7XG4gICAgICB0aGlzLiRvd25lci5zZXREYXRhKHsgW2JpbmRpbmcuZXhwcmVzc2lvbl06IHZhbCB9KTtcbiAgICB9O1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5jYWxsYmFjayk7XG4gICAgZWwudmFsdWUgPSBiaW5kaW5nLnZhbHVlO1xuICB9LFxuICB1cGRhdGUoZWw6IGFueSwgYmluZGluZykge1xuICAgIGlmIChlbC52YWx1ZSA9PT0gYmluZGluZy52YWx1ZSkgcmV0dXJuO1xuICAgIGVsLnZhbHVlID0gYmluZGluZy52YWx1ZTtcbiAgfSxcbiAgdW5iaW5kKGVsKSB7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmNhbGxiYWNrKTtcbiAgfSxcbn0pO1xuXG5NVlZNLmRpcmVjdGl2ZSgnc2hvdycsIChlbCwgYmluZGluZykgPT4ge1xuICBlbC5zdHlsZS5kaXNwbGF5ID0gYmluZGluZy52YWx1ZSA/ICcnIDogJ25vbmUnO1xufSk7XG5cbk1WVk0uZGlyZWN0aXZlKCdpZicsIHtcbiAgc2NvcGVkOiB0cnVlLFxuICBiaW5kKGVsOiBIVE1MRWxlbWVudCwgYmluZGluZykge1xuICAgIGNvbnN0IGh0bWwgPSBlbC5vdXRlckhUTUw7XG4gICAgdGhpcy5jRWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCctLSBpZiBibG9jayAtLScpO1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLm9uSGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jaGlsZFNjb3BlICYmIHRoaXMuY2hpbGRTY29wZS5kZXN0cm95KCk7XG4gICAgICB0aGlzLmVsLnJlcGxhY2VXaXRoKHRoaXMuY0VsKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vblNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBuRWw6IGFueSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbkVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICBuRWwgPSBuRWwuZmlyc3RDaGlsZDtcblxuICAgICAgdGhpcy5lbC5yZXBsYWNlV2l0aChuRWwpO1xuICAgICAgdGhpcy5lbCA9IG5FbDtcbiAgICAgIHRoaXMuY2hpbGRTY29wZSA9IG5ldyBDaGlsZFNjb3BlKHRoaXMuZWwsIHRoaXMuJG93bmVyKTtcbiAgICAgIHRoaXMuY0VsLnJlcGxhY2VXaXRoKHRoaXMuZWwpO1xuICAgIH07XG5cbiAgICBpZiAoYmluZGluZy52YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuICB1cGRhdGUoZWw6IGFueSwgYmluZGluZykge1xuICAgIGlmIChiaW5kaW5nLnZhbHVlID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG4gIHVuYmluZChlbCkge1xuICAgIHRoaXMub25IaWRlKCk7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTVZWTTtcbiIsImltcG9ydCB7IGdldFZhbHVlLCBpc1BsYWluT2JqZWN0LCBtZXJnZURlc2NyaXB0b3IgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IElEZXN0cm95IH0gZnJvbSAnLi90eXBpbmcnO1xuXG50eXBlIENhbGxiYWNrID0gKHZhbDogYW55LCBvbGRWYWx1ZTogYW55KSA9PiB2b2lkO1xudHlwZSBDYWxsYmFja1dpdGhQYXRoID0gKHZhbDogYW55LCBvbGRWYWx1ZTogYW55LCBwYXRoOiBzdHJpbmcpID0+IHZvaWQ7XG5cbmNsYXNzIFRva2VuIHtcbiAgcHJpdmF0ZSB2YWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogeyBvYmo6IGFueTsga2V5OiBzdHJpbmc7IHZhbHVlOiBhbnk7IGNiOiBDYWxsYmFjayB9KSB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzO1xuICAgIGNvbnN0IHsga2V5LCB2YWx1ZSwgb2JqLCBjYiB9ID0gY29uZmlnO1xuXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiByZWFjdGl2ZVNldHRlcigpIHtcbiAgICAgICAgcmV0dXJuIHNjb3BlLnZhbHVlO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gcmVhY3RpdmVHZXR0ZXIodmFsdWUpIHtcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSBzY29wZS52YWx1ZTtcbiAgICAgICAgc2NvcGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgIGNiKHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgR0xPQUJMX0tFWSA9ICdHTE9BQkwnO1xuXG5jbGFzcyBXYXRjaGVyIGltcGxlbWVudHMgSURlc3Ryb3kge1xuICBvd25lcjogYW55O1xuICBsaXN0ZW5lcnM6IHtcbiAgICBbcGF0aDogc3RyaW5nXTogQ2FsbGJhY2tXaXRoUGF0aFtdO1xuICB9ID0ge307XG4gIGNvbnN0cnVjdG9yKG93bmVyOiBhbnksIGRhdGE6IGFueSkge1xuICAgIG1lcmdlRGVzY3JpcHRvcihvd25lciwgdGhpcy50cmF2ZXJzZURhdGEoZGF0YSkpO1xuICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgfVxuXG4gIHRyYXZlcnNlRGF0YShkYXRhOiBhbnksIHBhdGggPSAnJykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoID0gKHBhdGggPyBwYXRoICsgJy4nIDogJycpICsga2V5O1xuXG4gICAgICBuZXcgVG9rZW4oe1xuICAgICAgICBvYmo6IHJlc3VsdCxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogaXNQbGFpbk9iamVjdChkYXRhW2tleV0pXG4gICAgICAgICAgPyB0aGlzLnRyYXZlcnNlRGF0YShkYXRhW2tleV0sIGZ1bGxQYXRoKVxuICAgICAgICAgIDogZGF0YVtrZXldLFxuICAgICAgICBjYjogKG5ld1ZhbCwgb2xkVmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlKGZ1bGxQYXRoLCBuZXdWYWwsIG9sZFZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBoYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aDogc3RyaW5nLCBuZXdWYWx1ZTogYW55LCBvbGRWYWx1ZTogYW55KSB7XG4gICAgbGV0IHBhcmVudCA9IHRoaXMub3duZXI7XG4gICAgY29uc3QgcGF0aEFyciA9IGZ1bGxQYXRoLnNwbGl0KCcuJyk7XG4gICAgaWYgKHBhdGhBcnIubGVuZ3RoID49IDIpIHtcbiAgICAgIHBhcmVudCA9IG5ldyBGdW5jdGlvbihcbiAgICAgICAgJ2RhdGEnLFxuICAgICAgICBgcmV0dXJuIGRhdGEuJHtwYXRoQXJyLnNsaWNlKDAsIHBhdGhBcnIubGVuZ3RoIC0gMSkuam9pbignLicpfWBcbiAgICAgICkodGhpcy5vd25lcik7XG4gICAgfVxuXG4gICAgY29uc3Qga2V5OiBzdHJpbmcgPSBwYXRoQXJyLnBvcCgpITtcblxuICAgIGlmIChpc1BsYWluT2JqZWN0KG5ld1ZhbHVlKSkge1xuICAgICAgbmV3IFRva2VuKHtcbiAgICAgICAgb2JqOiBwYXJlbnQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IHRoaXMudHJhdmVyc2VEYXRhKG5ld1ZhbHVlLCBmdWxsUGF0aCksXG4gICAgICAgIGNiOiAoX25ld1ZhbHVlLCBfb2xkVmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlKGZ1bGxQYXRoLCBfbmV3VmFsdWUsIF9vbGRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoZnVsbFBhdGgsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcihwYXRoOiBzdHJpbmcsIGNiOiBDYWxsYmFja1dpdGhQYXRoKSB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gR0xPQUJMX0tFWTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubGlzdGVuZXJzW3BhdGhdKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyc1twYXRoXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdLnB1c2goY2IpO1xuICB9XG5cbiAgcmVtb3ZlTGlzdGVuZXIocGF0aDogc3RyaW5nLCBjYj86IENhbGxiYWNrV2l0aFBhdGgpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghY2IpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmxpc3RlbmVyc1twYXRoXTtcbiAgICB9IGVsc2Uge1xuICAgICAgKHRoaXMubGlzdGVuZXJzW3BhdGhdIHx8IFtdKS5maWx0ZXIoaXRlbSA9PiBpdGVtID09PSBjYik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzKCkge1xuICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gIH1cblxuICB0cmlnZ2VyKHBhdGg6IHN0cmluZywgbmV3VmFsdWU6IGFueSwgb2xkVmFsdWU6IGFueSkge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IEdMT0FCTF9LRVk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmxpc3RlbmVyc1twYXRoXSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyc1twYXRoXS5mb3JFYWNoKGNiID0+IGNiKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgcGF0aCkpO1xuXG4gICAgLy8g5pS55Y+Y5LqG5a+56LGh77yM6YKj5LmI5a2Q57qn5Lmf5bqU6K+l5pS25Yiw6YCa55+lXG4gICAgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChrZXkgIT09IHBhdGggJiYga2V5LnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgY29uc3QgayA9IGtleS5yZXBsYWNlKHBhdGggKyAnLicsICcnKTtcbiAgICAgICAgY29uc3Qgb2xkViA9IGdldFZhbHVlKG9sZFZhbHVlLCBrKTtcbiAgICAgICAgY29uc3QgbmV3ViA9IGdldFZhbHVlKG5ld1ZhbHVlLCBrKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNba2V5XS5mb3JFYWNoKGNiID0+IGNiKG5ld1YsIG9sZFYsIGtleSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgKHRoaXMubGlzdGVuZXJzW0dMT0FCTF9LRVldIHx8IFtdKS5mb3JFYWNoKGNiID0+XG4gICAgICBjYihuZXdWYWx1ZSwgb2xkVmFsdWUsIHBhdGgpXG4gICAgKTtcbiAgfVxufVxuXG4vLyBjb25zdCBvd25lcjogYW55ID0ge307XG5cbi8vIGNvbnN0IHdhdGNoZXIgPSBuZXcgV2F0Y2hlcihvd25lciwge1xuLy8gICBhOiAxMCxcbi8vICAgYjoge1xuLy8gICAgIGM6IDEyLFxuLy8gICB9LFxuLy8gfSk7XG5cbi8vIHdhdGNoZXIuYWRkTGlzdGVuZXIoJ2InLCAocDEsIHAyKSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKCdiIGNoYW5nZWQnLCBwMSwgcDIpO1xuLy8gfSk7XG5cbi8vIHdhdGNoZXIuYWRkTGlzdGVuZXIoJ2IuYycsIChwMSwgcDIpID0+IHtcbi8vICAgY29uc29sZS5sb2coJ2IuYyBjaGFuZ2VkJywgcDEsIHAyKTtcbi8vIH0pO1xuXG4vLyBvd25lci5iID0geyBjOiAxNSB9O1xuLy8gb3duZXIuYi5jID0gJ3dhaGFoYWhhJztcblxuZXhwb3J0IGRlZmF1bHQgV2F0Y2hlcjtcbiIsImltcG9ydCBNVlZNIGZyb20gJy4vTVZWTSc7XG5cbmV4cG9ydCBkZWZhdWx0IE1WVk07XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWUob2JqOiBhbnksIHBhdGg6IHN0cmluZywgZGVmYXVsdFZhbCA9IHVuZGVmaW5lZCkge1xuICBsZXQgdmFsID0gb2JqO1xuICB0cnkge1xuICAgIHZhbCA9IG5ldyBGdW5jdGlvbignZGF0YScsIGByZXR1cm4gZGF0YS4ke3BhdGh9YCkob2JqKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBkZWZhdWx0VmFsO1xuICB9XG4gIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWwgOiB2YWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRWYWx1ZShvYmo6IGFueSwgcGF0aDogc3RyaW5nLCB2YWw6IGFueSkge1xuICB0cnkge1xuICAgIG5ldyBGdW5jdGlvbignZGF0YScsIGBkYXRhLiR7cGF0aH09JHtKU09OLnN0cmluZ2lmeSh2YWwpfWApKG9iaik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqOiBhbnkpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEZXNjcmlwdG9yKGE6IGFueSwgYjogYW55KSB7XG4gIGZvciAobGV0IGtleSBpbiBiKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgYSxcbiAgICAgIGtleSxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYiwga2V5KVxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbihcbiAgZXhwcmVzc2lvbjogc3RyaW5nLFxuICBzY29wZU5hbWU6IHN0cmluZyA9ICd0aGlzJ1xuKSB7XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBtYXggPSBleHByZXNzaW9uLmxlbmd0aDtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBsZXQgZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIHdoaWxlIChpbmRleCA8IG1heCkge1xuICAgIGxldCBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoaW5kZXgpO1xuXG4gICAgaWYgKC8nfFwiLy50ZXN0KGNoYXIpKSB7XG4gICAgICBjb25zdCBjID0gY2hhcjtcbiAgICAgIGxldCBzdHIgPSBcIidcIjtcbiAgICAgIGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdCgrK2luZGV4KTtcbiAgICAgIHdoaWxlIChjaGFyICE9PSB1bmRlZmluZWQgJiYgY2hhciAhPT0gYykge1xuICAgICAgICBzdHIgKz0gY2hhcjtcbiAgICAgICAgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KCsraW5kZXgpO1xuICAgICAgfVxuICAgICAgcmVzdWx0ICs9IHN0cjtcbiAgICAgIHJlc3VsdCArPSBcIidcIjtcbiAgICAgIGluZGV4Kys7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoY2hhciA9PT0gJ3snIHx8IGNoYXIgPT09ICcsJykge1xuICAgICAgcmVzdWx0ICs9IGNoYXI7XG4gICAgICBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoKytpbmRleCk7XG4gICAgICB3aGlsZSAoY2hhciAhPT0gJzonKSB7XG4gICAgICAgIHJlc3VsdCArPSBjaGFyO1xuICAgICAgICBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoKytpbmRleCk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBsZXQgVkFSSUFCTEVTID0gL1tBLVphLXpfXS87XG4gICAgaWYgKFZBUklBQkxFUy50ZXN0KGNoYXIpKSB7XG4gICAgICBsZXQgdmFsdWUgPSAnJztcblxuICAgICAgbGV0IHBhdGggPSAnJztcbiAgICAgIGxldCBwYXRoczogc3RyaW5nW10gPSBbXTtcbiAgICAgIHdoaWxlIChjaGFyICYmIC9bQS1aYS16XzAtOS4oKV0vLnRlc3QoY2hhcikpIHtcbiAgICAgICAgdmFsdWUgKz0gY2hhcjtcblxuICAgICAgICBpZiAoY2hhciA9PT0gJy4nKSB7XG4gICAgICAgICAgcGF0aHMucHVzaChwYXRoKTtcbiAgICAgICAgICBwYXRoID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGF0aCArPSBjaGFyO1xuICAgICAgICB9XG4gICAgICAgIGNoYXIgPSBleHByZXNzaW9uWysraW5kZXhdIHx8ICcnO1xuICAgICAgfVxuXG4gICAgICBpbmRleC0tO1xuICAgICAgY2hhciA9ICcnO1xuXG4gICAgICAvLyDnibnmrorlgLxcbiAgICAgIGlmIChbJ3RydWUnLCAnZmFsc2UnLCAnbnVsbCcsICd1bmRlZmluZWQnXS5pbmRleE9mKHBhdGgpID49IDApIHtcbiAgICAgICAgcmVzdWx0ICs9IHBhdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoL15bQS1aYS16XzAtOV0rJC8udGVzdChwYXRoKSkge1xuICAgICAgICAgIHBhdGhzLnB1c2gocGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZXBlbmRlbmNpZXMucHVzaChwYXRocy5qb2luKCcuJykpO1xuICAgICAgICByZXN1bHQgKz0gc2NvcGVOYW1lICsgJy5nZXRWYWx1ZShcIicgKyB2YWx1ZSArICdcIiknO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdCArPSBjaGFyO1xuICAgIGluZGV4Kys7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGV4cHJlc3Npb246IHJlc3VsdCxcbiAgICBkZXBlbmRlbmNpZXMsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1JlYWxWYWx1ZSh2YWx1ZTogYW55KSB7XG4gIGlmICghdmFsdWUpIHJldHVybiB2YWx1ZTtcblxuICBpZiAoL15bMC05XT8oXFwuWzAtOV0rKT8kLy50ZXN0KHZhbHVlKSkge1xuICAgIHJldHVybiBOdW1iZXIodmFsdWUpO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ251bGwnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXk8VCA9IGFueT4odmFsdWU6IEFycmF5TGlrZTxUPik6IEFycmF5PFQ+IHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHZhbHVlKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=