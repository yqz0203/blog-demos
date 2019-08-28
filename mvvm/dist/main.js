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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9NVlZNL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9NVlZNL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01WVk0vLi9zcmMvQ2hpbGRTY29wZS50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL0NvbXBpbGVyLnRzIiwid2VicGFjazovL01WVk0vLi9zcmMvRGlyZWN0aXZlLnRzIiwid2VicGFjazovL01WVk0vLi9zcmMvTVZWTS50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL1dhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vTVZWTS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7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RTtRQUNoQyxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVNLFNBQVMsT0FBTyxDQUFVLEtBQW1CO0lBQ2xELE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIk1WVk1cIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiTVZWTVwiXSA9IGZhY3RvcnkoKTtcbn0pKHdpbmRvdywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgeyBJT3duZXIsIElEZXN0cm95IH0gZnJvbSAnLi90eXBpbmcnO1xuaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi9XYXRjaGVyJztcbmltcG9ydCBDb21waWxlciBmcm9tICcuL0NvbXBpbGVyJztcbmltcG9ydCB7IGdldFZhbHVlIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoaWxkU2NvcGUgaW1wbGVtZW50cyBJT3duZXIsIElEZXN0cm95IHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICAkcGFyZW50OiBJT3duZXI7XG4gICR3YXRjaGVyOiBXYXRjaGVyO1xuICAkZWw6IGFueTtcbiAgJGNvbXBsaWVyOiBDb21waWxlcjtcbiAgJHBhcmVudExpc3RlbmVyID0gKG46IGFueSwgbzogYW55LCBwOiBzdHJpbmcpID0+IHtcbiAgICB0aGlzLiR3YXRjaGVyLnRyaWdnZXIocCwgbiwgbyk7XG4gIH07XG5cbiAgY29uc3RydWN0b3IoZWw6IGFueSwgcGFyZW50OiBJT3duZXIpIHtcbiAgICB0aGlzLiRwYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy4kZWwgPSBlbDtcbiAgICB0aGlzLiR3YXRjaGVyID0gbmV3IFdhdGNoZXIodGhpcywge30pO1xuICAgIHRoaXMuJGNvbXBsaWVyID0gbmV3IENvbXBpbGVyKHRoaXMpO1xuICAgIHRoaXMuJGNvbXBsaWVyLmluaXQoKTtcblxuICAgIHRoaXMuJHBhcmVudC4kd2F0Y2hlci5hZGRMaXN0ZW5lcignJywgdGhpcy4kcGFyZW50TGlzdGVuZXIpO1xuICB9XG5cbiAgZ2V0VmFsdWUocGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgdmFsID0gZ2V0VmFsdWUodGhpcywgcGF0aCk7XG5cbiAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLiRwYXJlbnQuZ2V0VmFsdWUocGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIHNldERhdGEobmV3RGF0YTogYW55KSB7XG4gICAgdGhpcy4kcGFyZW50LnNldERhdGEobmV3RGF0YSk7XG4gIH1cblxuICBnZXRFdmVudChuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy4kcGFyZW50LmdldEV2ZW50KG5hbWUpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLiRjb21wbGllci5kZXN0cm95KCk7XG4gICAgdGhpcy4kd2F0Y2hlci5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLiRwYXJlbnQuJHdhdGNoZXIucmVtb3ZlTGlzdGVuZXIoJycsIHRoaXMuJHBhcmVudExpc3RlbmVyKTtcbiAgfVxufVxuIiwiaW1wb3J0IERpcmVjdGl2ZSwgeyBkaXJlY3RpdmVDb25maWdNYXAsIERJUkVDVElWRV9QUkVGSVggfSBmcm9tICcuL0RpcmVjdGl2ZSc7XG5pbXBvcnQgeyBwYXJzZUV4cHJlc3Npb24sIHRvUmVhbFZhbHVlLCB0b0FycmF5IH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBJT3duZXIsIElEZXN0cm95IH0gZnJvbSAnLi90eXBpbmcnO1xuXG5jbGFzcyBDb21waWxlciBpbXBsZW1lbnRzIElEZXN0cm95IHtcbiAgb3duZXI6IElPd25lcjtcbiAgZGlyZWN0aXZlczogRGlyZWN0aXZlW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihvd25lcjogSU93bmVyKSB7XG4gICAgdGhpcy5vd25lciA9IG93bmVyO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnRyYXZlcnNFTCh0aGlzLm93bmVyLiRlbCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGlyZWN0aXZlcy5mb3JFYWNoKGQgPT4gZC5kZXN0cm95KCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmF2ZXJzRUwoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMudHJhdmVyc0F0dHIoZWwpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgbm9kZTogYW55ID0gZWwuY2hpbGROb2Rlc1tpXTtcblxuICAgICAgLy8gdGV4dFxuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgbGV0IG5vZGVWYWx1ZSA9IG5vZGUubm9kZVZhbHVlITtcblxuICAgICAgICBsZXQgc2V0Tm9kZVZhbHVlID0gKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgLy8gY2hyb21lIOS4jeS8muinpuWPkemHjee7mFxuICAgICAgICAgIC8vIGlmIChub2RlLm5vZGVWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSB2YWw7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucGFyc2VUZW1wbGF0ZUFuZFNldChub2RlVmFsdWUsIHNldE5vZGVWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgdGhpcy50cmF2ZXJzRUwobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmF2ZXJzQXR0cihub2RlOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0b0FycmF5KG5vZGUuYXR0cmlidXRlcyk7XG5cbiAgICBsZXQgc2NvcGVkQXR0cjogYW55O1xuXG4gICAgYXR0cmlidXRlcy5zb21lKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZGlyZWN0aXZlQ29uZmlnTWFwLmdldChpdGVtLm5hbWUpO1xuXG4gICAgICAvLyBpZueahOS8mOWFiOe6p+aYr+acgOmrmOeahFxuICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0gRElSRUNUSVZFX1BSRUZJWCArICdpZicpIHtcbiAgICAgICAgc2NvcGVkQXR0ciA9IGl0ZW07XG4gICAgICB9XG5cbiAgICAgIGlmICghc2NvcGVkQXR0ciAmJiB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyAmJiBjb25maWcuc2NvcGVkKSB7XG4gICAgICAgIHNjb3BlZEF0dHIgPSBpdGVtO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHNjb3BlZEF0dHIpIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IHRoaXMuaW5pdERpcmVjdGl2ZShub2RlLCBzY29wZWRBdHRyKTtcblxuICAgICAgaWYgKGRpcmVjdGl2ZSAmJiBkaXJlY3RpdmUuJHNjb3BlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXR0cmlidXRlcy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgaWYgKCFhdHRyKSByZXR1cm47XG5cbiAgICAgIC8vIOaMh+S7pFxuICAgICAgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKERJUkVDVElWRV9QUkVGSVgpKSB7XG4gICAgICAgIHRoaXMuaW5pdERpcmVjdGl2ZShub2RlLCBhdHRyKTtcbiAgICAgIH1cbiAgICAgIC8vIGRvbeWxnuaAp1xuICAgICAgZWxzZSBpZiAoYXR0ci5uYW1lLnN0YXJ0c1dpdGgoJzonKSkge1xuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgICBjb25zdCBhdHRyTmFtZSA9IGF0dHIubmFtZS5zdWJzdHIoMSk7XG5cbiAgICAgICAgdGhpcy5wYXJzZVRlbXBsYXRlQW5kU2V0KCd7eycgKyBhdHRyLnZhbHVlICsgJ319JywgKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIG5vZGVbYXR0ck5hbWVdID0gdG9SZWFsVmFsdWUodmFsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAvLyDlm57osIPlh73mlbBcbiAgICAgIGVsc2UgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYXR0ci5uYW1lLnN1YnN0cigxKTtcbiAgICAgICAgbGV0IGV2ZW50RnVuY05hbWUgPSBhdHRyLnZhbHVlO1xuICAgICAgICBjb25zdCBwYXJzZWRzOiBBcnJheTxSZXR1cm5UeXBlPHR5cGVvZiBwYXJzZUV4cHJlc3Npb24+PiA9IFtdO1xuICAgICAgICBjb25zdCBtYXRjaGVkID0gZXZlbnRGdW5jTmFtZS5tYXRjaCgvKFteKCldKylcXCgoLispXFwpLyk7XG4gICAgICAgIC8vIOW4puWPguaVsOeahOWbnuiwg1xuICAgICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICAgIGV2ZW50RnVuY05hbWUgPSBtYXRjaGVkWzFdO1xuICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IG1hdGNoZWRbMl07XG4gICAgICAgICAgcGFyYW1zLnNwbGl0KCcsJykuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlRXhwcmVzc2lvbihwLCAndGhpcy5vd25lcicpO1xuICAgICAgICAgICAgcGFyc2Vkcy5wdXNoKHBhcnNlZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYiA9IHRoaXMub3duZXIuZ2V0RXZlbnQoZXZlbnRGdW5jTmFtZS50cmltKCkpO1xuICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICBjb25zdCBmdW5jcyA9IHBhcnNlZHMubWFwKHBhcnNlZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gJyArIHBhcnNlZC5leHByZXNzaW9uKS5iaW5kKHRoaXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGUgPT4ge1xuICAgICAgICAgICAgY2IuYXBwbHkobnVsbCwgW2UsIC4uLmZ1bmNzLm1hcChmdW5jID0+IGZ1bmMoKSldKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gaHRtbOWxnuaAp1xuICAgICAgZWxzZSB7XG4gICAgICAgIGxldCBjYiA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgdmFsKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQoYXR0ci52YWx1ZSwgY2IpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIGluaXREaXJlY3RpdmUobm9kZTogYW55LCBhdHRyOiBBdHRyKSB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICBjb25zdCBkaXJlY3RpdmVOYW1lID0gYXR0ci5uYW1lLnJlcGxhY2UoXG4gICAgICBuZXcgUmVnRXhwKCdeJyArIERJUkVDVElWRV9QUkVGSVgpLFxuICAgICAgJydcbiAgICApO1xuICAgIGNvbnN0IGRkID0gZGlyZWN0aXZlQ29uZmlnTWFwLmdldChkaXJlY3RpdmVOYW1lKTtcblxuICAgIGlmICghZGQpIHtcbiAgICAgIGNvbnNvbGUud2Fybign5pyq55+l55qE5oyH5Luk77yaJywgZGlyZWN0aXZlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IG5ldyBEaXJlY3RpdmUodGhpcy5vd25lciwgbm9kZSwgYXR0ci52YWx1ZSwgZGQpO1xuICAgICAgdGhpcy5kaXJlY3RpdmVzLnB1c2goZGlyZWN0aXZlKTtcblxuICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVGVtcGxhdGVBbmRTZXQoXG4gICAgdGVtcGxhdGU6IHN0cmluZyxcbiAgICBzZXROb2RlVmFsdWU6ICh2YWw6IHN0cmluZykgPT4gdm9pZFxuICApIHtcbiAgICBjb25zdCB2YWx1ZVJlZ2V4cCA9IC97eyhbXn1dKyl9fS9nO1xuXG4gICAgbGV0IHJlc3VsdCA9IHZhbHVlUmVnZXhwLmV4ZWModGVtcGxhdGUpO1xuICAgIGxldCBhbGxTY29wZUtleXM6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGNhbENvbnRleHRzOiBBcnJheTx7XG4gICAgICBzdGFydEluZGV4OiBudW1iZXI7XG4gICAgICBlbmRJbmRleDogbnVtYmVyO1xuICAgICAgY2FsOiAoKSA9PiBzdHJpbmc7XG4gICAgfT4gPSBbXTtcblxuICAgIHdoaWxlIChyZXN1bHQpIHtcbiAgICAgIGNvbnN0IHsgaW5kZXggfSA9IHJlc3VsdDtcbiAgICAgIGxldCB0cGwgPSByZXN1bHRbMV07XG4gICAgICBsZXQgZnVsbFRwbCA9IHJlc3VsdFswXTtcblxuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VFeHByZXNzaW9uKHRwbCwgJ3RoaXMub3duZXInKTtcbiAgICAgIGxldCBzY29wZUtleXMgPSBwYXJzZWQuZGVwZW5kZW5jaWVzO1xuXG4gICAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbigncmV0dXJuICcgKyBwYXJzZWQuZXhwcmVzc2lvbikuYmluZCh0aGlzKTtcblxuICAgICAgYWxsU2NvcGVLZXlzID0gWy4uLmFsbFNjb3BlS2V5cywgLi4uc2NvcGVLZXlzXTtcbiAgICAgIGNhbENvbnRleHRzID0gW1xuICAgICAgICAuLi5jYWxDb250ZXh0cyxcbiAgICAgICAge1xuICAgICAgICAgIHN0YXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgIGVuZEluZGV4OiBpbmRleCArIGZ1bGxUcGwubGVuZ3RoLFxuICAgICAgICAgIGNhbDogKCkgPT4gZm4uYXBwbHkodGhpcyksXG4gICAgICAgIH0sXG4gICAgICBdO1xuXG4gICAgICByZXN1bHQgPSB2YWx1ZVJlZ2V4cC5leGVjKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBjb25zdCBjYWxWYWx1ZSA9ICgpID0+IHtcbiAgICAgIGxldCBsYXN0ZW5kID0gMDtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjYWxDb250ZXh0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UobGFzdGVuZCwgY2FsQ29udGV4dHNbaV0uc3RhcnRJbmRleCk7XG4gICAgICAgIHZhbHVlICs9IGNhbENvbnRleHRzW2ldLmNhbCgpO1xuICAgICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShcbiAgICAgICAgICBjYWxDb250ZXh0c1tpXS5lbmRJbmRleCxcbiAgICAgICAgICBpIDwgbCAtIDEgPyBjYWxDb250ZXh0c1tpICsgMV0uc3RhcnRJbmRleCA6IHVuZGVmaW5lZFxuICAgICAgICApO1xuICAgICAgICBsYXN0ZW5kID0gY2FsQ29udGV4dHNbaV0uZW5kSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKFxuICAgICAgICBsYXN0ZW5kLFxuICAgICAgICBjYWxDb250ZXh0c1tjYWxDb250ZXh0cy5sZW5ndGggLSAxXS5zdGFydEluZGV4XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGFsbFNjb3BlS2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIHNldE5vZGVWYWx1ZShjYWxWYWx1ZSgpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLm93bmVyLiR3YXRjaGVyLmFkZExpc3RlbmVyKGssIGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVyKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcGlsZXI7XG4iLCJpbXBvcnQgeyBJT3duZXIsIElEZXN0cm95IH0gZnJvbSAnLi90eXBpbmcnO1xuaW1wb3J0IHsgcGFyc2VFeHByZXNzaW9uIH0gZnJvbSAnLi91dGlscyc7XG5cbnR5cGUgT2JqZWN0RGlyZWN0aXZlQ29uZmlnID0ge1xuICBzY29wZWQ/OiBib29sZWFuO1xuICBiaW5kKHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpOiB2b2lkO1xuICB1cGRhdGU/KHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpOiB2b2lkO1xuICB1bmJpbmQ/KHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50KTogdm9pZDtcbn07XG5cbnR5cGUgRnVuY3Rpb25EaXJlY3RpdmVDb25maWcgPSAoZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIERpcmVjdGl2ZUNvbmZpZyA9IE9iamVjdERpcmVjdGl2ZUNvbmZpZyB8IEZ1bmN0aW9uRGlyZWN0aXZlQ29uZmlnO1xuXG5jbGFzcyBEaXJlY3RpdmUgaW1wbGVtZW50cyBJRGVzdHJveSB7XG4gIHByaXZhdGUgY29uZmlnOiBPYmplY3REaXJlY3RpdmVDb25maWc7XG4gIHByaXZhdGUgbGlzdGVuZXI6ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgcmVtb3ZlTGlzdGVuZXJzOiAoKSA9PiB2b2lkO1xuICAkZWw6IEhUTUxFbGVtZW50O1xuICAkb3duZXI6IElPd25lcjtcbiAgJHNjb3BlZDogYm9vbGVhbjtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICBjb25zdHJ1Y3RvcihcbiAgICBvd25lcjogSU93bmVyLFxuICAgIGVsOiBIVE1MRWxlbWVudCxcbiAgICBleHA6IHN0cmluZyxcbiAgICBjb25maWc6IERpcmVjdGl2ZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLiRlbCA9IGVsO1xuICAgIHRoaXMuJG93bmVyID0gb3duZXI7XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgIGJpbmQ6IGNvbmZpZyxcbiAgICAgICAgdXBkYXRlOiBjb25maWcsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG5cbiAgICBjb25zdCB7IGV4cHJlc3Npb24sIGRlcGVuZGVuY2llcyB9ID0gcGFyc2VFeHByZXNzaW9uKGV4cCwgJ3RoaXMuJG93bmVyJyk7XG4gICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgZXhwcmVzc2lvbikuYmluZCh0aGlzKTtcblxuICAgIHRoaXMubGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGZuKCk7XG4gICAgICBpZiAodGhpcy5jb25maWcudXBkYXRlKSB7XG4gICAgICAgIHRoaXMuY29uZmlnLnVwZGF0ZS5jYWxsKHRoaXMsIGVsLCB7IHZhbHVlLCBleHByZXNzaW9uOiBleHAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGRlcGVuZGVuY2llcy5mb3JFYWNoKGRwID0+IHtcbiAgICAgIHRoaXMuJG93bmVyLiR3YXRjaGVyLmFkZExpc3RlbmVyKGRwLCB0aGlzLmxpc3RlbmVyKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXJzID0gKCkgPT4ge1xuICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goZHAgPT5cbiAgICAgICAgdGhpcy4kb3duZXIuJHdhdGNoZXIucmVtb3ZlTGlzdGVuZXIoZHAsIHRoaXMubGlzdGVuZXIpXG4gICAgICApO1xuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZy5iaW5kLmNhbGwodGhpcywgZWwsIHtcbiAgICAgIHZhbHVlOiBmbigpLFxuICAgICAgZXhwcmVzc2lvbjogZXhwLFxuICAgIH0pO1xuXG4gICAgdGhpcy4kc2NvcGVkID0gdGhpcy5jb25maWcuc2NvcGVkIHx8IGZhbHNlO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jb25maWcudW5iaW5kKSB7XG4gICAgICB0aGlzLmNvbmZpZy51bmJpbmQuY2FsbCh0aGlzLCB0aGlzLiRlbCk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXJzKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRpcmVjdGl2ZUNvbmZpZ01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXJlY3RpdmVDb25maWc+KCk7XG5cbmV4cG9ydCBjb25zdCBESVJFQ1RJVkVfUFJFRklYID0gJ3gtJztcblxuZXhwb3J0IGRlZmF1bHQgRGlyZWN0aXZlO1xuIiwiaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi9XYXRjaGVyJztcbmltcG9ydCB7IHNldFZhbHVlLCBnZXRWYWx1ZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRGlyZWN0aXZlQ29uZmlnLCBkaXJlY3RpdmVDb25maWdNYXAgfSBmcm9tICcuL0RpcmVjdGl2ZSc7XG5pbXBvcnQgQ29tcGlsZXIgZnJvbSAnLi9Db21waWxlcic7XG5pbXBvcnQgeyBJT3duZXIgfSBmcm9tICcuL3R5cGluZyc7XG5pbXBvcnQgQ2hpbGRTY29wZSBmcm9tICcuL0NoaWxkU2NvcGUnO1xuXG5pbnRlcmZhY2UgTVZWTUNvbmZpZyB7XG4gIGVsOiBIVE1MRWxlbWVudDtcbiAgZGF0YTogYW55O1xuICBjcmVhdGVkPzogKCkgPT4gdm9pZDtcbiAgZGVzdHJveWVkPzogKCkgPT4gdm9pZDtcbiAgd2F0Y2g/OiB7IFtrZXk6IHN0cmluZ106IChuZXdWYWx1ZTogYW55LCBvbGRWYWx1ZTogYW55KSA9PiB2b2lkIH07XG4gIGNvbXB1dGVkOiBhbnk7XG4gIG1ldGhvZHM6IGFueTtcbn1cblxuY2xhc3MgTVZWTSBpbXBsZW1lbnRzIElPd25lciB7XG4gIHN0YXRpYyBkaXJlY3RpdmUgPSBmdW5jdGlvbihuYW1lOiBzdHJpbmcsIGNvbmZpZzogRGlyZWN0aXZlQ29uZmlnKSB7XG4gICAgZGlyZWN0aXZlQ29uZmlnTWFwLnNldChuYW1lLCBjb25maWcpO1xuICB9O1xuXG4gICRlbDogSFRNTEVsZW1lbnQ7XG4gICR3YXRjaGVyOiBXYXRjaGVyO1xuICAkY29tcGxpZXI6IENvbXBpbGVyO1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG5cbiAgcHJpdmF0ZSBjb25maWc6IE1WVk1Db25maWc7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTVZWTUNvbmZpZykge1xuICAgIHRoaXMuJGVsID0gY29uZmlnLmVsO1xuICAgIHRoaXMuJHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih0aGlzLCBjb25maWcuZGF0YSk7XG4gICAgdGhpcy4kY29tcGxpZXIgPSBuZXcgQ29tcGlsZXIodGhpcyk7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICB0aGlzLmluaXRNZXRob2RzKCk7XG4gICAgdGhpcy5pbml0Q29tcHV0ZWQoKTtcbiAgICB0aGlzLmluaXRXYXRjaCgpO1xuICAgIHRoaXMuJGNvbXBsaWVyLmluaXQoKTtcbiAgICB0aGlzLmNvbmZpZy5jcmVhdGVkICYmIHRoaXMuY29uZmlnLmNyZWF0ZWQuY2FsbCh0aGlzKTtcbiAgfVxuXG4gIHNldERhdGEobmV3RGF0YTogYW55KSB7XG4gICAgaWYgKCFuZXdEYXRhKSByZXR1cm47XG4gICAgT2JqZWN0LmtleXMobmV3RGF0YSkuZm9yRWFjaChrID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXNba10gPSBuZXdEYXRhW2tdO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VmFsdWUocGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGdldFZhbHVlKHRoaXMsIHBhdGgpO1xuICB9XG5cbiAgZ2V0RXZlbnQobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXNbbmFtZV0gPyB0aGlzW25hbWVdLmJpbmQodGhpcykgOiAnJztcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kY29tcGxpZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuJHdhdGNoZXIucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5jb25maWcuZGVzdHJveWVkICYmIHRoaXMuY29uZmlnLmRlc3Ryb3llZC5jYWxsKHRoaXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0Q29tcHV0ZWQoKSB7XG4gICAgY29uc3QgY29tcHV0ZWQgPSB0aGlzLmNvbmZpZy5jb21wdXRlZCB8fCB7fTtcbiAgICBjb25zdCBjb21wdXRlZEtleXMgPSBPYmplY3Qua2V5cyhjb21wdXRlZCk7XG5cbiAgICBjb21wdXRlZEtleXMuZm9yRWFjaChja2V5ID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY29tcHV0ZWRbY2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpc1tja2V5XSA9IGNvbXB1dGVkW2NrZXldLmNhbGwodGhpcyk7XG4gICAgICAgICAgdGhpcy4kd2F0Y2hlci50cmlnZ2VyKGNrZXksIHRoaXNbY2tleV0sICcnKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy4kd2F0Y2hlci5hZGRMaXN0ZW5lcignJywgY2IpO1xuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNvbXB1dGVkW2NrZXldKSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IFsuLi5jb21wdXRlZFtja2V5XV07XG4gICAgICAgIGNvbnN0IGZuID0gdmFsdWUucG9wKCk7XG4gICAgICAgIHZhbHVlLmZvckVhY2gocGF0aCA9PiB7XG4gICAgICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzW2NrZXldID0gZm4uY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuJHdhdGNoZXIudHJpZ2dlcihja2V5LCB0aGlzW2NrZXldLCAnJyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICB0aGlzLiR3YXRjaGVyLmFkZExpc3RlbmVyKHBhdGgsIGNiKTtcbiAgICAgICAgICBjYigpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdFdhdGNoKCkge1xuICAgIGNvbnN0IHdhdGNoID0gdGhpcy5jb25maWcud2F0Y2ggfHwge307XG4gICAgY29uc3Qgd2F0Y2hLZXlzID0gT2JqZWN0LmtleXMod2F0Y2gpO1xuICAgIHdhdGNoS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICB0aGlzLiR3YXRjaGVyLmFkZExpc3RlbmVyKGtleSwgKG4sIG8sIGtleSkgPT4ge1xuICAgICAgICB3YXRjaFtrZXldLmNhbGwodGhpcywgbiwgbyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdE1ldGhvZHMoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5jb25maWcubWV0aG9kcyB8fCB7fSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpc1trZXldID0gdGhpcy5jb25maWcubWV0aG9kc1trZXldLmJpbmQodGhpcyk7XG4gICAgfSk7XG4gIH1cbn1cblxuLy8g5YaF572u5oyH5LukXG5NVlZNLmRpcmVjdGl2ZSgnbW9kZWwnLCB7XG4gIGJpbmQoZWw6IGFueSwgYmluZGluZykge1xuICAgIHRoaXMuY2FsbGJhY2sgPSAoZTogYW55KSA9PiB7XG4gICAgICBjb25zdCB2YWwgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgIHNldFZhbHVlKHRoaXMuJG93bmVyLCBiaW5kaW5nLmV4cHJlc3Npb24sIHZhbCk7XG4gICAgfTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuY2FsbGJhY2spO1xuICAgIGVsLnZhbHVlID0gYmluZGluZy52YWx1ZTtcbiAgfSxcbiAgdXBkYXRlKGVsOiBhbnksIGJpbmRpbmcpIHtcbiAgICBpZiAoZWwudmFsdWUgPT09IGJpbmRpbmcudmFsdWUpIHJldHVybjtcbiAgICBlbC52YWx1ZSA9IGJpbmRpbmcudmFsdWU7XG4gIH0sXG4gIHVuYmluZChlbCkge1xuICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5jYWxsYmFjayk7XG4gIH0sXG59KTtcblxuTVZWTS5kaXJlY3RpdmUoJ3Nob3cnLCAoZWwsIGJpbmRpbmcpID0+IHtcbiAgZWwuc3R5bGUuZGlzcGxheSA9IGJpbmRpbmcudmFsdWUgPyAnJyA6ICdub25lJztcbn0pO1xuXG5NVlZNLmRpcmVjdGl2ZSgnaWYnLCB7XG4gIHNjb3BlZDogdHJ1ZSxcbiAgYmluZChlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICBjb25zdCBodG1sID0gZWwub3V0ZXJIVE1MO1xuICAgIHRoaXMuY0VsID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgnLS0gaWYgYmxvY2sgLS0nKTtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5vbkhpZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuY2hpbGRTY29wZSAmJiB0aGlzLmNoaWxkU2NvcGUuZGVzdHJveSgpO1xuICAgICAgdGhpcy5lbC5yZXBsYWNlV2l0aCh0aGlzLmNFbCk7XG4gICAgfTtcblxuICAgIHRoaXMub25TaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgbkVsOiBhbnkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIG5FbC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgbkVsID0gbkVsLmZpcnN0Q2hpbGQ7XG5cbiAgICAgIHRoaXMuZWwucmVwbGFjZVdpdGgobkVsKTtcbiAgICAgIHRoaXMuZWwgPSBuRWw7XG4gICAgICB0aGlzLmNoaWxkU2NvcGUgPSBuZXcgQ2hpbGRTY29wZSh0aGlzLmVsLCB0aGlzLiRvd25lcik7XG4gICAgICB0aGlzLmNFbC5yZXBsYWNlV2l0aCh0aGlzLmVsKTtcbiAgICB9O1xuXG4gICAgaWYgKGJpbmRpbmcudmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLm9uSGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcbiAgdXBkYXRlKGVsOiBhbnksIGJpbmRpbmcpIHtcbiAgICBpZiAoYmluZGluZy52YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuICB1bmJpbmQoZWwpIHtcbiAgICB0aGlzLm9uSGlkZSgpO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE1WVk07XG4iLCJpbXBvcnQgeyBnZXRWYWx1ZSwgaXNQbGFpbk9iamVjdCwgbWVyZ2VEZXNjcmlwdG9yIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBJRGVzdHJveSB9IGZyb20gJy4vdHlwaW5nJztcblxudHlwZSBDYWxsYmFjayA9ICh2YWw6IGFueSwgb2xkVmFsdWU6IGFueSkgPT4gdm9pZDtcbnR5cGUgQ2FsbGJhY2tXaXRoUGF0aCA9ICh2YWw6IGFueSwgb2xkVmFsdWU6IGFueSwgcGF0aDogc3RyaW5nKSA9PiB2b2lkO1xuXG5jbGFzcyBUb2tlbiB7XG4gIHByaXZhdGUgdmFsdWU6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IHsgb2JqOiBhbnk7IGtleTogc3RyaW5nOyB2YWx1ZTogYW55OyBjYjogQ2FsbGJhY2sgfSkge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcztcbiAgICBjb25zdCB7IGtleSwgdmFsdWUsIG9iaiwgY2IgfSA9IGNvbmZpZztcblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gcmVhY3RpdmVTZXR0ZXIoKSB7XG4gICAgICAgIHJldHVybiBzY29wZS52YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlR2V0dGVyKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gc2NvcGUudmFsdWU7XG4gICAgICAgIHNjb3BlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICBjYih2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IEdMT0FCTF9LRVkgPSAnR0xPQUJMJztcblxuY2xhc3MgV2F0Y2hlciBpbXBsZW1lbnRzIElEZXN0cm95IHtcbiAgb3duZXI6IGFueTtcbiAgbGlzdGVuZXJzOiB7XG4gICAgW3BhdGg6IHN0cmluZ106IENhbGxiYWNrV2l0aFBhdGhbXTtcbiAgfSA9IHt9O1xuICBjb25zdHJ1Y3Rvcihvd25lcjogYW55LCBkYXRhOiBhbnkpIHtcbiAgICBtZXJnZURlc2NyaXB0b3Iob3duZXIsIHRoaXMudHJhdmVyc2VEYXRhKGRhdGEpKTtcbiAgICB0aGlzLm93bmVyID0gb3duZXI7XG4gIH1cblxuICB0cmF2ZXJzZURhdGEoZGF0YTogYW55LCBwYXRoID0gJycpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IChwYXRoID8gcGF0aCArICcuJyA6ICcnKSArIGtleTtcblxuICAgICAgbmV3IFRva2VuKHtcbiAgICAgICAgb2JqOiByZXN1bHQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IGlzUGxhaW5PYmplY3QoZGF0YVtrZXldKVxuICAgICAgICAgID8gdGhpcy50cmF2ZXJzZURhdGEoZGF0YVtrZXldLCBmdWxsUGF0aClcbiAgICAgICAgICA6IGRhdGFba2V5XSxcbiAgICAgICAgY2I6IChuZXdWYWwsIG9sZFZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aCwgbmV3VmFsLCBvbGRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGg6IHN0cmluZywgbmV3VmFsdWU6IGFueSwgb2xkVmFsdWU6IGFueSkge1xuICAgIGxldCBwYXJlbnQgPSB0aGlzLm93bmVyO1xuICAgIGNvbnN0IHBhdGhBcnIgPSBmdWxsUGF0aC5zcGxpdCgnLicpO1xuICAgIGlmIChwYXRoQXJyLmxlbmd0aCA+PSAyKSB7XG4gICAgICBwYXJlbnQgPSBuZXcgRnVuY3Rpb24oXG4gICAgICAgICdkYXRhJyxcbiAgICAgICAgYHJldHVybiBkYXRhLiR7cGF0aEFyci5zbGljZSgwLCBwYXRoQXJyLmxlbmd0aCAtIDEpLmpvaW4oJy4nKX1gXG4gICAgICApKHRoaXMub3duZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IGtleTogc3RyaW5nID0gcGF0aEFyci5wb3AoKSE7XG5cbiAgICBpZiAoaXNQbGFpbk9iamVjdChuZXdWYWx1ZSkpIHtcbiAgICAgIG5ldyBUb2tlbih7XG4gICAgICAgIG9iajogcGFyZW50LFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiB0aGlzLnRyYXZlcnNlRGF0YShuZXdWYWx1ZSwgZnVsbFBhdGgpLFxuICAgICAgICBjYjogKF9uZXdWYWx1ZSwgX29sZFZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aCwgX25ld1ZhbHVlLCBfb2xkVmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKGZ1bGxQYXRoLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIocGF0aDogc3RyaW5nLCBjYjogQ2FsbGJhY2tXaXRoUGF0aCkge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IEdMT0FCTF9LRVk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmxpc3RlbmVyc1twYXRoXSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyc1twYXRoXS5wdXNoKGNiKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKHBhdGg6IHN0cmluZywgY2I/OiBDYWxsYmFja1dpdGhQYXRoKSB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gR0xPQUJMX0tFWTtcbiAgICB9XG5cbiAgICBpZiAoIWNiKSB7XG4gICAgICBkZWxldGUgdGhpcy5saXN0ZW5lcnNbcGF0aF07XG4gICAgfSBlbHNlIHtcbiAgICAgICh0aGlzLmxpc3RlbmVyc1twYXRoXSB8fCBbXSkuZmlsdGVyKGl0ZW0gPT4gaXRlbSA9PT0gY2IpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUFsbExpc3RlbmVycygpIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICB9XG5cbiAgdHJpZ2dlcihwYXRoOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbcGF0aF0pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0uZm9yRWFjaChjYiA9PiBjYihuZXdWYWx1ZSwgb2xkVmFsdWUsIHBhdGgpKTtcblxuICAgIC8vIOaUueWPmOS6huWvueixoe+8jOmCo+S5iOWtkOe6p+S5n+W6lOivpeaUtuWIsOmAmuefpVxuICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoa2V5ICE9PSBwYXRoICYmIGtleS5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGsgPSBrZXkucmVwbGFjZShwYXRoICsgJy4nLCAnJyk7XG4gICAgICAgIGNvbnN0IG9sZFYgPSBnZXRWYWx1ZShvbGRWYWx1ZSwgayk7XG4gICAgICAgIGNvbnN0IG5ld1YgPSBnZXRWYWx1ZShuZXdWYWx1ZSwgayk7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2tleV0uZm9yRWFjaChjYiA9PiBjYihuZXdWLCBvbGRWLCBrZXkpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICh0aGlzLmxpc3RlbmVyc1tHTE9BQkxfS0VZXSB8fCBbXSkuZm9yRWFjaChjYiA9PlxuICAgICAgY2IobmV3VmFsdWUsIG9sZFZhbHVlLCBwYXRoKVxuICAgICk7XG4gIH1cbn1cblxuLy8gY29uc3Qgb3duZXI6IGFueSA9IHt9O1xuXG4vLyBjb25zdCB3YXRjaGVyID0gbmV3IFdhdGNoZXIob3duZXIsIHtcbi8vICAgYTogMTAsXG4vLyAgIGI6IHtcbi8vICAgICBjOiAxMixcbi8vICAgfSxcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLmFkZExpc3RlbmVyKCdiJywgKHAxLCBwMikgPT4ge1xuLy8gICBjb25zb2xlLmxvZygnYiBjaGFuZ2VkJywgcDEsIHAyKTtcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLmFkZExpc3RlbmVyKCdiLmMnLCAocDEsIHAyKSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKCdiLmMgY2hhbmdlZCcsIHAxLCBwMik7XG4vLyB9KTtcblxuLy8gb3duZXIuYiA9IHsgYzogMTUgfTtcbi8vIG93bmVyLmIuYyA9ICd3YWhhaGFoYSc7XG5cbmV4cG9ydCBkZWZhdWx0IFdhdGNoZXI7XG4iLCJpbXBvcnQgTVZWTSBmcm9tICcuL01WVk0nO1xuXG5leHBvcnQgZGVmYXVsdCBNVlZNO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlKG9iajogYW55LCBwYXRoOiBzdHJpbmcsIGRlZmF1bHRWYWwgPSB1bmRlZmluZWQpIHtcbiAgbGV0IHZhbCA9IG9iajtcbiAgdHJ5IHtcbiAgICB2YWwgPSBuZXcgRnVuY3Rpb24oJ2RhdGEnLCBgcmV0dXJuIGRhdGEuJHtwYXRofWApKG9iaik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbDtcbiAgfVxuICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsIDogdmFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0VmFsdWUob2JqOiBhbnksIHBhdGg6IHN0cmluZywgdmFsOiBhbnkpIHtcbiAgdHJ5IHtcbiAgICBuZXcgRnVuY3Rpb24oJ2RhdGEnLCBgZGF0YS4ke3BhdGh9PSR7SlNPTi5zdHJpbmdpZnkodmFsKX1gKShvYmopO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iajogYW55KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmouY29uc3RydWN0b3IgPT09IE9iamVjdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRGVzY3JpcHRvcihhOiBhbnksIGI6IGFueSkge1xuICBmb3IgKGxldCBrZXkgaW4gYikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgIGEsXG4gICAgICBrZXksXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGIsIGtleSlcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUV4cHJlc3Npb24oXG4gIGV4cHJlc3Npb246IHN0cmluZyxcbiAgc2NvcGVOYW1lOiBzdHJpbmcgPSAndGhpcydcbikge1xuICBsZXQgaW5kZXggPSAwO1xuICBsZXQgbWF4ID0gZXhwcmVzc2lvbi5sZW5ndGg7XG4gIGxldCByZXN1bHQgPSAnJztcbiAgbGV0IGRlcGVuZGVuY2llczogc3RyaW5nW10gPSBbXTtcblxuICB3aGlsZSAoaW5kZXggPCBtYXgpIHtcbiAgICBsZXQgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KGluZGV4KTtcblxuICAgIGlmICgvJ3xcIi8udGVzdChjaGFyKSkge1xuICAgICAgY29uc3QgYyA9IGNoYXI7XG4gICAgICBsZXQgc3RyID0gXCInXCI7XG4gICAgICBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoKytpbmRleCk7XG4gICAgICB3aGlsZSAoY2hhciAhPT0gdW5kZWZpbmVkICYmIGNoYXIgIT09IGMpIHtcbiAgICAgICAgc3RyICs9IGNoYXI7XG4gICAgICAgIGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdCgrK2luZGV4KTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCArPSBzdHI7XG4gICAgICByZXN1bHQgKz0gXCInXCI7XG4gICAgICBpbmRleCsrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKGNoYXIgPT09ICd7JyB8fCBjaGFyID09PSAnLCcpIHtcbiAgICAgIHJlc3VsdCArPSBjaGFyO1xuICAgICAgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KCsraW5kZXgpO1xuICAgICAgd2hpbGUgKGNoYXIgIT09ICc6Jykge1xuICAgICAgICByZXN1bHQgKz0gY2hhcjtcbiAgICAgICAgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KCsraW5kZXgpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgbGV0IFZBUklBQkxFUyA9IC9bQS1aYS16X10vO1xuICAgIGlmIChWQVJJQUJMRVMudGVzdChjaGFyKSkge1xuICAgICAgbGV0IHZhbHVlID0gJyc7XG5cbiAgICAgIGxldCBwYXRoID0gJyc7XG4gICAgICBsZXQgcGF0aHM6IHN0cmluZ1tdID0gW107XG4gICAgICB3aGlsZSAoY2hhciAmJiAvW0EtWmEtel8wLTkuKCldLy50ZXN0KGNoYXIpKSB7XG4gICAgICAgIHZhbHVlICs9IGNoYXI7XG5cbiAgICAgICAgaWYgKGNoYXIgPT09ICcuJykge1xuICAgICAgICAgIHBhdGhzLnB1c2gocGF0aCk7XG4gICAgICAgICAgcGF0aCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhdGggKz0gY2hhcjtcbiAgICAgICAgfVxuICAgICAgICBjaGFyID0gZXhwcmVzc2lvblsrK2luZGV4XSB8fCAnJztcbiAgICAgIH1cblxuICAgICAgaW5kZXgtLTtcbiAgICAgIGNoYXIgPSAnJztcblxuICAgICAgLy8g54m55q6K5YC8XG4gICAgICBpZiAoWyd0cnVlJywgJ2ZhbHNlJywgJ251bGwnLCAndW5kZWZpbmVkJ10uaW5kZXhPZihwYXRoKSA+PSAwKSB7XG4gICAgICAgIHJlc3VsdCArPSBwYXRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKC9eW0EtWmEtel8wLTldKyQvLnRlc3QocGF0aCkpIHtcbiAgICAgICAgICBwYXRocy5wdXNoKHBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVwZW5kZW5jaWVzLnB1c2gocGF0aHMuam9pbignLicpKTtcbiAgICAgICAgcmVzdWx0ICs9IHNjb3BlTmFtZSArICcuZ2V0VmFsdWUoXCInICsgdmFsdWUgKyAnXCIpJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQgKz0gY2hhcjtcbiAgICBpbmRleCsrO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBleHByZXNzaW9uOiByZXN1bHQsXG4gICAgZGVwZW5kZW5jaWVzLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9SZWFsVmFsdWUodmFsdWU6IGFueSkge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gdmFsdWU7XG5cbiAgaWYgKC9eWzAtOV0/KFxcLlswLTldKyk/JC8udGVzdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTnVtYmVyKHZhbHVlKTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICdudWxsJykge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5PFQgPSBhbnk+KHZhbHVlOiBBcnJheUxpa2U8VD4pOiBBcnJheTxUPiB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh2YWx1ZSk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9