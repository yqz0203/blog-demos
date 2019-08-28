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
        const { expression, dependencies } = Object(_utils__WEBPACK_IMPORTED_MODULE_0__["parseExpression"])(path, 'this.$owner');
        const fn = new Function('return ' + expression).bind(this);
        this.listener = () => {
            const value = fn();
            if (this.config.update) {
                this.config.update.call(this, el, { value, expression: path });
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
            expression: path,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9NVlZNL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9NVlZNL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01WVk0vLi9zcmMvQ2hpbGRTY29wZS50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL0NvbXBpbGVyLnRzIiwid2VicGFjazovL01WVk0vLi9zcmMvRGlyZWN0aXZlLnRzIiwid2VicGFjazovL01WVk0vLi9zcmMvTVZWTS50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL1dhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vTVZWTS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9NVlZNLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7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LENBQUM7QUFFTSxTQUFTLE9BQU8sQ0FBVSxLQUFtQjtJQUNsRCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJNVlZNXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIk1WVk1cIl0gPSBmYWN0b3J5KCk7XG59KSh3aW5kb3csIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IElPd25lciBmcm9tICcuL0lPd25lcic7XG5pbXBvcnQgV2F0Y2hlciBmcm9tICcuL1dhdGNoZXInO1xuaW1wb3J0IENvbXBpbGVyIGZyb20gJy4vQ29tcGlsZXInO1xuaW1wb3J0IHsgZ2V0VmFsdWUgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hpbGRTY29wZSBpbXBsZW1lbnRzIElPd25lciB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbiAgJHBhcmVudDogSU93bmVyO1xuICAkd2F0Y2hlcjogV2F0Y2hlcjtcbiAgJGVsOiBhbnk7XG4gICRjb21wbGllcjogQ29tcGlsZXI7XG4gICRwYXJlbnRMaXN0ZW5lciA9IChuOiBhbnksIG86IGFueSwgcDogc3RyaW5nKSA9PiB7XG4gICAgdGhpcy4kd2F0Y2hlci50cmlnZ2VyKHAsIG4sIG8pO1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGVsOiBhbnksIHBhcmVudDogSU93bmVyKSB7XG4gICAgdGhpcy4kcGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuJGVsID0gZWw7XG4gICAgdGhpcy4kd2F0Y2hlciA9IG5ldyBXYXRjaGVyKHRoaXMsIHt9KTtcbiAgICB0aGlzLiRjb21wbGllciA9IG5ldyBDb21waWxlcih0aGlzKTtcbiAgICB0aGlzLiRjb21wbGllci5pbml0KCk7XG5cbiAgICB0aGlzLiRwYXJlbnQuJHdhdGNoZXIuYWRkTGlzdGVuZXIoJycsIHRoaXMuJHBhcmVudExpc3RlbmVyKTtcbiAgfVxuXG4gIGdldFZhbHVlKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHZhbCA9IGdldFZhbHVlKHRoaXMsIHBhdGgpO1xuXG4gICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy4kcGFyZW50LmdldFZhbHVlKHBhdGgpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBzZXREYXRhKG5ld0RhdGE6IGFueSkge1xuICAgIHRoaXMuJHBhcmVudC5zZXREYXRhKG5ld0RhdGEpO1xuICB9XG5cbiAgZ2V0RXZlbnQobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuJHBhcmVudC5nZXRFdmVudChuYW1lKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kY29tcGxpZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuJHdhdGNoZXIucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgdGhpcy4kcGFyZW50LiR3YXRjaGVyLnJlbW92ZUxpc3RlbmVyKCcnLCB0aGlzLiRwYXJlbnRMaXN0ZW5lcik7XG4gIH1cbn1cbiIsImltcG9ydCBEaXJlY3RpdmUsIHsgZGlyZWN0aXZlQ29uZmlnTWFwLCBESVJFQ1RJVkVfUFJFRklYIH0gZnJvbSAnLi9EaXJlY3RpdmUnO1xuaW1wb3J0IHsgcGFyc2VFeHByZXNzaW9uLCB0b1JlYWxWYWx1ZSwgdG9BcnJheSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IElPd25lciBmcm9tICcuL0lPd25lcic7XG5cbmNsYXNzIENvbXBpbGVyIHtcbiAgb3duZXI6IElPd25lcjtcbiAgZGlyZWN0aXZlczogRGlyZWN0aXZlW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihvd25lcjogSU93bmVyKSB7XG4gICAgdGhpcy5vd25lciA9IG93bmVyO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnRyYXZlcnNFTCh0aGlzLm93bmVyLiRlbCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGlyZWN0aXZlcy5mb3JFYWNoKGQgPT4gZC5kZXN0cm95KCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmF2ZXJzRUwoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMudHJhdmVyc0F0dHIoZWwpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgbm9kZTogYW55ID0gZWwuY2hpbGROb2Rlc1tpXTtcblxuICAgICAgLy8gdGV4dFxuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgbGV0IG5vZGVWYWx1ZSA9IG5vZGUubm9kZVZhbHVlITtcblxuICAgICAgICBsZXQgc2V0Tm9kZVZhbHVlID0gKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgLy8gY2hyb21lIOS4jeS8muinpuWPkemHjee7mFxuICAgICAgICAgIC8vIGlmIChub2RlLm5vZGVWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSB2YWw7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucGFyc2VUZW1wbGF0ZUFuZFNldChub2RlVmFsdWUsIHNldE5vZGVWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgdGhpcy50cmF2ZXJzRUwobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmF2ZXJzQXR0cihub2RlOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0b0FycmF5KG5vZGUuYXR0cmlidXRlcyk7XG5cbiAgICBsZXQgc2NvcGVkQXR0cjogYW55O1xuXG4gICAgYXR0cmlidXRlcy5zb21lKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZGlyZWN0aXZlQ29uZmlnTWFwLmdldChpdGVtLm5hbWUpO1xuXG4gICAgICAvLyBpZueahOS8mOWFiOe6p+aYr+acgOmrmOeahFxuICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0gRElSRUNUSVZFX1BSRUZJWCArICdpZicpIHtcbiAgICAgICAgc2NvcGVkQXR0ciA9IGl0ZW07XG4gICAgICB9XG5cbiAgICAgIGlmICghc2NvcGVkQXR0ciAmJiB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyAmJiBjb25maWcuc2NvcGVkKSB7XG4gICAgICAgIHNjb3BlZEF0dHIgPSBpdGVtO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHNjb3BlZEF0dHIpIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IHRoaXMuaW5pdERpcmVjdGl2ZShub2RlLCBzY29wZWRBdHRyKTtcblxuICAgICAgaWYgKGRpcmVjdGl2ZSAmJiBkaXJlY3RpdmUuJHNjb3BlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXR0cmlidXRlcy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgaWYgKCFhdHRyKSByZXR1cm47XG5cbiAgICAgIC8vIOaMh+S7pFxuICAgICAgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKERJUkVDVElWRV9QUkVGSVgpKSB7XG4gICAgICAgIHRoaXMuaW5pdERpcmVjdGl2ZShub2RlLCBhdHRyKTtcbiAgICAgIH1cbiAgICAgIC8vIGRvbeWxnuaAp1xuICAgICAgZWxzZSBpZiAoYXR0ci5uYW1lLnN0YXJ0c1dpdGgoJzonKSkge1xuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgICBjb25zdCBhdHRyTmFtZSA9IGF0dHIubmFtZS5zdWJzdHIoMSk7XG5cbiAgICAgICAgdGhpcy5wYXJzZVRlbXBsYXRlQW5kU2V0KCd7eycgKyBhdHRyLnZhbHVlICsgJ319JywgKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIG5vZGVbYXR0ck5hbWVdID0gdG9SZWFsVmFsdWUodmFsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAvLyDlm57osIPlh73mlbBcbiAgICAgIGVsc2UgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYXR0ci5uYW1lLnN1YnN0cigxKTtcbiAgICAgICAgbGV0IGV2ZW50RnVuY05hbWUgPSBhdHRyLnZhbHVlO1xuICAgICAgICBjb25zdCBwYXJzZWRzOiBBcnJheTxSZXR1cm5UeXBlPHR5cGVvZiBwYXJzZUV4cHJlc3Npb24+PiA9IFtdO1xuICAgICAgICBjb25zdCBtYXRjaGVkID0gZXZlbnRGdW5jTmFtZS5tYXRjaCgvKFteKCldKylcXCgoLispXFwpLyk7XG4gICAgICAgIC8vIOW4puWPguaVsOeahOWbnuiwg1xuICAgICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICAgIGV2ZW50RnVuY05hbWUgPSBtYXRjaGVkWzFdO1xuICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IG1hdGNoZWRbMl07XG4gICAgICAgICAgcGFyYW1zLnNwbGl0KCcsJykuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlRXhwcmVzc2lvbihwLCAndGhpcy5vd25lcicpO1xuICAgICAgICAgICAgcGFyc2Vkcy5wdXNoKHBhcnNlZCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYiA9IHRoaXMub3duZXIuZ2V0RXZlbnQoZXZlbnRGdW5jTmFtZS50cmltKCkpO1xuICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICBjb25zdCBmdW5jcyA9IHBhcnNlZHMubWFwKHBhcnNlZCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gJyArIHBhcnNlZC5leHByZXNzaW9uKS5iaW5kKHRoaXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGUgPT4ge1xuICAgICAgICAgICAgY2IuYXBwbHkobnVsbCwgW2UsIC4uLmZ1bmNzLm1hcChmdW5jID0+IGZ1bmMoKSldKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gaHRtbOWxnuaAp1xuICAgICAgZWxzZSB7XG4gICAgICAgIGxldCBjYiA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgdmFsKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQoYXR0ci52YWx1ZSwgY2IpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIGluaXREaXJlY3RpdmUobm9kZTogYW55LCBhdHRyOiBBdHRyKSB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICBjb25zdCBkaXJlY3RpdmVOYW1lID0gYXR0ci5uYW1lLnJlcGxhY2UoXG4gICAgICBuZXcgUmVnRXhwKCdeJyArIERJUkVDVElWRV9QUkVGSVgpLFxuICAgICAgJydcbiAgICApO1xuICAgIGNvbnN0IGRkID0gZGlyZWN0aXZlQ29uZmlnTWFwLmdldChkaXJlY3RpdmVOYW1lKTtcblxuICAgIGlmICghZGQpIHtcbiAgICAgIGNvbnNvbGUud2Fybign5pyq55+l55qE5oyH5Luk77yaJywgZGlyZWN0aXZlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IG5ldyBEaXJlY3RpdmUodGhpcy5vd25lciwgbm9kZSwgYXR0ci52YWx1ZSwgZGQpO1xuICAgICAgdGhpcy5kaXJlY3RpdmVzLnB1c2goZGlyZWN0aXZlKTtcblxuICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVGVtcGxhdGVBbmRTZXQoXG4gICAgdGVtcGxhdGU6IHN0cmluZyxcbiAgICBzZXROb2RlVmFsdWU6ICh2YWw6IHN0cmluZykgPT4gdm9pZFxuICApIHtcbiAgICBjb25zdCB2YWx1ZVJlZ2V4cCA9IC97eyhbXn1dKyl9fS9nO1xuXG4gICAgbGV0IHJlc3VsdCA9IHZhbHVlUmVnZXhwLmV4ZWModGVtcGxhdGUpO1xuICAgIGxldCBhbGxTY29wZUtleXM6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGNhbENvbnRleHRzOiBBcnJheTx7XG4gICAgICBzdGFydEluZGV4OiBudW1iZXI7XG4gICAgICBlbmRJbmRleDogbnVtYmVyO1xuICAgICAgY2FsOiAoKSA9PiBzdHJpbmc7XG4gICAgfT4gPSBbXTtcblxuICAgIHdoaWxlIChyZXN1bHQpIHtcbiAgICAgIGNvbnN0IHsgaW5kZXggfSA9IHJlc3VsdDtcbiAgICAgIGxldCB0cGwgPSByZXN1bHRbMV07XG4gICAgICBsZXQgZnVsbFRwbCA9IHJlc3VsdFswXTtcblxuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VFeHByZXNzaW9uKHRwbCwgJ3RoaXMub3duZXInKTtcbiAgICAgIGxldCBzY29wZUtleXMgPSBwYXJzZWQuZGVwZW5kZW5jaWVzO1xuXG4gICAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbigncmV0dXJuICcgKyBwYXJzZWQuZXhwcmVzc2lvbikuYmluZCh0aGlzKTtcblxuICAgICAgYWxsU2NvcGVLZXlzID0gWy4uLmFsbFNjb3BlS2V5cywgLi4uc2NvcGVLZXlzXTtcbiAgICAgIGNhbENvbnRleHRzID0gW1xuICAgICAgICAuLi5jYWxDb250ZXh0cyxcbiAgICAgICAge1xuICAgICAgICAgIHN0YXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgIGVuZEluZGV4OiBpbmRleCArIGZ1bGxUcGwubGVuZ3RoLFxuICAgICAgICAgIGNhbDogKCkgPT4gZm4uYXBwbHkodGhpcyksXG4gICAgICAgIH0sXG4gICAgICBdO1xuXG4gICAgICByZXN1bHQgPSB2YWx1ZVJlZ2V4cC5leGVjKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBjb25zdCBjYWxWYWx1ZSA9ICgpID0+IHtcbiAgICAgIGxldCBsYXN0ZW5kID0gMDtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjYWxDb250ZXh0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UobGFzdGVuZCwgY2FsQ29udGV4dHNbaV0uc3RhcnRJbmRleCk7XG4gICAgICAgIHZhbHVlICs9IGNhbENvbnRleHRzW2ldLmNhbCgpO1xuICAgICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShcbiAgICAgICAgICBjYWxDb250ZXh0c1tpXS5lbmRJbmRleCxcbiAgICAgICAgICBpIDwgbCAtIDEgPyBjYWxDb250ZXh0c1tpICsgMV0uc3RhcnRJbmRleCA6IHVuZGVmaW5lZFxuICAgICAgICApO1xuICAgICAgICBsYXN0ZW5kID0gY2FsQ29udGV4dHNbaV0uZW5kSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKFxuICAgICAgICBsYXN0ZW5kLFxuICAgICAgICBjYWxDb250ZXh0c1tjYWxDb250ZXh0cy5sZW5ndGggLSAxXS5zdGFydEluZGV4XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGFsbFNjb3BlS2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIHNldE5vZGVWYWx1ZShjYWxWYWx1ZSgpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLm93bmVyLiR3YXRjaGVyLmFkZExpc3RlbmVyKGssIGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVyKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcGlsZXI7XG4iLCJpbXBvcnQgSU93bmVyIGZyb20gJy4vSU93bmVyJztcbmltcG9ydCB7IHBhcnNlRXhwcmVzc2lvbiB9IGZyb20gJy4vdXRpbHMnO1xuXG50eXBlIE9iamVjdERpcmVjdGl2ZUNvbmZpZyA9IHtcbiAgc2NvcGVkPzogYm9vbGVhbjtcbiAgYmluZCh0aGlzOiBEaXJlY3RpdmUsIGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogYW55KTogdm9pZDtcbiAgdXBkYXRlPyh0aGlzOiBEaXJlY3RpdmUsIGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogYW55KTogdm9pZDtcbiAgdW5iaW5kPyh0aGlzOiBEaXJlY3RpdmUsIGVsOiBIVE1MRWxlbWVudCk6IHZvaWQ7XG59O1xuXG50eXBlIEZ1bmN0aW9uRGlyZWN0aXZlQ29uZmlnID0gKGVsOiBIVE1MRWxlbWVudCwgYmluZGluZzogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgdHlwZSBEaXJlY3RpdmVDb25maWcgPSBPYmplY3REaXJlY3RpdmVDb25maWcgfCBGdW5jdGlvbkRpcmVjdGl2ZUNvbmZpZztcblxuY2xhc3MgRGlyZWN0aXZlIHtcbiAgcHJpdmF0ZSBjb25maWc6IE9iamVjdERpcmVjdGl2ZUNvbmZpZztcbiAgcHJpdmF0ZSBsaXN0ZW5lcjogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSByZW1vdmVMaXN0ZW5lcnM6ICgpID0+IHZvaWQ7XG4gICRlbDogSFRNTEVsZW1lbnQ7XG4gICRvd25lcjogSU93bmVyO1xuICAkc2NvcGVkOiBib29sZWFuO1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG4gIGNvbnN0cnVjdG9yKFxuICAgIG93bmVyOiBJT3duZXIsXG4gICAgZWw6IEhUTUxFbGVtZW50LFxuICAgIHBhdGg6IHN0cmluZyxcbiAgICBjb25maWc6IERpcmVjdGl2ZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLiRlbCA9IGVsO1xuICAgIHRoaXMuJG93bmVyID0gb3duZXI7XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgIGJpbmQ6IGNvbmZpZyxcbiAgICAgICAgdXBkYXRlOiBjb25maWcsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG5cbiAgICBjb25zdCB7IGV4cHJlc3Npb24sIGRlcGVuZGVuY2llcyB9ID0gcGFyc2VFeHByZXNzaW9uKHBhdGgsICd0aGlzLiRvd25lcicpO1xuICAgIGNvbnN0IGZuID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gJyArIGV4cHJlc3Npb24pLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBmbigpO1xuICAgICAgaWYgKHRoaXMuY29uZmlnLnVwZGF0ZSkge1xuICAgICAgICB0aGlzLmNvbmZpZy51cGRhdGUuY2FsbCh0aGlzLCBlbCwgeyB2YWx1ZSwgZXhwcmVzc2lvbjogcGF0aCB9KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZGVwZW5kZW5jaWVzLmZvckVhY2goZHAgPT4ge1xuICAgICAgdGhpcy4kb3duZXIuJHdhdGNoZXIuYWRkTGlzdGVuZXIoZHAsIHRoaXMubGlzdGVuZXIpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcnMgPSAoKSA9PiB7XG4gICAgICBkZXBlbmRlbmNpZXMuZm9yRWFjaChkcCA9PlxuICAgICAgICB0aGlzLiRvd25lci4kd2F0Y2hlci5yZW1vdmVMaXN0ZW5lcihkcCwgdGhpcy5saXN0ZW5lcilcbiAgICAgICk7XG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlnLmJpbmQuY2FsbCh0aGlzLCBlbCwge1xuICAgICAgdmFsdWU6IGZuKCksXG4gICAgICBleHByZXNzaW9uOiBwYXRoLFxuICAgIH0pO1xuXG4gICAgdGhpcy4kc2NvcGVkID0gdGhpcy5jb25maWcuc2NvcGVkIHx8IGZhbHNlO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jb25maWcudW5iaW5kKSB7XG4gICAgICB0aGlzLmNvbmZpZy51bmJpbmQuY2FsbCh0aGlzLCB0aGlzLiRlbCk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXJzKCk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGRpcmVjdGl2ZUNvbmZpZ01hcCA9IG5ldyBNYXA8c3RyaW5nLCBEaXJlY3RpdmVDb25maWc+KCk7XG5cbmV4cG9ydCBjb25zdCBESVJFQ1RJVkVfUFJFRklYID0gJ3gtJztcblxuZXhwb3J0IGRlZmF1bHQgRGlyZWN0aXZlO1xuIiwiaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi9XYXRjaGVyJztcbmltcG9ydCB7IHNldFZhbHVlLCBnZXRWYWx1ZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgRGlyZWN0aXZlQ29uZmlnLCBkaXJlY3RpdmVDb25maWdNYXAgfSBmcm9tICcuL0RpcmVjdGl2ZSc7XG5pbXBvcnQgQ29tcGlsZXIgZnJvbSAnLi9Db21waWxlcic7XG5pbXBvcnQgSU93bmVyIGZyb20gJy4vSU93bmVyJztcbmltcG9ydCBDaGlsZFNjb3BlIGZyb20gJy4vQ2hpbGRTY29wZSc7XG5cbmludGVyZmFjZSBNVlZNQ29uZmlnIHtcbiAgZWw6IEhUTUxFbGVtZW50O1xuICBkYXRhOiBhbnk7XG4gIGNyZWF0ZWQ/OiAoKSA9PiB2b2lkO1xuICBkZXN0cm95ZWQ/OiAoKSA9PiB2b2lkO1xuICB3YXRjaD86IHsgW2tleTogc3RyaW5nXTogKG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpID0+IHZvaWQgfTtcbiAgY29tcHV0ZWQ6IGFueTtcbiAgbWV0aG9kczogYW55O1xufVxuXG5jbGFzcyBNVlZNIGltcGxlbWVudHMgSU93bmVyIHtcbiAgc3RhdGljIGRpcmVjdGl2ZSA9IGZ1bmN0aW9uKG5hbWU6IHN0cmluZywgY29uZmlnOiBEaXJlY3RpdmVDb25maWcpIHtcbiAgICBkaXJlY3RpdmVDb25maWdNYXAuc2V0KG5hbWUsIGNvbmZpZyk7XG4gIH07XG5cbiAgJGVsOiBIVE1MRWxlbWVudDtcbiAgJHdhdGNoZXI6IFdhdGNoZXI7XG4gICRjb21wbGllcjogQ29tcGlsZXI7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcblxuICBwcml2YXRlIGNvbmZpZzogTVZWTUNvbmZpZztcbiAgY29uc3RydWN0b3IoY29uZmlnOiBNVlZNQ29uZmlnKSB7XG4gICAgdGhpcy4kZWwgPSBjb25maWcuZWw7XG4gICAgdGhpcy4kd2F0Y2hlciA9IG5ldyBXYXRjaGVyKHRoaXMsIGNvbmZpZy5kYXRhKTtcbiAgICB0aGlzLiRjb21wbGllciA9IG5ldyBDb21waWxlcih0aGlzKTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIHRoaXMuaW5pdE1ldGhvZHMoKTtcbiAgICB0aGlzLmluaXRDb21wdXRlZCgpO1xuICAgIHRoaXMuaW5pdFdhdGNoKCk7XG4gICAgdGhpcy4kY29tcGxpZXIuaW5pdCgpO1xuICAgIHRoaXMuY29uZmlnLmNyZWF0ZWQgJiYgdGhpcy5jb25maWcuY3JlYXRlZC5jYWxsKHRoaXMpO1xuICB9XG5cbiAgc2V0RGF0YShuZXdEYXRhOiBhbnkpIHtcbiAgICBpZiAoIW5ld0RhdGEpIHJldHVybjtcbiAgICBPYmplY3Qua2V5cyhuZXdEYXRhKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpc1trXSA9IG5ld0RhdGFba107XG4gICAgfSk7XG4gIH1cblxuICBnZXRWYWx1ZShwYXRoOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gZ2V0VmFsdWUodGhpcywgcGF0aCk7XG4gIH1cblxuICBnZXRFdmVudChuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpc1tuYW1lXSA/IHRoaXNbbmFtZV0uYmluZCh0aGlzKSA6ICcnO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLiRjb21wbGllci5kZXN0cm95KCk7XG4gICAgdGhpcy4kd2F0Y2hlci5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLmNvbmZpZy5kZXN0cm95ZWQgJiYgdGhpcy5jb25maWcuZGVzdHJveWVkLmNhbGwodGhpcyk7XG4gIH1cblxuICBwcml2YXRlIGluaXRDb21wdXRlZCgpIHtcbiAgICBjb25zdCBjb21wdXRlZCA9IHRoaXMuY29uZmlnLmNvbXB1dGVkIHx8IHt9O1xuICAgIGNvbnN0IGNvbXB1dGVkS2V5cyA9IE9iamVjdC5rZXlzKGNvbXB1dGVkKTtcblxuICAgIGNvbXB1dGVkS2V5cy5mb3JFYWNoKGNrZXkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBjb21wdXRlZFtja2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzW2NrZXldID0gY29tcHV0ZWRbY2tleV0uY2FsbCh0aGlzKTtcbiAgICAgICAgICB0aGlzLiR3YXRjaGVyLnRyaWdnZXIoY2tleSwgdGhpc1tja2V5XSwgJycpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiR3YXRjaGVyLmFkZExpc3RlbmVyKCcnLCBjYik7XG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY29tcHV0ZWRbY2tleV0pKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gWy4uLmNvbXB1dGVkW2NrZXldXTtcbiAgICAgICAgY29uc3QgZm4gPSB2YWx1ZS5wb3AoKTtcbiAgICAgICAgdmFsdWUuZm9yRWFjaChwYXRoID0+IHtcbiAgICAgICAgICBjb25zdCBjYiA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXNbY2tleV0gPSBmbi5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy4kd2F0Y2hlci50cmlnZ2VyKGNrZXksIHRoaXNbY2tleV0sICcnKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHRoaXMuJHdhdGNoZXIuYWRkTGlzdGVuZXIocGF0aCwgY2IpO1xuICAgICAgICAgIGNiKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0V2F0Y2goKSB7XG4gICAgY29uc3Qgd2F0Y2ggPSB0aGlzLmNvbmZpZy53YXRjaCB8fCB7fTtcbiAgICBjb25zdCB3YXRjaEtleXMgPSBPYmplY3Qua2V5cyh3YXRjaCk7XG4gICAgd2F0Y2hLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHRoaXMuJHdhdGNoZXIuYWRkTGlzdGVuZXIoa2V5LCAobiwgbywga2V5KSA9PiB7XG4gICAgICAgIHdhdGNoW2tleV0uY2FsbCh0aGlzLCBuLCBvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0TWV0aG9kcygpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5tZXRob2RzIHx8IHt9KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzW2tleV0gPSB0aGlzLmNvbmZpZy5tZXRob2RzW2tleV0uYmluZCh0aGlzKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vLyDlhoXnva7mjIfku6Rcbk1WVk0uZGlyZWN0aXZlKCdtb2RlbCcsIHtcbiAgYmluZChlbDogYW55LCBiaW5kaW5nKSB7XG4gICAgdGhpcy5jYWxsYmFjayA9IChlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHZhbCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgc2V0VmFsdWUodGhpcy4kb3duZXIsIGJpbmRpbmcuZXhwcmVzc2lvbiwgdmFsKTtcbiAgICB9O1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5jYWxsYmFjayk7XG4gICAgZWwudmFsdWUgPSBiaW5kaW5nLnZhbHVlO1xuICB9LFxuICB1cGRhdGUoZWw6IGFueSwgYmluZGluZykge1xuICAgIGlmIChlbC52YWx1ZSA9PT0gYmluZGluZy52YWx1ZSkgcmV0dXJuO1xuICAgIGVsLnZhbHVlID0gYmluZGluZy52YWx1ZTtcbiAgfSxcbiAgdW5iaW5kKGVsKSB7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmNhbGxiYWNrKTtcbiAgfSxcbn0pO1xuXG5NVlZNLmRpcmVjdGl2ZSgnc2hvdycsIChlbCwgYmluZGluZykgPT4ge1xuICBlbC5zdHlsZS5kaXNwbGF5ID0gYmluZGluZy52YWx1ZSA/ICcnIDogJ25vbmUnO1xufSk7XG5cbk1WVk0uZGlyZWN0aXZlKCdpZicsIHtcbiAgc2NvcGVkOiB0cnVlLFxuICBiaW5kKGVsOiBIVE1MRWxlbWVudCwgYmluZGluZykge1xuICAgIGNvbnN0IGh0bWwgPSBlbC5vdXRlckhUTUw7XG4gICAgdGhpcy5jRWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCctLSBpZiBibG9jayAtLScpO1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLm9uSGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jaGlsZFNjb3BlICYmIHRoaXMuY2hpbGRTY29wZS5kZXN0cm95KCk7XG4gICAgICB0aGlzLmVsLnJlcGxhY2VXaXRoKHRoaXMuY0VsKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vblNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBuRWw6IGFueSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbkVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICBuRWwgPSBuRWwuZmlyc3RDaGlsZDtcblxuICAgICAgdGhpcy5lbC5yZXBsYWNlV2l0aChuRWwpO1xuICAgICAgdGhpcy5lbCA9IG5FbDtcbiAgICAgIHRoaXMuY2hpbGRTY29wZSA9IG5ldyBDaGlsZFNjb3BlKHRoaXMuZWwsIHRoaXMuJG93bmVyKTtcbiAgICAgIHRoaXMuY0VsLnJlcGxhY2VXaXRoKHRoaXMuZWwpO1xuICAgIH07XG5cbiAgICBpZiAoYmluZGluZy52YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuICB1cGRhdGUoZWw6IGFueSwgYmluZGluZykge1xuICAgIGlmIChiaW5kaW5nLnZhbHVlID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG4gIHVuYmluZChlbCkge1xuICAgIHRoaXMub25IaWRlKCk7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTVZWTTtcbiIsImltcG9ydCB7IGdldFZhbHVlLCBpc1BsYWluT2JqZWN0LCBtZXJnZURlc2NyaXB0b3IgfSBmcm9tICcuL3V0aWxzJztcblxudHlwZSBDYWxsYmFjayA9ICh2YWw6IGFueSwgb2xkVmFsdWU6IGFueSkgPT4gdm9pZDtcbnR5cGUgQ2FsbGJhY2tXaXRoUGF0aCA9ICh2YWw6IGFueSwgb2xkVmFsdWU6IGFueSwgcGF0aDogc3RyaW5nKSA9PiB2b2lkO1xuXG5jbGFzcyBUb2tlbiB7XG4gIHByaXZhdGUgdmFsdWU6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IHsgb2JqOiBhbnk7IGtleTogc3RyaW5nOyB2YWx1ZTogYW55OyBjYjogQ2FsbGJhY2sgfSkge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcztcbiAgICBjb25zdCB7IGtleSwgdmFsdWUsIG9iaiwgY2IgfSA9IGNvbmZpZztcblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gcmVhY3RpdmVTZXR0ZXIoKSB7XG4gICAgICAgIHJldHVybiBzY29wZS52YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlR2V0dGVyKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gc2NvcGUudmFsdWU7XG4gICAgICAgIHNjb3BlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICBjYih2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IEdMT0FCTF9LRVkgPSAnR0xPQUJMJztcblxuY2xhc3MgV2F0Y2hlciB7XG4gIG93bmVyOiBhbnk7XG4gIGxpc3RlbmVyczoge1xuICAgIFtwYXRoOiBzdHJpbmddOiBDYWxsYmFja1dpdGhQYXRoW107XG4gIH0gPSB7fTtcbiAgY29uc3RydWN0b3Iob3duZXI6IGFueSwgZGF0YTogYW55KSB7XG4gICAgbWVyZ2VEZXNjcmlwdG9yKG93bmVyLCB0aGlzLnRyYXZlcnNlRGF0YShkYXRhKSk7XG4gICAgdGhpcy5vd25lciA9IG93bmVyO1xuICB9XG5cbiAgdHJhdmVyc2VEYXRhKGRhdGE6IGFueSwgcGF0aCA9ICcnKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgZnVsbFBhdGggPSAocGF0aCA/IHBhdGggKyAnLicgOiAnJykgKyBrZXk7XG5cbiAgICAgIG5ldyBUb2tlbih7XG4gICAgICAgIG9iajogcmVzdWx0LFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiBpc1BsYWluT2JqZWN0KGRhdGFba2V5XSlcbiAgICAgICAgICA/IHRoaXMudHJhdmVyc2VEYXRhKGRhdGFba2V5XSwgZnVsbFBhdGgpXG4gICAgICAgICAgOiBkYXRhW2tleV0sXG4gICAgICAgIGNiOiAobmV3VmFsLCBvbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGgsIG5ld1ZhbCwgb2xkVmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGhhbmRsZVZhbHVlQ2hhbmdlKGZ1bGxQYXRoOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpIHtcbiAgICBsZXQgcGFyZW50ID0gdGhpcy5vd25lcjtcbiAgICBjb25zdCBwYXRoQXJyID0gZnVsbFBhdGguc3BsaXQoJy4nKTtcbiAgICBpZiAocGF0aEFyci5sZW5ndGggPj0gMikge1xuICAgICAgcGFyZW50ID0gbmV3IEZ1bmN0aW9uKFxuICAgICAgICAnZGF0YScsXG4gICAgICAgIGByZXR1cm4gZGF0YS4ke3BhdGhBcnIuc2xpY2UoMCwgcGF0aEFyci5sZW5ndGggLSAxKS5qb2luKCcuJyl9YFxuICAgICAgKSh0aGlzLm93bmVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBrZXk6IHN0cmluZyA9IHBhdGhBcnIucG9wKCkhO1xuXG4gICAgaWYgKGlzUGxhaW5PYmplY3QobmV3VmFsdWUpKSB7XG4gICAgICBuZXcgVG9rZW4oe1xuICAgICAgICBvYmo6IHBhcmVudCxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogdGhpcy50cmF2ZXJzZURhdGEobmV3VmFsdWUsIGZ1bGxQYXRoKSxcbiAgICAgICAgY2I6IChfbmV3VmFsdWUsIF9vbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGgsIF9uZXdWYWx1ZSwgX29sZFZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcihmdWxsUGF0aCwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIGFkZExpc3RlbmVyKHBhdGg6IHN0cmluZywgY2I6IENhbGxiYWNrV2l0aFBhdGgpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbcGF0aF0pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0ucHVzaChjYik7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihwYXRoOiBzdHJpbmcsIGNiPzogQ2FsbGJhY2tXaXRoUGF0aCkge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IEdMT0FCTF9LRVk7XG4gICAgfVxuXG4gICAgaWYgKCFjYikge1xuICAgICAgZGVsZXRlIHRoaXMubGlzdGVuZXJzW3BhdGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICAodGhpcy5saXN0ZW5lcnNbcGF0aF0gfHwgW10pLmZpbHRlcihpdGVtID0+IGl0ZW0gPT09IGNiKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVBbGxMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgfVxuXG4gIHRyaWdnZXIocGF0aDogc3RyaW5nLCBuZXdWYWx1ZTogYW55LCBvbGRWYWx1ZTogYW55KSB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gR0xPQUJMX0tFWTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubGlzdGVuZXJzW3BhdGhdKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyc1twYXRoXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdLmZvckVhY2goY2IgPT4gY2IobmV3VmFsdWUsIG9sZFZhbHVlLCBwYXRoKSk7XG5cbiAgICAvLyDmlLnlj5jkuoblr7nosaHvvIzpgqPkuYjlrZDnuqfkuZ/lupTor6XmlLbliLDpgJrnn6VcbiAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKGtleSAhPT0gcGF0aCAmJiBrZXkuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICBjb25zdCBrID0ga2V5LnJlcGxhY2UocGF0aCArICcuJywgJycpO1xuICAgICAgICBjb25zdCBvbGRWID0gZ2V0VmFsdWUob2xkVmFsdWUsIGspO1xuICAgICAgICBjb25zdCBuZXdWID0gZ2V0VmFsdWUobmV3VmFsdWUsIGspO1xuICAgICAgICB0aGlzLmxpc3RlbmVyc1trZXldLmZvckVhY2goY2IgPT4gY2IobmV3Viwgb2xkViwga2V5KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAodGhpcy5saXN0ZW5lcnNbR0xPQUJMX0tFWV0gfHwgW10pLmZvckVhY2goY2IgPT5cbiAgICAgIGNiKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgcGF0aClcbiAgICApO1xuICB9XG59XG5cbi8vIGNvbnN0IG93bmVyOiBhbnkgPSB7fTtcblxuLy8gY29uc3Qgd2F0Y2hlciA9IG5ldyBXYXRjaGVyKG93bmVyLCB7XG4vLyAgIGE6IDEwLFxuLy8gICBiOiB7XG4vLyAgICAgYzogMTIsXG4vLyAgIH0sXG4vLyB9KTtcblxuLy8gd2F0Y2hlci5hZGRMaXN0ZW5lcignYicsIChwMSwgcDIpID0+IHtcbi8vICAgY29uc29sZS5sb2coJ2IgY2hhbmdlZCcsIHAxLCBwMik7XG4vLyB9KTtcblxuLy8gd2F0Y2hlci5hZGRMaXN0ZW5lcignYi5jJywgKHAxLCBwMikgPT4ge1xuLy8gICBjb25zb2xlLmxvZygnYi5jIGNoYW5nZWQnLCBwMSwgcDIpO1xuLy8gfSk7XG5cbi8vIG93bmVyLmIgPSB7IGM6IDE1IH07XG4vLyBvd25lci5iLmMgPSAnd2FoYWhhaGEnO1xuXG5leHBvcnQgZGVmYXVsdCBXYXRjaGVyO1xuIiwiaW1wb3J0IE1WVk0gZnJvbSAnLi9NVlZNJztcblxuZXhwb3J0IGRlZmF1bHQgTVZWTTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRWYWx1ZShvYmo6IGFueSwgcGF0aDogc3RyaW5nLCBkZWZhdWx0VmFsID0gdW5kZWZpbmVkKSB7XG4gIGxldCB2YWwgPSBvYmo7XG4gIHRyeSB7XG4gICAgdmFsID0gbmV3IEZ1bmN0aW9uKCdkYXRhJywgYHJldHVybiBkYXRhLiR7cGF0aH1gKShvYmopO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWw7XG4gIH1cbiAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbCA6IHZhbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFZhbHVlKG9iajogYW55LCBwYXRoOiBzdHJpbmcsIHZhbDogYW55KSB7XG4gIHRyeSB7XG4gICAgbmV3IEZ1bmN0aW9uKCdkYXRhJywgYGRhdGEuJHtwYXRofT0ke0pTT04uc3RyaW5naWZ5KHZhbCl9YCkob2JqKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmo6IGFueSkge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlc2NyaXB0b3IoYTogYW55LCBiOiBhbnkpIHtcbiAgZm9yIChsZXQga2V5IGluIGIpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICBhLFxuICAgICAga2V5LFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiLCBrZXkpXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKFxuICBleHByZXNzaW9uOiBzdHJpbmcsXG4gIHNjb3BlTmFtZTogc3RyaW5nID0gJ3RoaXMnXG4pIHtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IG1heCA9IGV4cHJlc3Npb24ubGVuZ3RoO1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGxldCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG5cbiAgd2hpbGUgKGluZGV4IDwgbWF4KSB7XG4gICAgbGV0IGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdChpbmRleCk7XG5cbiAgICBpZiAoLyd8XCIvLnRlc3QoY2hhcikpIHtcbiAgICAgIGNvbnN0IGMgPSBjaGFyO1xuICAgICAgbGV0IHN0ciA9IFwiJ1wiO1xuICAgICAgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KCsraW5kZXgpO1xuICAgICAgd2hpbGUgKGNoYXIgIT09IHVuZGVmaW5lZCAmJiBjaGFyICE9PSBjKSB7XG4gICAgICAgIHN0ciArPSBjaGFyO1xuICAgICAgICBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoKytpbmRleCk7XG4gICAgICB9XG4gICAgICByZXN1bHQgKz0gc3RyO1xuICAgICAgcmVzdWx0ICs9IFwiJ1wiO1xuICAgICAgaW5kZXgrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChjaGFyID09PSAneycgfHwgY2hhciA9PT0gJywnKSB7XG4gICAgICByZXN1bHQgKz0gY2hhcjtcbiAgICAgIGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdCgrK2luZGV4KTtcbiAgICAgIHdoaWxlIChjaGFyICE9PSAnOicpIHtcbiAgICAgICAgcmVzdWx0ICs9IGNoYXI7XG4gICAgICAgIGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdCgrK2luZGV4KTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGxldCBWQVJJQUJMRVMgPSAvW0EtWmEtel9dLztcbiAgICBpZiAoVkFSSUFCTEVTLnRlc3QoY2hhcikpIHtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuXG4gICAgICBsZXQgcGF0aCA9ICcnO1xuICAgICAgbGV0IHBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgd2hpbGUgKGNoYXIgJiYgL1tBLVphLXpfMC05LigpXS8udGVzdChjaGFyKSkge1xuICAgICAgICB2YWx1ZSArPSBjaGFyO1xuXG4gICAgICAgIGlmIChjaGFyID09PSAnLicpIHtcbiAgICAgICAgICBwYXRocy5wdXNoKHBhdGgpO1xuICAgICAgICAgIHBhdGggPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRoICs9IGNoYXI7XG4gICAgICAgIH1cbiAgICAgICAgY2hhciA9IGV4cHJlc3Npb25bKytpbmRleF0gfHwgJyc7XG4gICAgICB9XG5cbiAgICAgIGluZGV4LS07XG4gICAgICBjaGFyID0gJyc7XG5cbiAgICAgIC8vIOeJueauiuWAvFxuICAgICAgaWYgKFsndHJ1ZScsICdmYWxzZScsICdudWxsJywgJ3VuZGVmaW5lZCddLmluZGV4T2YocGF0aCkgPj0gMCkge1xuICAgICAgICByZXN1bHQgKz0gcGF0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICgvXltBLVphLXpfMC05XSskLy50ZXN0KHBhdGgpKSB7XG4gICAgICAgICAgcGF0aHMucHVzaChwYXRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlcGVuZGVuY2llcy5wdXNoKHBhdGhzLmpvaW4oJy4nKSk7XG4gICAgICAgIHJlc3VsdCArPSBzY29wZU5hbWUgKyAnLmdldFZhbHVlKFwiJyArIHZhbHVlICsgJ1wiKSc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVzdWx0ICs9IGNoYXI7XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZXhwcmVzc2lvbjogcmVzdWx0LFxuICAgIGRlcGVuZGVuY2llcyxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUmVhbFZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIHZhbHVlO1xuXG4gIGlmICgvXlswLTldPyhcXC5bMC05XSspPyQvLnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSk7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAnbnVsbCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheTxUID0gYW55Pih2YWx1ZTogQXJyYXlMaWtlPFQ+KTogQXJyYXk8VD4ge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodmFsdWUpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==