/******/ (function(modules) { // webpackBootstrap
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
/* harmony import */ var _Complier__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Complier */ "./src/Complier.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");



class ChildScope {
    constructor(el, parent) {
        this.$parentListener = (n, o, p) => {
            this.$watcher.trigger(p, n, o);
        };
        this.$parent = parent;
        this.$el = el;
        this.$watcher = new _Watcher__WEBPACK_IMPORTED_MODULE_0__["default"](this, {});
        this.$complier = new _Complier__WEBPACK_IMPORTED_MODULE_1__["default"](this);
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

/***/ "./src/Complier.ts":
/*!*************************!*\
  !*** ./src/Complier.ts ***!
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
            if (attr.name.startsWith(_Directive__WEBPACK_IMPORTED_MODULE_0__["DIRECTIVE_PREFIX"])) {
                this.initDirective(node, attr);
            }
            else if (attr.name.startsWith(':')) {
                node.removeAttribute(attr.name);
                const attrName = attr.name.substr(1);
                this.parseTemplateAndSet('{{' + attr.value + '}}', (val) => {
                    // @ts-ignore
                    node[attrName] = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["toRealValue"])(val);
                });
            }
            // @ts-ignore
            else if (attr.name.startsWith('@')) {
                node.removeAttribute(attr.name);
                const eventName = attr.name.substr(1);
                const eventFuncName = attr.value;
                const cb = this.owner.getEvent(eventFuncName);
                if (cb) {
                    node.addEventListener(eventName, cb);
                }
            }
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
    parseTemplateAndSet(template, setNodeValue, formNode) {
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
/* harmony import */ var _Complier__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Complier */ "./src/Complier.ts");
/* harmony import */ var _ChildScope__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ChildScope */ "./src/ChildScope.ts");





class MVVM {
    constructor(config) {
        this.$el = config.el;
        this.$watcher = new _Watcher__WEBPACK_IMPORTED_MODULE_0__["default"](this, config.data);
        this.$complier = new _Complier__WEBPACK_IMPORTED_MODULE_3__["default"](this);
        this.config = config;
        this.initLifeCycles();
        this.initMethods();
        this.$complier.init();
        this.initComputed();
        this.created(this);
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
        return this[name];
    }
    initLifeCycles() {
        this['created'] = () => {
            this.config.created && this.config.created.call(this);
        };
        this['destroy'] = () => {
            this.$complier.destroy();
            this.$watcher.removeAllListeners();
            this.config.destroy && this.config.destroy.call(this);
        };
    }
    initComputed() {
        const computed = this.config.computed || {};
        const computedKeys = Object.keys(computed);
        this.$watcher.addListener('', (n, o, key) => {
            if (computedKeys.indexOf(key) >= 0) {
                return;
            }
            computedKeys.forEach(ckey => {
                this[ckey] = computed[ckey].call(this);
                this.$watcher.trigger(ckey, this[ckey], '');
            });
        });
        computedKeys.forEach(ckey => {
            this[ckey] = computed[ckey].call(this);
            this.$watcher.trigger(ckey, this[ckey], '');
        });
    }
    initMethods() {
        Object.keys(this.config.methods).forEach(key => {
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
        const nEl = document.createElement('div');
        nEl.innerHTML = html;
        this.el = nEl.firstChild;
        this.cEl = document.createComment('-- if block --');
        el.replaceWith(this.el);
        this.childScope = new _ChildScope__WEBPACK_IMPORTED_MODULE_4__["default"](this.el, this.$owner);
        this.onHide = function () {
            this.childScope.destroy();
            this.el.replaceWith(this.cEl);
        };
        this.onShow = function () {
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

const initialData = () => ({
    name: 'John',
    age: 10,
    gender: 1,
    submiting: false,
    currentTime: new Date(),
    extra: {
        like: 'game',
    },
    showInfo: true,
    list: [{ name: 'yqz' }, { name: 'shenjingwei' }],
});
new _MVVM__WEBPACK_IMPORTED_MODULE_0__["default"]({
    el: document.getElementById('app'),
    data: initialData(),
    created() {
        this.interval = setInterval(() => {
            this.currentTime = new Date();
        }, 1000);
    },
    destroy() {
        clearInterval(this.interval);
    },
    computed: {
        genderText() {
            return this.gender == 1 ? '男' : '女';
        },
        currentTimeStr() {
            return this.currentTime.toLocaleString();
        },
    },
    methods: {
        changeGender() {
            this.gender = this.gender == 1 ? 0 : 1;
        },
        toggleShowInfo() {
            this.showInfo = !this.showInfo;
        },
        reset() {
            const newData = initialData();
            this.setData(newData);
        },
        submit() {
            this.submiting = true;
            setTimeout(() => {
                alert('提交成功');
                this.submiting = false;
            }, 1000);
        },
    },
});
/* harmony default export */ __webpack_exports__["default"] = (null);


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
                char = expression[++index];
            }
            if (/^[A-Za-z_0-9]+$/.test(path)) {
                paths.push(path);
            }
            dependencies.push(paths.join('.'));
            result += scopeName + '.getValue("' + value + (char || '') + '")';
            index++;
            continue;
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

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NoaWxkU2NvcGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbXBsaWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9EaXJlY3RpdmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01WVk0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDakZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBZ0M7QUFDRTtBQUNDO0FBRXBCLE1BQU0sVUFBVTtJQVU3QixZQUFZLEVBQU8sRUFBRSxNQUFjO1FBSm5DLG9CQUFlLEdBQUcsQ0FBQyxDQUFNLEVBQUUsQ0FBTSxFQUFFLENBQVMsRUFBRSxFQUFFO1lBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDO1FBR0EsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksZ0RBQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGlEQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUV0QixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQVk7UUFDbkIsTUFBTSxHQUFHLEdBQUcsdURBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakMsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEM7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBWTtRQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsUUFBUSxDQUFDLElBQVk7UUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7Q0FDRjs7Ozs7Ozs7Ozs7OztBQ2hERDtBQUFBO0FBQUE7QUFBOEU7QUFDZDtBQUdoRSxNQUFNLFFBQVE7SUFJWixZQUFZLEtBQVU7UUFGdEIsZUFBVSxHQUFnQixFQUFFLENBQUM7UUFHM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFTyxTQUFTLENBQUMsRUFBZTtRQUMvQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEtBQUssS0FBSyxFQUFFO1lBQ2xDLE9BQU87U0FDUjtRQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxNQUFNLElBQUksR0FBUSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRW5DLE9BQU87WUFDUCxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxFQUFFO2dCQUN2QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBVSxDQUFDO2dCQUVoQyxJQUFJLFlBQVksR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO29CQUNqQyxnQkFBZ0I7b0JBQ2hCLGdDQUFnQztvQkFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7b0JBQ3JCLElBQUk7Z0JBQ04sQ0FBQyxDQUFDO2dCQUVGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDbkQ7aUJBQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsRUFBRTtnQkFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN0QjtTQUNGO0lBQ0gsQ0FBQztJQUVPLFdBQVcsQ0FBQyxJQUFpQjtRQUNuQyxNQUFNLFVBQVUsR0FBRyxzREFBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU1QyxJQUFJLFVBQWUsQ0FBQztRQUVwQixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3JCLE1BQU0sTUFBTSxHQUFHLDZEQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFakQsYUFBYTtZQUNiLElBQUksSUFBSSxDQUFDLElBQUksS0FBSywyREFBZ0IsR0FBRyxJQUFJLEVBQUU7Z0JBQ3pDLFVBQVUsR0FBRyxJQUFJLENBQUM7YUFDbkI7WUFFRCxJQUFJLENBQUMsVUFBVSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUM5RCxVQUFVLEdBQUcsSUFBSSxDQUFDO2FBQ25CO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLFVBQVUsRUFBRTtZQUNkLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBRXZELElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2xDLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7U0FDRjtRQUVELFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTztZQUVsQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLDJEQUFnQixDQUFDLEVBQUU7Z0JBQzFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ2hDO2lCQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFckMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQVcsRUFBRSxFQUFFO29CQUNqRSxhQUFhO29CQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRywwREFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDLENBQUMsQ0FBQzthQUNKO1lBQ0QsYUFBYTtpQkFDUixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2pDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLEVBQUUsRUFBRTtvQkFDTixJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lCQUN0QzthQUNGO2lCQUFNO2dCQUNMLElBQUksRUFBRSxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDcEMsQ0FBQyxDQUFDO2dCQUVGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQzFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxhQUFhLENBQUMsSUFBUyxFQUFFLElBQVU7UUFDekMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQ3JDLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRywyREFBZ0IsQ0FBQyxFQUNsQyxFQUFFLENBQ0gsQ0FBQztRQUNGLE1BQU0sRUFBRSxHQUFHLDZEQUFrQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDdkM7YUFBTTtZQUNMLE1BQU0sU0FBUyxHQUFHLElBQUksa0RBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRWhDLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztJQUVPLG1CQUFtQixDQUN6QixRQUFnQixFQUNoQixZQUFtQyxFQUNuQyxRQUFjO1FBRWQsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDO1FBRW5DLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsSUFBSSxZQUFZLEdBQWEsRUFBRSxDQUFDO1FBQ2hDLElBQUksV0FBVyxHQUlWLEVBQUUsQ0FBQztRQUVSLE9BQU8sTUFBTSxFQUFFO1lBQ2IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQztZQUN6QixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXhCLE1BQU0sTUFBTSxHQUFHLDhEQUFlLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ2xELElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7WUFFcEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxRQUFRLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEUsWUFBWSxHQUFHLENBQUMsR0FBRyxZQUFZLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQztZQUMvQyxXQUFXLEdBQUc7Z0JBQ1osR0FBRyxXQUFXO2dCQUNkO29CQUNFLFVBQVUsRUFBRSxLQUFLO29CQUNqQixRQUFRLEVBQUUsS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNO29CQUNoQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7aUJBQzFCO2FBQ0YsQ0FBQztZQUVGLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsTUFBTSxRQUFRLEdBQUcsR0FBRyxFQUFFO1lBQ3BCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNoQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsRCxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM1RCxLQUFLLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUM5QixLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FDckIsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFDdkIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQ3RELENBQUM7Z0JBQ0YsT0FBTyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7YUFDbkM7WUFFRCxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FDckIsT0FBTyxFQUNQLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FDL0MsQ0FBQztZQUVGLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQyxDQUFDO1FBRUYsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2QixNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUU7Z0JBQ3BCLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQztZQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDN0MsUUFBUSxFQUFFLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVjLHVFQUFRLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUNyTHhCO0FBQUE7QUFBQTtBQUFBLE1BQU0sU0FBUztJQU1iLFlBQ0UsS0FBYSxFQUNiLEVBQWUsRUFDZixJQUFZLEVBQ1osTUFBdUI7UUFFdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUVwQixJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtZQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHO2dCQUNaLElBQUksRUFBRSxNQUFNO2dCQUNaLE1BQU0sRUFBRSxNQUFNO2FBQ2YsQ0FBQztTQUNIO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUN0QjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDM0MsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ3JFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUM5QixLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ2pDLFVBQVUsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDO0lBQzdDLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QztJQUNILENBQUM7Q0FDRjtBQUVNLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxHQUFHLEVBQTJCLENBQUM7QUFFOUQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFFdEIsd0VBQVMsRUFBQzs7Ozs7Ozs7Ozs7OztBQzlEekI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWdDO0FBQ2E7QUFDcUI7QUFDaEM7QUFFSTtBQVd0QyxNQUFNLElBQUk7SUFXUixZQUFZLE1BQWtCO1FBQzVCLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksZ0RBQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxpREFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsT0FBTyxDQUFDLE9BQVk7UUFDbEIsSUFBSSxDQUFDLE9BQU87WUFBRSxPQUFPO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQy9CLGFBQWE7WUFDYixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZO1FBQ25CLE9BQU8sdURBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZO1FBQ25CLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFTyxjQUFjO1FBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLEVBQUU7WUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hELENBQUMsQ0FBQztJQUNKLENBQUM7SUFFTyxZQUFZO1FBQ2xCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUU1QyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDMUMsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbEMsT0FBTzthQUNSO1lBQ0QsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxXQUFXO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDN0MsYUFBYTtZQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOztBQTNFTSxjQUFTLEdBQUcsVUFBUyxJQUFZLEVBQUUsTUFBdUI7SUFDL0QsNkRBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN2QyxDQUFDLENBQUM7QUE0RUosT0FBTztBQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO0lBQ3RCLElBQUksQ0FBQyxFQUFPLEVBQUUsT0FBTztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBTSxFQUFFLEVBQUU7WUFDekIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDM0IsdURBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDO1FBQ0YsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxNQUFNLENBQUMsRUFBTyxFQUFFLE9BQU87UUFDckIsSUFBSSxFQUFFLENBQUMsS0FBSyxLQUFLLE9BQU8sQ0FBQyxLQUFLO1lBQUUsT0FBTztRQUN2QyxFQUFFLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxFQUFFO1FBQ1AsRUFBRSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakQsQ0FBQztDQUNGLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQ3JDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ2pELENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUU7SUFDbkIsTUFBTSxFQUFFLElBQUk7SUFDWixJQUFJLENBQUMsRUFBZSxFQUFFLE9BQU87UUFDM0IsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQztRQUUxQixNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUN6QixJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNwRCxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV4QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksbURBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2RCxJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1osSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLE1BQU0sR0FBRztZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUM7UUFFRixJQUFJLE9BQU8sQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFFO1lBQzNCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjtJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsRUFBTyxFQUFFLE9BQU87UUFDckIsSUFBSSxPQUFPLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRTtZQUMzQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFDO0FBRVksbUVBQUksRUFBQzs7Ozs7Ozs7Ozs7OztBQzNKcEI7QUFBQTtBQUFtRTtBQUtuRSxNQUFNLEtBQUs7SUFHVCxZQUFZLE1BQTJEO1FBQ3JFLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBRXZDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtZQUM5QixVQUFVLEVBQUUsSUFBSTtZQUNoQixZQUFZLEVBQUUsSUFBSTtZQUNsQixHQUFHLEVBQUUsU0FBUyxjQUFjO2dCQUMxQixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDckIsQ0FBQztZQUNELEdBQUcsRUFBRSxTQUFTLGNBQWMsQ0FBQyxLQUFLO2dCQUNoQyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUM3QixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDcEIsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO29CQUN0QixFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUNyQjtZQUNILENBQUM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUM7QUFFNUIsTUFBTSxPQUFPO0lBS1gsWUFBWSxLQUFVLEVBQUUsSUFBUztRQUhqQyxjQUFTLEdBRUwsRUFBRSxDQUFDO1FBRUwsOERBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxZQUFZLENBQUMsSUFBUyxFQUFFLElBQUksR0FBRyxFQUFFO1FBQy9CLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM5QixNQUFNLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1lBRWhELElBQUksS0FBSyxDQUFDO2dCQUNSLEdBQUcsRUFBRSxNQUFNO2dCQUNYLEdBQUc7Z0JBQ0gsS0FBSyxFQUFFLDREQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDO29CQUN4QyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDYixFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRCxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsaUJBQWlCLENBQUMsUUFBZ0IsRUFBRSxRQUFhLEVBQUUsUUFBYTtRQUM5RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3hCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUN2QixNQUFNLEdBQUcsSUFBSSxRQUFRLENBQ25CLE1BQU0sRUFDTixlQUFlLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQ2hFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2Y7UUFFRCxNQUFNLEdBQUcsR0FBVyxPQUFPLENBQUMsR0FBRyxFQUFHLENBQUM7UUFFbkMsSUFBSSw0REFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzNCLElBQUksS0FBSyxDQUFDO2dCQUNSLEdBQUcsRUFBRSxNQUFNO2dCQUNYLEdBQUc7Z0JBQ0gsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztnQkFDNUMsRUFBRSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFO29CQUMzQixJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDekQsQ0FBQzthQUNGLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxXQUFXLENBQUMsSUFBWSxFQUFFLEVBQW9CO1FBQzVDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxJQUFJLEdBQUcsVUFBVSxDQUFDO1NBQ25CO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDM0I7UUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsY0FBYyxDQUFDLElBQVksRUFBRSxFQUFxQjtRQUNoRCxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsSUFBSSxHQUFHLFVBQVUsQ0FBQztTQUNuQjtRQUVELElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDUCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0I7YUFBTTtZQUNMLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDMUQ7SUFDSCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxPQUFPLENBQUMsSUFBWSxFQUFFLFFBQWEsRUFBRSxRQUFhO1FBQ2hELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxJQUFJLEdBQUcsVUFBVSxDQUFDO1NBQ25CO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDM0I7UUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFakUsb0JBQW9CO1FBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN4QyxJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLElBQUksR0FBRyx1REFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxJQUFJLEdBQUcsdURBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUN4RDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUM5QyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FDN0IsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVELHlCQUF5QjtBQUV6Qix1Q0FBdUM7QUFDdkMsV0FBVztBQUNYLFNBQVM7QUFDVCxhQUFhO0FBQ2IsT0FBTztBQUNQLE1BQU07QUFFTix5Q0FBeUM7QUFDekMsc0NBQXNDO0FBQ3RDLE1BQU07QUFFTiwyQ0FBMkM7QUFDM0Msd0NBQXdDO0FBQ3hDLE1BQU07QUFFTix1QkFBdUI7QUFDdkIsMEJBQTBCO0FBRVgsc0VBQU8sRUFBQzs7Ozs7Ozs7Ozs7OztBQ25LdkI7QUFBQTtBQUEwQjtBQUUxQixNQUFNLFdBQVcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLElBQUksRUFBRSxNQUFNO0lBQ1osR0FBRyxFQUFFLEVBQUU7SUFDUCxNQUFNLEVBQUUsQ0FBQztJQUNULFNBQVMsRUFBRSxLQUFLO0lBQ2hCLFdBQVcsRUFBRSxJQUFJLElBQUksRUFBRTtJQUN2QixLQUFLLEVBQUU7UUFDTCxJQUFJLEVBQUUsTUFBTTtLQUNiO0lBQ0QsUUFBUSxFQUFFLElBQUk7SUFDZCxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQztDQUNqRCxDQUFDLENBQUM7QUFFSCxJQUFJLDZDQUFJLENBQUM7SUFDUCxFQUFFLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUU7SUFDbkMsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUNuQixPQUFPO1FBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFO1lBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNoQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDWCxDQUFDO0lBQ0QsT0FBTztRQUNMLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELFFBQVEsRUFBRTtRQUNSLFVBQVU7WUFDUixPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUN0QyxDQUFDO1FBQ0QsY0FBYztZQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMzQyxDQUFDO0tBQ0Y7SUFDRCxPQUFPLEVBQUU7UUFDUCxZQUFZO1lBQ1YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUVELGNBQWM7WUFDWixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNqQyxDQUFDO1FBRUQsS0FBSztZQUNILE1BQU0sT0FBTyxHQUFHLFdBQVcsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUVELE1BQU07WUFDSixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUV0QixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN6QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDWCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFWSxtRUFBSSxFQUFDOzs7Ozs7Ozs7Ozs7O0FDM0RwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQU8sU0FBUyxRQUFRLENBQUMsR0FBUSxFQUFFLElBQVksRUFBRSxVQUFVLEdBQUcsU0FBUztJQUNyRSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDZCxJQUFJO1FBQ0YsR0FBRyxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxlQUFlLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDeEQ7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUM5QyxDQUFDO0FBRU0sU0FBUyxRQUFRLENBQUMsR0FBUSxFQUFFLElBQVksRUFBRSxHQUFRO0lBQ3ZELElBQUk7UUFDRixJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbEU7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU87S0FDUjtBQUNILENBQUM7QUFFTSxTQUFTLGFBQWEsQ0FBQyxHQUFRO0lBQ3BDLE9BQU8sT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDO0FBQy9ELENBQUM7QUFFTSxTQUFTLGVBQWUsQ0FBQyxDQUFNLEVBQUUsQ0FBTTtJQUM1QyxLQUFLLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRTtRQUNqQixNQUFNLENBQUMsY0FBYyxDQUNuQixDQUFDLEVBQ0QsR0FBRztRQUNILGFBQWE7UUFDYixNQUFNLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUN4QyxDQUFDO0tBQ0g7QUFDSCxDQUFDO0FBRU0sU0FBUyxlQUFlLENBQzdCLFVBQWtCLEVBQ2xCLFlBQW9CLE1BQU07SUFFMUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUM1QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxZQUFZLEdBQWEsRUFBRSxDQUFDO0lBRWhDLE9BQU8sS0FBSyxHQUFHLEdBQUcsRUFBRTtRQUNsQixJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXBDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDZixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDZCxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO2dCQUN2QyxHQUFHLElBQUksSUFBSSxDQUFDO2dCQUNaLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDbkM7WUFDRCxNQUFNLElBQUksR0FBRyxDQUFDO1lBQ2QsTUFBTSxJQUFJLEdBQUcsQ0FBQztZQUNkLEtBQUssRUFBRSxDQUFDO1lBQ1IsU0FBUztTQUNWO1FBRUQsSUFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDO1FBQzVCLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFFZixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLEtBQUssR0FBYSxFQUFFLENBQUM7WUFDekIsT0FBTyxJQUFJLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMzQyxLQUFLLElBQUksSUFBSSxDQUFDO2dCQUVkLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtvQkFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakIsSUFBSSxHQUFHLEVBQUUsQ0FBQztpQkFDWDtxQkFBTTtvQkFDTCxJQUFJLElBQUksSUFBSSxDQUFDO2lCQUNkO2dCQUNELElBQUksR0FBRyxVQUFVLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUM1QjtZQUVELElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNoQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xCO1lBRUQsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxJQUFJLFNBQVMsR0FBRyxhQUFhLEdBQUcsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNsRSxLQUFLLEVBQUUsQ0FBQztZQUNSLFNBQVM7U0FDVjtRQUVELE1BQU0sSUFBSSxJQUFJLENBQUM7UUFDZixLQUFLLEVBQUUsQ0FBQztLQUNUO0lBRUQsT0FBTztRQUNMLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLFlBQVk7S0FDYixDQUFDO0FBQ0osQ0FBQztBQUVNLFNBQVMsV0FBVyxDQUFDLEtBQVU7SUFDcEMsSUFBSSxDQUFDLEtBQUs7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUV6QixJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNyQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN0QjtTQUFNLElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtRQUMzQixPQUFPLElBQUksQ0FBQztLQUNiO1NBQU0sSUFBSSxLQUFLLEtBQUssT0FBTyxFQUFFO1FBQzVCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7U0FBTSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7UUFDM0IsT0FBTyxJQUFJLENBQUM7S0FDYjtTQUFNLElBQUksS0FBSyxLQUFLLFdBQVcsRUFBRTtRQUNoQyxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVNLFNBQVMsT0FBTyxDQUFVLEtBQW1CO0lBQ2xELE9BQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNDLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IElPd25lciBmcm9tICcuL0lPd25lcic7XG5pbXBvcnQgV2F0Y2hlciBmcm9tICcuL1dhdGNoZXInO1xuaW1wb3J0IENvbXBpbGVyIGZyb20gJy4vQ29tcGxpZXInO1xuaW1wb3J0IHsgZ2V0VmFsdWUgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hpbGRTY29wZSBpbXBsZW1lbnRzIElPd25lciB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbiAgJHBhcmVudDogSU93bmVyO1xuICAkd2F0Y2hlcjogV2F0Y2hlcjtcbiAgJGVsOiBhbnk7XG4gICRjb21wbGllcjogQ29tcGlsZXI7XG4gICRwYXJlbnRMaXN0ZW5lciA9IChuOiBhbnksIG86IGFueSwgcDogc3RyaW5nKSA9PiB7XG4gICAgdGhpcy4kd2F0Y2hlci50cmlnZ2VyKHAsIG4sIG8pO1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKGVsOiBhbnksIHBhcmVudDogSU93bmVyKSB7XG4gICAgdGhpcy4kcGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuJGVsID0gZWw7XG4gICAgdGhpcy4kd2F0Y2hlciA9IG5ldyBXYXRjaGVyKHRoaXMsIHt9KTtcbiAgICB0aGlzLiRjb21wbGllciA9IG5ldyBDb21waWxlcih0aGlzKTtcbiAgICB0aGlzLiRjb21wbGllci5pbml0KCk7XG5cbiAgICB0aGlzLiRwYXJlbnQuJHdhdGNoZXIuYWRkTGlzdGVuZXIoJycsIHRoaXMuJHBhcmVudExpc3RlbmVyKTtcbiAgfVxuXG4gIGdldFZhbHVlKHBhdGg6IHN0cmluZykge1xuICAgIGNvbnN0IHZhbCA9IGdldFZhbHVlKHRoaXMsIHBhdGgpO1xuXG4gICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy4kcGFyZW50LmdldFZhbHVlKHBhdGgpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWw7XG4gIH1cblxuICBzZXREYXRhKG5ld0RhdGE6IGFueSkge1xuICAgIHRoaXMuJHBhcmVudC5zZXREYXRhKG5ld0RhdGEpO1xuICB9XG5cbiAgZ2V0RXZlbnQobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuJHBhcmVudC5nZXRFdmVudChuYW1lKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy4kY29tcGxpZXIuZGVzdHJveSgpO1xuICAgIHRoaXMuJHdhdGNoZXIucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgdGhpcy4kcGFyZW50LiR3YXRjaGVyLnJlbW92ZUxpc3RlbmVyKCcnLCB0aGlzLiRwYXJlbnRMaXN0ZW5lcik7XG4gIH1cbn1cbiIsImltcG9ydCBEaXJlY3RpdmUsIHsgZGlyZWN0aXZlQ29uZmlnTWFwLCBESVJFQ1RJVkVfUFJFRklYIH0gZnJvbSAnLi9EaXJlY3RpdmUnO1xuaW1wb3J0IHsgcGFyc2VFeHByZXNzaW9uLCB0b1JlYWxWYWx1ZSwgdG9BcnJheSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IElPd25lciBmcm9tICcuL0lPd25lcic7XG5cbmNsYXNzIENvbXBpbGVyIHtcbiAgb3duZXI6IElPd25lcjtcbiAgZGlyZWN0aXZlczogRGlyZWN0aXZlW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihvd25lcjogYW55KSB7XG4gICAgdGhpcy5vd25lciA9IG93bmVyO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnRyYXZlcnNFTCh0aGlzLm93bmVyLiRlbCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZGlyZWN0aXZlcy5mb3JFYWNoKGQgPT4gZC5kZXN0cm95KCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmF2ZXJzRUwoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMudHJhdmVyc0F0dHIoZWwpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgbm9kZTogYW55ID0gZWwuY2hpbGROb2Rlc1tpXTtcblxuICAgICAgLy8gdGV4dFxuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDMpIHtcbiAgICAgICAgbGV0IG5vZGVWYWx1ZSA9IG5vZGUubm9kZVZhbHVlITtcblxuICAgICAgICBsZXQgc2V0Tm9kZVZhbHVlID0gKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgLy8gY2hyb21lIOS4jeS8muinpuWPkemHjee7mFxuICAgICAgICAgIC8vIGlmIChub2RlLm5vZGVWYWx1ZSAhPT0gdmFsKSB7XG4gICAgICAgICAgbm9kZS5ub2RlVmFsdWUgPSB2YWw7XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucGFyc2VUZW1wbGF0ZUFuZFNldChub2RlVmFsdWUsIHNldE5vZGVWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgdGhpcy50cmF2ZXJzRUwobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmF2ZXJzQXR0cihub2RlOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0b0FycmF5KG5vZGUuYXR0cmlidXRlcyk7XG5cbiAgICBsZXQgc2NvcGVkQXR0cjogYW55O1xuXG4gICAgYXR0cmlidXRlcy5zb21lKGl0ZW0gPT4ge1xuICAgICAgY29uc3QgY29uZmlnID0gZGlyZWN0aXZlQ29uZmlnTWFwLmdldChpdGVtLm5hbWUpO1xuXG4gICAgICAvLyBpZueahOS8mOWFiOe6p+aYr+acgOmrmOeahFxuICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0gRElSRUNUSVZFX1BSRUZJWCArICdpZicpIHtcbiAgICAgICAgc2NvcGVkQXR0ciA9IGl0ZW07XG4gICAgICB9XG5cbiAgICAgIGlmICghc2NvcGVkQXR0ciAmJiB0eXBlb2YgY29uZmlnID09PSAnb2JqZWN0JyAmJiBjb25maWcuc2NvcGVkKSB7XG4gICAgICAgIHNjb3BlZEF0dHIgPSBpdGVtO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHNjb3BlZEF0dHIpIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IHRoaXMuaW5pdERpcmVjdGl2ZShub2RlLCBzY29wZWRBdHRyKTtcblxuICAgICAgaWYgKGRpcmVjdGl2ZSAmJiBkaXJlY3RpdmUuJHNjb3BlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXR0cmlidXRlcy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgaWYgKCFhdHRyKSByZXR1cm47XG5cbiAgICAgIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aChESVJFQ1RJVkVfUFJFRklYKSkge1xuICAgICAgICB0aGlzLmluaXREaXJlY3RpdmUobm9kZSwgYXR0cik7XG4gICAgICB9IGVsc2UgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKCc6JykpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICAgICAgY29uc3QgYXR0ck5hbWUgPSBhdHRyLm5hbWUuc3Vic3RyKDEpO1xuXG4gICAgICAgIHRoaXMucGFyc2VUZW1wbGF0ZUFuZFNldCgne3snICsgYXR0ci52YWx1ZSArICd9fScsICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBub2RlW2F0dHJOYW1lXSA9IHRvUmVhbFZhbHVlKHZhbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZWxzZSBpZiAoYXR0ci5uYW1lLnN0YXJ0c1dpdGgoJ0AnKSkge1xuICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgICBjb25zdCBldmVudE5hbWUgPSBhdHRyLm5hbWUuc3Vic3RyKDEpO1xuICAgICAgICBjb25zdCBldmVudEZ1bmNOYW1lID0gYXR0ci52YWx1ZTtcbiAgICAgICAgY29uc3QgY2IgPSB0aGlzLm93bmVyLmdldEV2ZW50KGV2ZW50RnVuY05hbWUpO1xuICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjYik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBjYiA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgdmFsKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQoYXR0ci52YWx1ZSwgY2IpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcml2YXRlIGluaXREaXJlY3RpdmUobm9kZTogYW55LCBhdHRyOiBBdHRyKSB7XG4gICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICBjb25zdCBkaXJlY3RpdmVOYW1lID0gYXR0ci5uYW1lLnJlcGxhY2UoXG4gICAgICBuZXcgUmVnRXhwKCdeJyArIERJUkVDVElWRV9QUkVGSVgpLFxuICAgICAgJydcbiAgICApO1xuICAgIGNvbnN0IGRkID0gZGlyZWN0aXZlQ29uZmlnTWFwLmdldChkaXJlY3RpdmVOYW1lKTtcblxuICAgIGlmICghZGQpIHtcbiAgICAgIGNvbnNvbGUud2Fybign5pyq55+l55qE5oyH5Luk77yaJywgZGlyZWN0aXZlTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IG5ldyBEaXJlY3RpdmUodGhpcy5vd25lciwgbm9kZSwgYXR0ci52YWx1ZSwgZGQpO1xuICAgICAgdGhpcy5kaXJlY3RpdmVzLnB1c2goZGlyZWN0aXZlKTtcblxuICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVGVtcGxhdGVBbmRTZXQoXG4gICAgdGVtcGxhdGU6IHN0cmluZyxcbiAgICBzZXROb2RlVmFsdWU6ICh2YWw6IHN0cmluZykgPT4gdm9pZCxcbiAgICBmb3JtTm9kZT86IGFueVxuICApIHtcbiAgICBjb25zdCB2YWx1ZVJlZ2V4cCA9IC97eyhbXn1dKyl9fS9nO1xuXG4gICAgbGV0IHJlc3VsdCA9IHZhbHVlUmVnZXhwLmV4ZWModGVtcGxhdGUpO1xuICAgIGxldCBhbGxTY29wZUtleXM6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGNhbENvbnRleHRzOiBBcnJheTx7XG4gICAgICBzdGFydEluZGV4OiBudW1iZXI7XG4gICAgICBlbmRJbmRleDogbnVtYmVyO1xuICAgICAgY2FsOiAoKSA9PiBzdHJpbmc7XG4gICAgfT4gPSBbXTtcblxuICAgIHdoaWxlIChyZXN1bHQpIHtcbiAgICAgIGNvbnN0IHsgaW5kZXggfSA9IHJlc3VsdDtcbiAgICAgIGxldCB0cGwgPSByZXN1bHRbMV07XG4gICAgICBsZXQgZnVsbFRwbCA9IHJlc3VsdFswXTtcblxuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VFeHByZXNzaW9uKHRwbCwgJ3RoaXMub3duZXInKTtcbiAgICAgIGxldCBzY29wZUtleXMgPSBwYXJzZWQuZGVwZW5kZW5jaWVzO1xuXG4gICAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbigncmV0dXJuICcgKyBwYXJzZWQuZXhwcmVzc2lvbikuYmluZCh0aGlzKTtcblxuICAgICAgYWxsU2NvcGVLZXlzID0gWy4uLmFsbFNjb3BlS2V5cywgLi4uc2NvcGVLZXlzXTtcbiAgICAgIGNhbENvbnRleHRzID0gW1xuICAgICAgICAuLi5jYWxDb250ZXh0cyxcbiAgICAgICAge1xuICAgICAgICAgIHN0YXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgIGVuZEluZGV4OiBpbmRleCArIGZ1bGxUcGwubGVuZ3RoLFxuICAgICAgICAgIGNhbDogKCkgPT4gZm4uYXBwbHkodGhpcyksXG4gICAgICAgIH0sXG4gICAgICBdO1xuXG4gICAgICByZXN1bHQgPSB2YWx1ZVJlZ2V4cC5leGVjKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBjb25zdCBjYWxWYWx1ZSA9ICgpID0+IHtcbiAgICAgIGxldCBsYXN0ZW5kID0gMDtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjYWxDb250ZXh0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UobGFzdGVuZCwgY2FsQ29udGV4dHNbaV0uc3RhcnRJbmRleCk7XG4gICAgICAgIHZhbHVlICs9IGNhbENvbnRleHRzW2ldLmNhbCgpO1xuICAgICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShcbiAgICAgICAgICBjYWxDb250ZXh0c1tpXS5lbmRJbmRleCxcbiAgICAgICAgICBpIDwgbCAtIDEgPyBjYWxDb250ZXh0c1tpICsgMV0uc3RhcnRJbmRleCA6IHVuZGVmaW5lZFxuICAgICAgICApO1xuICAgICAgICBsYXN0ZW5kID0gY2FsQ29udGV4dHNbaV0uZW5kSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKFxuICAgICAgICBsYXN0ZW5kLFxuICAgICAgICBjYWxDb250ZXh0c1tjYWxDb250ZXh0cy5sZW5ndGggLSAxXS5zdGFydEluZGV4XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGFsbFNjb3BlS2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIHNldE5vZGVWYWx1ZShjYWxWYWx1ZSgpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLm93bmVyLiR3YXRjaGVyLmFkZExpc3RlbmVyKGssIGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVyKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcGlsZXI7XG4iLCJpbXBvcnQgSU93bmVyIGZyb20gJy4vSU93bmVyJztcblxudHlwZSBPYmplY3REaXJlY3RpdmVDb25maWcgPSB7XG4gIHNjb3BlZD86IGJvb2xlYW47XG4gIGJpbmQodGhpczogRGlyZWN0aXZlLCBlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IGFueSk6IHZvaWQ7XG4gIHVwZGF0ZT8odGhpczogRGlyZWN0aXZlLCBlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IGFueSk6IHZvaWQ7XG4gIHVuYmluZD8odGhpczogRGlyZWN0aXZlLCBlbDogSFRNTEVsZW1lbnQpOiB2b2lkO1xufTtcblxudHlwZSBGdW5jdGlvbkRpcmVjdGl2ZUNvbmZpZyA9IChlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IGFueSkgPT4gdm9pZDtcblxuZXhwb3J0IHR5cGUgRGlyZWN0aXZlQ29uZmlnID0gT2JqZWN0RGlyZWN0aXZlQ29uZmlnIHwgRnVuY3Rpb25EaXJlY3RpdmVDb25maWc7XG5cbmNsYXNzIERpcmVjdGl2ZSB7XG4gIHByaXZhdGUgY29uZmlnOiBPYmplY3REaXJlY3RpdmVDb25maWc7XG4gICRlbDogSFRNTEVsZW1lbnQ7XG4gICRvd25lcjogSU93bmVyO1xuICAkc2NvcGVkOiBib29sZWFuO1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG4gIGNvbnN0cnVjdG9yKFxuICAgIG93bmVyOiBJT3duZXIsXG4gICAgZWw6IEhUTUxFbGVtZW50LFxuICAgIHBhdGg6IHN0cmluZyxcbiAgICBjb25maWc6IERpcmVjdGl2ZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLiRlbCA9IGVsO1xuICAgIHRoaXMuJG93bmVyID0gb3duZXI7XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgIGJpbmQ6IGNvbmZpZyxcbiAgICAgICAgdXBkYXRlOiBjb25maWcsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG5cbiAgICB0aGlzLiRvd25lci4kd2F0Y2hlci5hZGRMaXN0ZW5lcihwYXRoLCB2YWwgPT4ge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLnVwZGF0ZSkge1xuICAgICAgICB0aGlzLmNvbmZpZy51cGRhdGUuY2FsbCh0aGlzLCBlbCwgeyB2YWx1ZTogdmFsLCBleHByZXNzaW9uOiBwYXRoIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5jb25maWcuYmluZC5jYWxsKHRoaXMsIGVsLCB7XG4gICAgICB2YWx1ZTogdGhpcy4kb3duZXIuZ2V0VmFsdWUocGF0aCksXG4gICAgICBleHByZXNzaW9uOiBwYXRoLFxuICAgIH0pO1xuXG4gICAgdGhpcy4kc2NvcGVkID0gdGhpcy5jb25maWcuc2NvcGVkIHx8IGZhbHNlO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jb25maWcudW5iaW5kKSB7XG4gICAgICB0aGlzLmNvbmZpZy51bmJpbmQuY2FsbCh0aGlzLCB0aGlzLiRlbCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkaXJlY3RpdmVDb25maWdNYXAgPSBuZXcgTWFwPHN0cmluZywgRGlyZWN0aXZlQ29uZmlnPigpO1xuXG5leHBvcnQgY29uc3QgRElSRUNUSVZFX1BSRUZJWCA9ICd4LSc7XG5cbmV4cG9ydCBkZWZhdWx0IERpcmVjdGl2ZTtcbiIsImltcG9ydCBXYXRjaGVyIGZyb20gJy4vV2F0Y2hlcic7XG5pbXBvcnQgeyBzZXRWYWx1ZSwgZ2V0VmFsdWUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IERpcmVjdGl2ZUNvbmZpZywgZGlyZWN0aXZlQ29uZmlnTWFwIH0gZnJvbSAnLi9EaXJlY3RpdmUnO1xuaW1wb3J0IENvbXBpbGVyIGZyb20gJy4vQ29tcGxpZXInO1xuaW1wb3J0IElPd25lciBmcm9tICcuL0lPd25lcic7XG5pbXBvcnQgQ2hpbGRTY29wZSBmcm9tICcuL0NoaWxkU2NvcGUnO1xuXG5pbnRlcmZhY2UgTVZWTUNvbmZpZyB7XG4gIGVsOiBIVE1MRWxlbWVudDtcbiAgZGF0YTogYW55O1xuICBjcmVhdGVkPzogKCkgPT4gdm9pZDtcbiAgZGVzdHJveT86ICgpID0+IHZvaWQ7XG4gIGNvbXB1dGVkOiBhbnk7XG4gIG1ldGhvZHM6IGFueTtcbn1cblxuY2xhc3MgTVZWTSBpbXBsZW1lbnRzIElPd25lciB7XG4gIHN0YXRpYyBkaXJlY3RpdmUgPSBmdW5jdGlvbihuYW1lOiBzdHJpbmcsIGNvbmZpZzogRGlyZWN0aXZlQ29uZmlnKSB7XG4gICAgZGlyZWN0aXZlQ29uZmlnTWFwLnNldChuYW1lLCBjb25maWcpO1xuICB9O1xuXG4gICRlbDogSFRNTEVsZW1lbnQ7XG4gICR3YXRjaGVyOiBXYXRjaGVyO1xuICAkY29tcGxpZXI6IENvbXBpbGVyO1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG5cbiAgcHJpdmF0ZSBjb25maWc6IE1WVk1Db25maWc7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTVZWTUNvbmZpZykge1xuICAgIHRoaXMuJGVsID0gY29uZmlnLmVsO1xuICAgIHRoaXMuJHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih0aGlzLCBjb25maWcuZGF0YSk7XG4gICAgdGhpcy4kY29tcGxpZXIgPSBuZXcgQ29tcGlsZXIodGhpcyk7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICB0aGlzLmluaXRMaWZlQ3ljbGVzKCk7XG4gICAgdGhpcy5pbml0TWV0aG9kcygpO1xuICAgIHRoaXMuJGNvbXBsaWVyLmluaXQoKTtcbiAgICB0aGlzLmluaXRDb21wdXRlZCgpO1xuICAgIHRoaXMuY3JlYXRlZCh0aGlzKTtcbiAgfVxuXG4gIHNldERhdGEobmV3RGF0YTogYW55KSB7XG4gICAgaWYgKCFuZXdEYXRhKSByZXR1cm47XG4gICAgT2JqZWN0LmtleXMobmV3RGF0YSkuZm9yRWFjaChrID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXNba10gPSBuZXdEYXRhW2tdO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VmFsdWUocGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGdldFZhbHVlKHRoaXMsIHBhdGgpO1xuICB9XG5cbiAgZ2V0RXZlbnQobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXNbbmFtZV07XG4gIH1cblxuICBwcml2YXRlIGluaXRMaWZlQ3ljbGVzKCkge1xuICAgIHRoaXNbJ2NyZWF0ZWQnXSA9ICgpID0+IHtcbiAgICAgIHRoaXMuY29uZmlnLmNyZWF0ZWQgJiYgdGhpcy5jb25maWcuY3JlYXRlZC5jYWxsKHRoaXMpO1xuICAgIH07XG5cbiAgICB0aGlzWydkZXN0cm95J10gPSAoKSA9PiB7XG4gICAgICB0aGlzLiRjb21wbGllci5kZXN0cm95KCk7XG4gICAgICB0aGlzLiR3YXRjaGVyLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgICAgdGhpcy5jb25maWcuZGVzdHJveSAmJiB0aGlzLmNvbmZpZy5kZXN0cm95LmNhbGwodGhpcyk7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdENvbXB1dGVkKCkge1xuICAgIGNvbnN0IGNvbXB1dGVkID0gdGhpcy5jb25maWcuY29tcHV0ZWQgfHwge307XG5cbiAgICBjb25zdCBjb21wdXRlZEtleXMgPSBPYmplY3Qua2V5cyhjb21wdXRlZCk7XG4gICAgdGhpcy4kd2F0Y2hlci5hZGRMaXN0ZW5lcignJywgKG4sIG8sIGtleSkgPT4ge1xuICAgICAgaWYgKGNvbXB1dGVkS2V5cy5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb21wdXRlZEtleXMuZm9yRWFjaChja2V5ID0+IHtcbiAgICAgICAgdGhpc1tja2V5XSA9IGNvbXB1dGVkW2NrZXldLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuJHdhdGNoZXIudHJpZ2dlcihja2V5LCB0aGlzW2NrZXldLCAnJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb21wdXRlZEtleXMuZm9yRWFjaChja2V5ID0+IHtcbiAgICAgIHRoaXNbY2tleV0gPSBjb21wdXRlZFtja2V5XS5jYWxsKHRoaXMpO1xuICAgICAgdGhpcy4kd2F0Y2hlci50cmlnZ2VyKGNrZXksIHRoaXNbY2tleV0sICcnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdE1ldGhvZHMoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5jb25maWcubWV0aG9kcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpc1trZXldID0gdGhpcy5jb25maWcubWV0aG9kc1trZXldLmJpbmQodGhpcyk7XG4gICAgfSk7XG4gIH1cbn1cblxuLy8g5YaF572u5oyH5LukXG5NVlZNLmRpcmVjdGl2ZSgnbW9kZWwnLCB7XG4gIGJpbmQoZWw6IGFueSwgYmluZGluZykge1xuICAgIHRoaXMuY2FsbGJhY2sgPSAoZTogYW55KSA9PiB7XG4gICAgICBjb25zdCB2YWwgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgIHNldFZhbHVlKHRoaXMuJG93bmVyLCBiaW5kaW5nLmV4cHJlc3Npb24sIHZhbCk7XG4gICAgfTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuY2FsbGJhY2spO1xuICAgIGVsLnZhbHVlID0gYmluZGluZy52YWx1ZTtcbiAgfSxcbiAgdXBkYXRlKGVsOiBhbnksIGJpbmRpbmcpIHtcbiAgICBpZiAoZWwudmFsdWUgPT09IGJpbmRpbmcudmFsdWUpIHJldHVybjtcbiAgICBlbC52YWx1ZSA9IGJpbmRpbmcudmFsdWU7XG4gIH0sXG4gIHVuYmluZChlbCkge1xuICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5jYWxsYmFjayk7XG4gIH0sXG59KTtcblxuTVZWTS5kaXJlY3RpdmUoJ3Nob3cnLCAoZWwsIGJpbmRpbmcpID0+IHtcbiAgZWwuc3R5bGUuZGlzcGxheSA9IGJpbmRpbmcudmFsdWUgPyAnJyA6ICdub25lJztcbn0pO1xuXG5NVlZNLmRpcmVjdGl2ZSgnaWYnLCB7XG4gIHNjb3BlZDogdHJ1ZSxcbiAgYmluZChlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmcpIHtcbiAgICBjb25zdCBodG1sID0gZWwub3V0ZXJIVE1MO1xuXG4gICAgY29uc3QgbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbkVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgdGhpcy5lbCA9IG5FbC5maXJzdENoaWxkO1xuICAgIHRoaXMuY0VsID0gZG9jdW1lbnQuY3JlYXRlQ29tbWVudCgnLS0gaWYgYmxvY2sgLS0nKTtcbiAgICBlbC5yZXBsYWNlV2l0aCh0aGlzLmVsKTtcblxuICAgIHRoaXMuY2hpbGRTY29wZSA9IG5ldyBDaGlsZFNjb3BlKHRoaXMuZWwsIHRoaXMuJG93bmVyKTtcblxuICAgIHRoaXMub25IaWRlID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmNoaWxkU2NvcGUuZGVzdHJveSgpO1xuICAgICAgdGhpcy5lbC5yZXBsYWNlV2l0aCh0aGlzLmNFbCk7XG4gICAgfTtcblxuICAgIHRoaXMub25TaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmNFbC5yZXBsYWNlV2l0aCh0aGlzLmVsKTtcbiAgICB9O1xuXG4gICAgaWYgKGJpbmRpbmcudmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLm9uSGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcbiAgdXBkYXRlKGVsOiBhbnksIGJpbmRpbmcpIHtcbiAgICBpZiAoYmluZGluZy52YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IE1WVk07XG4iLCJpbXBvcnQgeyBnZXRWYWx1ZSwgaXNQbGFpbk9iamVjdCwgbWVyZ2VEZXNjcmlwdG9yIH0gZnJvbSAnLi91dGlscyc7XG5cbnR5cGUgQ2FsbGJhY2sgPSAodmFsOiBhbnksIG9sZFZhbHVlOiBhbnkpID0+IHZvaWQ7XG50eXBlIENhbGxiYWNrV2l0aFBhdGggPSAodmFsOiBhbnksIG9sZFZhbHVlOiBhbnksIHBhdGg6IHN0cmluZykgPT4gdm9pZDtcblxuY2xhc3MgVG9rZW4ge1xuICBwcml2YXRlIHZhbHVlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiB7IG9iajogYW55OyBrZXk6IHN0cmluZzsgdmFsdWU6IGFueTsgY2I6IENhbGxiYWNrIH0pIHtcbiAgICBjb25zdCBzY29wZSA9IHRoaXM7XG4gICAgY29uc3QgeyBrZXksIHZhbHVlLCBvYmosIGNiIH0gPSBjb25maWc7XG5cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlU2V0dGVyKCkge1xuICAgICAgICByZXR1cm4gc2NvcGUudmFsdWU7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiByZWFjdGl2ZUdldHRlcih2YWx1ZSkge1xuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHNjb3BlLnZhbHVlO1xuICAgICAgICBzY29wZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBpZiAob2xkVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgY2IodmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBHTE9BQkxfS0VZID0gJ0dMT0FCTCc7XG5cbmNsYXNzIFdhdGNoZXIge1xuICBvd25lcjogYW55O1xuICBsaXN0ZW5lcnM6IHtcbiAgICBbcGF0aDogc3RyaW5nXTogQ2FsbGJhY2tXaXRoUGF0aFtdO1xuICB9ID0ge307XG4gIGNvbnN0cnVjdG9yKG93bmVyOiBhbnksIGRhdGE6IGFueSkge1xuICAgIG1lcmdlRGVzY3JpcHRvcihvd25lciwgdGhpcy50cmF2ZXJzZURhdGEoZGF0YSkpO1xuICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgfVxuXG4gIHRyYXZlcnNlRGF0YShkYXRhOiBhbnksIHBhdGggPSAnJykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoID0gKHBhdGggPyBwYXRoICsgJy4nIDogJycpICsga2V5O1xuXG4gICAgICBuZXcgVG9rZW4oe1xuICAgICAgICBvYmo6IHJlc3VsdCxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogaXNQbGFpbk9iamVjdChkYXRhW2tleV0pXG4gICAgICAgICAgPyB0aGlzLnRyYXZlcnNlRGF0YShkYXRhW2tleV0sIGZ1bGxQYXRoKVxuICAgICAgICAgIDogZGF0YVtrZXldLFxuICAgICAgICBjYjogKG5ld1ZhbCwgb2xkVmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlKGZ1bGxQYXRoLCBuZXdWYWwsIG9sZFZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBoYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aDogc3RyaW5nLCBuZXdWYWx1ZTogYW55LCBvbGRWYWx1ZTogYW55KSB7XG4gICAgbGV0IHBhcmVudCA9IHRoaXMub3duZXI7XG4gICAgY29uc3QgcGF0aEFyciA9IGZ1bGxQYXRoLnNwbGl0KCcuJyk7XG4gICAgaWYgKHBhdGhBcnIubGVuZ3RoID49IDIpIHtcbiAgICAgIHBhcmVudCA9IG5ldyBGdW5jdGlvbihcbiAgICAgICAgJ2RhdGEnLFxuICAgICAgICBgcmV0dXJuIGRhdGEuJHtwYXRoQXJyLnNsaWNlKDAsIHBhdGhBcnIubGVuZ3RoIC0gMSkuam9pbignLicpfWBcbiAgICAgICkodGhpcy5vd25lcik7XG4gICAgfVxuXG4gICAgY29uc3Qga2V5OiBzdHJpbmcgPSBwYXRoQXJyLnBvcCgpITtcblxuICAgIGlmIChpc1BsYWluT2JqZWN0KG5ld1ZhbHVlKSkge1xuICAgICAgbmV3IFRva2VuKHtcbiAgICAgICAgb2JqOiBwYXJlbnQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IHRoaXMudHJhdmVyc2VEYXRhKG5ld1ZhbHVlLCBmdWxsUGF0aCksXG4gICAgICAgIGNiOiAoX25ld1ZhbHVlLCBfb2xkVmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlKGZ1bGxQYXRoLCBfbmV3VmFsdWUsIF9vbGRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoZnVsbFBhdGgsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcihwYXRoOiBzdHJpbmcsIGNiOiBDYWxsYmFja1dpdGhQYXRoKSB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gR0xPQUJMX0tFWTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubGlzdGVuZXJzW3BhdGhdKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyc1twYXRoXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdLnB1c2goY2IpO1xuICB9XG5cbiAgcmVtb3ZlTGlzdGVuZXIocGF0aDogc3RyaW5nLCBjYj86IENhbGxiYWNrV2l0aFBhdGgpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghY2IpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmxpc3RlbmVyc1twYXRoXTtcbiAgICB9IGVsc2Uge1xuICAgICAgKHRoaXMubGlzdGVuZXJzW3BhdGhdIHx8IFtdKS5maWx0ZXIoaXRlbSA9PiBpdGVtID09PSBjYik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzKCkge1xuICAgIHRoaXMubGlzdGVuZXJzID0ge307XG4gIH1cblxuICB0cmlnZ2VyKHBhdGg6IHN0cmluZywgbmV3VmFsdWU6IGFueSwgb2xkVmFsdWU6IGFueSkge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IEdMT0FCTF9LRVk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmxpc3RlbmVyc1twYXRoXSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyc1twYXRoXS5mb3JFYWNoKGNiID0+IGNiKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgcGF0aCkpO1xuXG4gICAgLy8g5pS55Y+Y5LqG5a+56LGh77yM6YKj5LmI5a2Q57qn5Lmf5bqU6K+l5pS25Yiw6YCa55+lXG4gICAgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChrZXkgIT09IHBhdGggJiYga2V5LnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgY29uc3QgayA9IGtleS5yZXBsYWNlKHBhdGggKyAnLicsICcnKTtcbiAgICAgICAgY29uc3Qgb2xkViA9IGdldFZhbHVlKG9sZFZhbHVlLCBrKTtcbiAgICAgICAgY29uc3QgbmV3ViA9IGdldFZhbHVlKG5ld1ZhbHVlLCBrKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNba2V5XS5mb3JFYWNoKGNiID0+IGNiKG5ld1YsIG9sZFYsIGtleSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgKHRoaXMubGlzdGVuZXJzW0dMT0FCTF9LRVldIHx8IFtdKS5mb3JFYWNoKGNiID0+XG4gICAgICBjYihuZXdWYWx1ZSwgb2xkVmFsdWUsIHBhdGgpXG4gICAgKTtcbiAgfVxufVxuXG4vLyBjb25zdCBvd25lcjogYW55ID0ge307XG5cbi8vIGNvbnN0IHdhdGNoZXIgPSBuZXcgV2F0Y2hlcihvd25lciwge1xuLy8gICBhOiAxMCxcbi8vICAgYjoge1xuLy8gICAgIGM6IDEyLFxuLy8gICB9LFxuLy8gfSk7XG5cbi8vIHdhdGNoZXIuYWRkTGlzdGVuZXIoJ2InLCAocDEsIHAyKSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKCdiIGNoYW5nZWQnLCBwMSwgcDIpO1xuLy8gfSk7XG5cbi8vIHdhdGNoZXIuYWRkTGlzdGVuZXIoJ2IuYycsIChwMSwgcDIpID0+IHtcbi8vICAgY29uc29sZS5sb2coJ2IuYyBjaGFuZ2VkJywgcDEsIHAyKTtcbi8vIH0pO1xuXG4vLyBvd25lci5iID0geyBjOiAxNSB9O1xuLy8gb3duZXIuYi5jID0gJ3dhaGFoYWhhJztcblxuZXhwb3J0IGRlZmF1bHQgV2F0Y2hlcjtcbiIsImltcG9ydCBNVlZNIGZyb20gJy4vTVZWTSc7XG5cbmNvbnN0IGluaXRpYWxEYXRhID0gKCkgPT4gKHtcbiAgbmFtZTogJ0pvaG4nLFxuICBhZ2U6IDEwLFxuICBnZW5kZXI6IDEsXG4gIHN1Ym1pdGluZzogZmFsc2UsXG4gIGN1cnJlbnRUaW1lOiBuZXcgRGF0ZSgpLFxuICBleHRyYToge1xuICAgIGxpa2U6ICdnYW1lJyxcbiAgfSxcbiAgc2hvd0luZm86IHRydWUsXG4gIGxpc3Q6IFt7IG5hbWU6ICd5cXonIH0sIHsgbmFtZTogJ3NoZW5qaW5nd2VpJyB9XSxcbn0pO1xuXG5uZXcgTVZWTSh7XG4gIGVsOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykhLFxuICBkYXRhOiBpbml0aWFsRGF0YSgpLFxuICBjcmVhdGVkKHRoaXM6IGFueSkge1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICB0aGlzLmN1cnJlbnRUaW1lID0gbmV3IERhdGUoKTtcbiAgICB9LCAxMDAwKTtcbiAgfSxcbiAgZGVzdHJveSh0aGlzOiBhbnkpIHtcbiAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICB9LFxuICBjb21wdXRlZDoge1xuICAgIGdlbmRlclRleHQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZW5kZXIgPT0gMSA/ICfnlLcnIDogJ+Wlsyc7XG4gICAgfSxcbiAgICBjdXJyZW50VGltZVN0cigpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lLnRvTG9jYWxlU3RyaW5nKCk7XG4gICAgfSxcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGNoYW5nZUdlbmRlcigpIHtcbiAgICAgIHRoaXMuZ2VuZGVyID0gdGhpcy5nZW5kZXIgPT0gMSA/IDAgOiAxO1xuICAgIH0sXG5cbiAgICB0b2dnbGVTaG93SW5mbygpIHtcbiAgICAgIHRoaXMuc2hvd0luZm8gPSAhdGhpcy5zaG93SW5mbztcbiAgICB9LFxuXG4gICAgcmVzZXQoKSB7XG4gICAgICBjb25zdCBuZXdEYXRhID0gaW5pdGlhbERhdGEoKTtcbiAgICAgIHRoaXMuc2V0RGF0YShuZXdEYXRhKTtcbiAgICB9LFxuXG4gICAgc3VibWl0KCkge1xuICAgICAgdGhpcy5zdWJtaXRpbmcgPSB0cnVlO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgYWxlcnQoJ+aPkOS6pOaIkOWKnycpO1xuICAgICAgICB0aGlzLnN1Ym1pdGluZyA9IGZhbHNlO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBudWxsO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlKG9iajogYW55LCBwYXRoOiBzdHJpbmcsIGRlZmF1bHRWYWwgPSB1bmRlZmluZWQpIHtcbiAgbGV0IHZhbCA9IG9iajtcbiAgdHJ5IHtcbiAgICB2YWwgPSBuZXcgRnVuY3Rpb24oJ2RhdGEnLCBgcmV0dXJuIGRhdGEuJHtwYXRofWApKG9iaik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbDtcbiAgfVxuICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsIDogdmFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0VmFsdWUob2JqOiBhbnksIHBhdGg6IHN0cmluZywgdmFsOiBhbnkpIHtcbiAgdHJ5IHtcbiAgICBuZXcgRnVuY3Rpb24oJ2RhdGEnLCBgZGF0YS4ke3BhdGh9PSR7SlNPTi5zdHJpbmdpZnkodmFsKX1gKShvYmopO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iajogYW55KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmouY29uc3RydWN0b3IgPT09IE9iamVjdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRGVzY3JpcHRvcihhOiBhbnksIGI6IGFueSkge1xuICBmb3IgKGxldCBrZXkgaW4gYikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgIGEsXG4gICAgICBrZXksXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGIsIGtleSlcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUV4cHJlc3Npb24oXG4gIGV4cHJlc3Npb246IHN0cmluZyxcbiAgc2NvcGVOYW1lOiBzdHJpbmcgPSAndGhpcydcbikge1xuICBsZXQgaW5kZXggPSAwO1xuICBsZXQgbWF4ID0gZXhwcmVzc2lvbi5sZW5ndGg7XG4gIGxldCByZXN1bHQgPSAnJztcbiAgbGV0IGRlcGVuZGVuY2llczogc3RyaW5nW10gPSBbXTtcblxuICB3aGlsZSAoaW5kZXggPCBtYXgpIHtcbiAgICBsZXQgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KGluZGV4KTtcblxuICAgIGlmICgvJ3xcIi8udGVzdChjaGFyKSkge1xuICAgICAgY29uc3QgYyA9IGNoYXI7XG4gICAgICBsZXQgc3RyID0gXCInXCI7XG4gICAgICBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoKytpbmRleCk7XG4gICAgICB3aGlsZSAoY2hhciAhPT0gdW5kZWZpbmVkICYmIGNoYXIgIT09IGMpIHtcbiAgICAgICAgc3RyICs9IGNoYXI7XG4gICAgICAgIGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdCgrK2luZGV4KTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCArPSBzdHI7XG4gICAgICByZXN1bHQgKz0gXCInXCI7XG4gICAgICBpbmRleCsrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgbGV0IFZBUklBQkxFUyA9IC9bQS1aYS16X10vO1xuICAgIGlmIChWQVJJQUJMRVMudGVzdChjaGFyKSkge1xuICAgICAgbGV0IHZhbHVlID0gJyc7XG5cbiAgICAgIGxldCBwYXRoID0gJyc7XG4gICAgICBsZXQgcGF0aHM6IHN0cmluZ1tdID0gW107XG4gICAgICB3aGlsZSAoY2hhciAmJiAvW0EtWmEtel8wLTkuKCldLy50ZXN0KGNoYXIpKSB7XG4gICAgICAgIHZhbHVlICs9IGNoYXI7XG5cbiAgICAgICAgaWYgKGNoYXIgPT09ICcuJykge1xuICAgICAgICAgIHBhdGhzLnB1c2gocGF0aCk7XG4gICAgICAgICAgcGF0aCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBhdGggKz0gY2hhcjtcbiAgICAgICAgfVxuICAgICAgICBjaGFyID0gZXhwcmVzc2lvblsrK2luZGV4XTtcbiAgICAgIH1cblxuICAgICAgaWYgKC9eW0EtWmEtel8wLTldKyQvLnRlc3QocGF0aCkpIHtcbiAgICAgICAgcGF0aHMucHVzaChwYXRoKTtcbiAgICAgIH1cblxuICAgICAgZGVwZW5kZW5jaWVzLnB1c2gocGF0aHMuam9pbignLicpKTtcbiAgICAgIHJlc3VsdCArPSBzY29wZU5hbWUgKyAnLmdldFZhbHVlKFwiJyArIHZhbHVlICsgKGNoYXIgfHwgJycpICsgJ1wiKSc7XG4gICAgICBpbmRleCsrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzdWx0ICs9IGNoYXI7XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZXhwcmVzc2lvbjogcmVzdWx0LFxuICAgIGRlcGVuZGVuY2llcyxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUmVhbFZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIHZhbHVlO1xuXG4gIGlmICgvXlswLTldPyhcXC5bMC05XSspPyQvLnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSk7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAnbnVsbCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheTxUID0gYW55Pih2YWx1ZTogQXJyYXlMaWtlPFQ+KTogQXJyYXk8VD4ge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodmFsdWUpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==