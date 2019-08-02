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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NoaWxkU2NvcGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbXBsaWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9EaXJlY3RpdmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01WVk0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDakZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBZ0M7QUFDRTtBQUNDO0FBRXBCLE1BQU0sVUFBVTtJQVU3QixZQUFZLEVBQU8sRUFBRSxNQUFjO1FBSm5DLG9CQUFlLEdBQUcsQ0FBQyxDQUFNLEVBQUUsQ0FBTSxF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YSxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDbEUsS0FBSyxFQUFFLENBQUM7WUFDUixTQUFTO1NBQ1Y7UUFFRCxNQUFNLElBQUksSUFBSSxDQUFDO1FBQ2YsS0FBSyxFQUFFLENBQUM7S0FDVDtJQUVELE9BQU87UUFDTCxVQUFVLEVBQUUsTUFBTTtRQUNsQixZQUFZO0tBQ2IsQ0FBQztBQUNKLENBQUM7QUFFTSxTQUFTLFdBQVcsQ0FBQyxLQUFVO0lBQ3BDLElBQUksQ0FBQyxLQUFLO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFekIsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDckMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdEI7U0FBTSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7UUFDM0IsT0FBTyxJQUFJLENBQUM7S0FDYjtTQUFNLElBQUksS0FBSyxLQUFLLE9BQU8sRUFBRTtRQUM1QixPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU0sSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFO1FBQzNCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7U0FBTSxJQUFJLEtBQUssS0FBSyxXQUFXLEVBQUU7UUFDaEMsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFTSxTQUFTLE9BQU8sQ0FBVSxLQUFtQjtJQUNsRCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCBJT3duZXIgZnJvbSAnLi9JT3duZXInO1xuaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi9XYXRjaGVyJztcbmltcG9ydCBDb21waWxlciBmcm9tICcuL0NvbXBsaWVyJztcbmltcG9ydCB7IGdldFZhbHVlIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoaWxkU2NvcGUgaW1wbGVtZW50cyBJT3duZXIge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG4gICRwYXJlbnQ6IElPd25lcjtcbiAgJHdhdGNoZXI6IFdhdGNoZXI7XG4gICRlbDogYW55O1xuICAkY29tcGxpZXI6IENvbXBpbGVyO1xuICAkcGFyZW50TGlzdGVuZXIgPSAobjogYW55LCBvOiBhbnksIHA6IHN0cmluZykgPT4ge1xuICAgIHRoaXMuJHdhdGNoZXIudHJpZ2dlcihwLCBuLCBvKTtcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihlbDogYW55LCBwYXJlbnQ6IElPd25lcikge1xuICAgIHRoaXMuJHBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLiRlbCA9IGVsO1xuICAgIHRoaXMuJHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih0aGlzLCB7fSk7XG4gICAgdGhpcy4kY29tcGxpZXIgPSBuZXcgQ29tcGlsZXIodGhpcyk7XG4gICAgdGhpcy4kY29tcGxpZXIuaW5pdCgpO1xuXG4gICAgdGhpcy4kcGFyZW50LiR3YXRjaGVyLmFkZExpc3RlbmVyKCcnLCB0aGlzLiRwYXJlbnRMaXN0ZW5lcik7XG4gIH1cblxuICBnZXRWYWx1ZShwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCB2YWwgPSBnZXRWYWx1ZSh0aGlzLCBwYXRoKTtcblxuICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHBhcmVudC5nZXRWYWx1ZShwYXRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgc2V0RGF0YShuZXdEYXRhOiBhbnkpIHtcbiAgICB0aGlzLiRwYXJlbnQuc2V0RGF0YShuZXdEYXRhKTtcbiAgfVxuXG4gIGdldEV2ZW50KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLiRwYXJlbnQuZ2V0RXZlbnQobmFtZSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuJGNvbXBsaWVyLmRlc3Ryb3koKTtcbiAgICB0aGlzLiR3YXRjaGVyLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgIHRoaXMuJHBhcmVudC4kd2F0Y2hlci5yZW1vdmVMaXN0ZW5lcignJywgdGhpcy4kcGFyZW50TGlzdGVuZXIpO1xuICB9XG59XG4iLCJpbXBvcnQgRGlyZWN0aXZlLCB7IGRpcmVjdGl2ZUNvbmZpZ01hcCwgRElSRUNUSVZFX1BSRUZJWCB9IGZyb20gJy4vRGlyZWN0aXZlJztcbmltcG9ydCB7IHBhcnNlRXhwcmVzc2lvbiwgdG9SZWFsVmFsdWUsIHRvQXJyYXkgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBJT3duZXIgZnJvbSAnLi9JT3duZXInO1xuXG5jbGFzcyBDb21waWxlciB7XG4gIG93bmVyOiBJT3duZXI7XG4gIGRpcmVjdGl2ZXM6IERpcmVjdGl2ZVtdID0gW107XG5cbiAgY29uc3RydWN0b3Iob3duZXI6IGFueSkge1xuICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy50cmF2ZXJzRUwodGhpcy5vd25lci4kZWwpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRpcmVjdGl2ZXMuZm9yRWFjaChkID0+IGQuZGVzdHJveSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgdHJhdmVyc0VMKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLnRyYXZlcnNBdHRyKGVsKSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IGVsLmNoaWxkTm9kZXNbaV07XG5cbiAgICAgIC8vIHRleHRcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIGxldCBub2RlVmFsdWUgPSBub2RlLm5vZGVWYWx1ZSE7XG5cbiAgICAgICAgbGV0IHNldE5vZGVWYWx1ZSA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIGNocm9tZSDkuI3kvJrop6blj5Hph43nu5hcbiAgICAgICAgICAvLyBpZiAobm9kZS5ub2RlVmFsdWUgIT09IHZhbCkge1xuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gdmFsO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQobm9kZVZhbHVlLCBzZXROb2RlVmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIHRoaXMudHJhdmVyc0VMKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhdmVyc0F0dHIobm9kZTogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdG9BcnJheShub2RlLmF0dHJpYnV0ZXMpO1xuXG4gICAgbGV0IHNjb3BlZEF0dHI6IGFueTtcblxuICAgIGF0dHJpYnV0ZXMuc29tZShpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGRpcmVjdGl2ZUNvbmZpZ01hcC5nZXQoaXRlbS5uYW1lKTtcblxuICAgICAgLy8gaWbnmoTkvJjlhYjnuqfmmK/mnIDpq5jnmoRcbiAgICAgIGlmIChpdGVtLm5hbWUgPT09IERJUkVDVElWRV9QUkVGSVggKyAnaWYnKSB7XG4gICAgICAgIHNjb3BlZEF0dHIgPSBpdGVtO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNjb3BlZEF0dHIgJiYgdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgJiYgY29uZmlnLnNjb3BlZCkge1xuICAgICAgICBzY29wZWRBdHRyID0gaXRlbTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChzY29wZWRBdHRyKSB7XG4gICAgICBjb25zdCBkaXJlY3RpdmUgPSB0aGlzLmluaXREaXJlY3RpdmUobm9kZSwgc2NvcGVkQXR0cik7XG5cbiAgICAgIGlmIChkaXJlY3RpdmUgJiYgZGlyZWN0aXZlLiRzY29wZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgIGlmICghYXR0cikgcmV0dXJuO1xuXG4gICAgICBpZiAoYXR0ci5uYW1lLnN0YXJ0c1dpdGgoRElSRUNUSVZFX1BSRUZJWCkpIHtcbiAgICAgICAgdGhpcy5pbml0RGlyZWN0aXZlKG5vZGUsIGF0dHIpO1xuICAgICAgfSBlbHNlIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aCgnOicpKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgICAgIGNvbnN0IGF0dHJOYW1lID0gYXR0ci5uYW1lLnN1YnN0cigxKTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQoJ3t7JyArIGF0dHIudmFsdWUgKyAnfX0nLCAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgbm9kZVthdHRyTmFtZV0gPSB0b1JlYWxWYWx1ZSh2YWwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGVsc2UgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYXR0ci5uYW1lLnN1YnN0cigxKTtcbiAgICAgICAgY29uc3QgZXZlbnRGdW5jTmFtZSA9IGF0dHIudmFsdWU7XG4gICAgICAgIGNvbnN0IGNiID0gdGhpcy5vd25lci5nZXRFdmVudChldmVudEZ1bmNOYW1lKTtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2IpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2IgPSAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIHZhbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wYXJzZVRlbXBsYXRlQW5kU2V0KGF0dHIudmFsdWUsIGNiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0RGlyZWN0aXZlKG5vZGU6IGFueSwgYXR0cjogQXR0cikge1xuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgY29uc3QgZGlyZWN0aXZlTmFtZSA9IGF0dHIubmFtZS5yZXBsYWNlKFxuICAgICAgbmV3IFJlZ0V4cCgnXicgKyBESVJFQ1RJVkVfUFJFRklYKSxcbiAgICAgICcnXG4gICAgKTtcbiAgICBjb25zdCBkZCA9IGRpcmVjdGl2ZUNvbmZpZ01hcC5nZXQoZGlyZWN0aXZlTmFtZSk7XG5cbiAgICBpZiAoIWRkKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+acquefpeeahOaMh+S7pO+8micsIGRpcmVjdGl2ZU5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkaXJlY3RpdmUgPSBuZXcgRGlyZWN0aXZlKHRoaXMub3duZXIsIG5vZGUsIGF0dHIudmFsdWUsIGRkKTtcbiAgICAgIHRoaXMuZGlyZWN0aXZlcy5wdXNoKGRpcmVjdGl2ZSk7XG5cbiAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZVRlbXBsYXRlQW5kU2V0KFxuICAgIHRlbXBsYXRlOiBzdHJpbmcsXG4gICAgc2V0Tm9kZVZhbHVlOiAodmFsOiBzdHJpbmcpID0+IHZvaWQsXG4gICAgZm9ybU5vZGU/OiBhbnlcbiAgKSB7XG4gICAgY29uc3QgdmFsdWVSZWdleHAgPSAve3soW159XSspfX0vZztcblxuICAgIGxldCByZXN1bHQgPSB2YWx1ZVJlZ2V4cC5leGVjKHRlbXBsYXRlKTtcbiAgICBsZXQgYWxsU2NvcGVLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBjYWxDb250ZXh0czogQXJyYXk8e1xuICAgICAgc3RhcnRJbmRleDogbnVtYmVyO1xuICAgICAgZW5kSW5kZXg6IG51bWJlcjtcbiAgICAgIGNhbDogKCkgPT4gc3RyaW5nO1xuICAgIH0+ID0gW107XG5cbiAgICB3aGlsZSAocmVzdWx0KSB7XG4gICAgICBjb25zdCB7IGluZGV4IH0gPSByZXN1bHQ7XG4gICAgICBsZXQgdHBsID0gcmVzdWx0WzFdO1xuICAgICAgbGV0IGZ1bGxUcGwgPSByZXN1bHRbMF07XG5cbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlRXhwcmVzc2lvbih0cGwsICd0aGlzLm93bmVyJyk7XG4gICAgICBsZXQgc2NvcGVLZXlzID0gcGFyc2VkLmRlcGVuZGVuY2llcztcblxuICAgICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgcGFyc2VkLmV4cHJlc3Npb24pLmJpbmQodGhpcyk7XG5cbiAgICAgIGFsbFNjb3BlS2V5cyA9IFsuLi5hbGxTY29wZUtleXMsIC4uLnNjb3BlS2V5c107XG4gICAgICBjYWxDb250ZXh0cyA9IFtcbiAgICAgICAgLi4uY2FsQ29udGV4dHMsXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFydEluZGV4OiBpbmRleCxcbiAgICAgICAgICBlbmRJbmRleDogaW5kZXggKyBmdWxsVHBsLmxlbmd0aCxcbiAgICAgICAgICBjYWw6ICgpID0+IGZuLmFwcGx5KHRoaXMpLFxuICAgICAgICB9LFxuICAgICAgXTtcblxuICAgICAgcmVzdWx0ID0gdmFsdWVSZWdleHAuZXhlYyh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FsVmFsdWUgPSAoKSA9PiB7XG4gICAgICBsZXQgbGFzdGVuZCA9IDA7XG4gICAgICBsZXQgdmFsdWUgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gY2FsQ29udGV4dHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKGxhc3RlbmQsIGNhbENvbnRleHRzW2ldLnN0YXJ0SW5kZXgpO1xuICAgICAgICB2YWx1ZSArPSBjYWxDb250ZXh0c1tpXS5jYWwoKTtcbiAgICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UoXG4gICAgICAgICAgY2FsQ29udGV4dHNbaV0uZW5kSW5kZXgsXG4gICAgICAgICAgaSA8IGwgLSAxID8gY2FsQ29udGV4dHNbaSArIDFdLnN0YXJ0SW5kZXggOiB1bmRlZmluZWRcbiAgICAgICAgKTtcbiAgICAgICAgbGFzdGVuZCA9IGNhbENvbnRleHRzW2ldLmVuZEluZGV4O1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShcbiAgICAgICAgbGFzdGVuZCxcbiAgICAgICAgY2FsQ29udGV4dHNbY2FsQ29udGV4dHMubGVuZ3RoIC0gMV0uc3RhcnRJbmRleFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBhbGxTY29wZUtleXMuZm9yRWFjaChrID0+IHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBzZXROb2RlVmFsdWUoY2FsVmFsdWUoKSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5vd25lci4kd2F0Y2hlci5hZGRMaXN0ZW5lcihrLCBsaXN0ZW5lcik7XG4gICAgICBsaXN0ZW5lcigpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBpbGVyO1xuIiwiaW1wb3J0IElPd25lciBmcm9tICcuL0lPd25lcic7XG5cbnR5cGUgT2JqZWN0RGlyZWN0aXZlQ29uZmlnID0ge1xuICBzY29wZWQ/OiBib29sZWFuO1xuICBiaW5kKHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpOiB2b2lkO1xuICB1cGRhdGU/KHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpOiB2b2lkO1xuICB1bmJpbmQ/KHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50KTogdm9pZDtcbn07XG5cbnR5cGUgRnVuY3Rpb25EaXJlY3RpdmVDb25maWcgPSAoZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIERpcmVjdGl2ZUNvbmZpZyA9IE9iamVjdERpcmVjdGl2ZUNvbmZpZyB8IEZ1bmN0aW9uRGlyZWN0aXZlQ29uZmlnO1xuXG5jbGFzcyBEaXJlY3RpdmUge1xuICBwcml2YXRlIGNvbmZpZzogT2JqZWN0RGlyZWN0aXZlQ29uZmlnO1xuICAkZWw6IEhUTUxFbGVtZW50O1xuICAkb3duZXI6IElPd25lcjtcbiAgJHNjb3BlZDogYm9vbGVhbjtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICBjb25zdHJ1Y3RvcihcbiAgICBvd25lcjogSU93bmVyLFxuICAgIGVsOiBIVE1MRWxlbWVudCxcbiAgICBwYXRoOiBzdHJpbmcsXG4gICAgY29uZmlnOiBEaXJlY3RpdmVDb25maWdcbiAgKSB7XG4gICAgdGhpcy4kZWwgPSBlbDtcbiAgICB0aGlzLiRvd25lciA9IG93bmVyO1xuXG4gICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgICBiaW5kOiBjb25maWcsXG4gICAgICAgIHVwZGF0ZTogY29uZmlnLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgdGhpcy4kb3duZXIuJHdhdGNoZXIuYWRkTGlzdGVuZXIocGF0aCwgdmFsID0+IHtcbiAgICAgIGlmICh0aGlzLmNvbmZpZy51cGRhdGUpIHtcbiAgICAgICAgdGhpcy5jb25maWcudXBkYXRlLmNhbGwodGhpcywgZWwsIHsgdmFsdWU6IHZhbCwgZXhwcmVzc2lvbjogcGF0aCB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY29uZmlnLmJpbmQuY2FsbCh0aGlzLCBlbCwge1xuICAgICAgdmFsdWU6IHRoaXMuJG93bmVyLmdldFZhbHVlKHBhdGgpLFxuICAgICAgZXhwcmVzc2lvbjogcGF0aCxcbiAgICB9KTtcblxuICAgIHRoaXMuJHNjb3BlZCA9IHRoaXMuY29uZmlnLnNjb3BlZCB8fCBmYWxzZTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnVuYmluZCkge1xuICAgICAgdGhpcy5jb25maWcudW5iaW5kLmNhbGwodGhpcywgdGhpcy4kZWwpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZGlyZWN0aXZlQ29uZmlnTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpcmVjdGl2ZUNvbmZpZz4oKTtcblxuZXhwb3J0IGNvbnN0IERJUkVDVElWRV9QUkVGSVggPSAneC0nO1xuXG5leHBvcnQgZGVmYXVsdCBEaXJlY3RpdmU7XG4iLCJpbXBvcnQgV2F0Y2hlciBmcm9tICcuL1dhdGNoZXInO1xuaW1wb3J0IHsgc2V0VmFsdWUsIGdldFZhbHVlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBEaXJlY3RpdmVDb25maWcsIGRpcmVjdGl2ZUNvbmZpZ01hcCB9IGZyb20gJy4vRGlyZWN0aXZlJztcbmltcG9ydCBDb21waWxlciBmcm9tICcuL0NvbXBsaWVyJztcbmltcG9ydCBJT3duZXIgZnJvbSAnLi9JT3duZXInO1xuaW1wb3J0IENoaWxkU2NvcGUgZnJvbSAnLi9DaGlsZFNjb3BlJztcblxuaW50ZXJmYWNlIE1WVk1Db25maWcge1xuICBlbDogSFRNTEVsZW1lbnQ7XG4gIGRhdGE6IGFueTtcbiAgY3JlYXRlZD86ICgpID0+IHZvaWQ7XG4gIGRlc3Ryb3k/OiAoKSA9PiB2b2lkO1xuICBjb21wdXRlZDogYW55O1xuICBtZXRob2RzOiBhbnk7XG59XG5cbmNsYXNzIE1WVk0gaW1wbGVtZW50cyBJT3duZXIge1xuICBzdGF0aWMgZGlyZWN0aXZlID0gZnVuY3Rpb24obmFtZTogc3RyaW5nLCBjb25maWc6IERpcmVjdGl2ZUNvbmZpZykge1xuICAgIGRpcmVjdGl2ZUNvbmZpZ01hcC5zZXQobmFtZSwgY29uZmlnKTtcbiAgfTtcblxuICAkZWw6IEhUTUxFbGVtZW50O1xuICAkd2F0Y2hlcjogV2F0Y2hlcjtcbiAgJGNvbXBsaWVyOiBDb21waWxlcjtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuXG4gIHByaXZhdGUgY29uZmlnOiBNVlZNQ29uZmlnO1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IE1WVk1Db25maWcpIHtcbiAgICB0aGlzLiRlbCA9IGNvbmZpZy5lbDtcbiAgICB0aGlzLiR3YXRjaGVyID0gbmV3IFdhdGNoZXIodGhpcywgY29uZmlnLmRhdGEpO1xuICAgIHRoaXMuJGNvbXBsaWVyID0gbmV3IENvbXBpbGVyKHRoaXMpO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgdGhpcy5pbml0TGlmZUN5Y2xlcygpO1xuICAgIHRoaXMuaW5pdE1ldGhvZHMoKTtcbiAgICB0aGlzLiRjb21wbGllci5pbml0KCk7XG4gICAgdGhpcy5pbml0Q29tcHV0ZWQoKTtcbiAgICB0aGlzLmNyZWF0ZWQodGhpcyk7XG4gIH1cblxuICBzZXREYXRhKG5ld0RhdGE6IGFueSkge1xuICAgIGlmICghbmV3RGF0YSkgcmV0dXJuO1xuICAgIE9iamVjdC5rZXlzKG5ld0RhdGEpLmZvckVhY2goayA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzW2tdID0gbmV3RGF0YVtrXTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFZhbHVlKHBhdGg6IHN0cmluZykge1xuICAgIHJldHVybiBnZXRWYWx1ZSh0aGlzLCBwYXRoKTtcbiAgfVxuXG4gIGdldEV2ZW50KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzW25hbWVdO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0TGlmZUN5Y2xlcygpIHtcbiAgICB0aGlzWydjcmVhdGVkJ10gPSAoKSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZy5jcmVhdGVkICYmIHRoaXMuY29uZmlnLmNyZWF0ZWQuY2FsbCh0aGlzKTtcbiAgICB9O1xuXG4gICAgdGhpc1snZGVzdHJveSddID0gKCkgPT4ge1xuICAgICAgdGhpcy4kY29tcGxpZXIuZGVzdHJveSgpO1xuICAgICAgdGhpcy4kd2F0Y2hlci5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuY29uZmlnLmRlc3Ryb3kgJiYgdGhpcy5jb25maWcuZGVzdHJveS5jYWxsKHRoaXMpO1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGluaXRDb21wdXRlZCgpIHtcbiAgICBjb25zdCBjb21wdXRlZCA9IHRoaXMuY29uZmlnLmNvbXB1dGVkIHx8IHt9O1xuXG4gICAgY29uc3QgY29tcHV0ZWRLZXlzID0gT2JqZWN0LmtleXMoY29tcHV0ZWQpO1xuICAgIHRoaXMuJHdhdGNoZXIuYWRkTGlzdGVuZXIoJycsIChuLCBvLCBrZXkpID0+IHtcbiAgICAgIGlmIChjb21wdXRlZEtleXMuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29tcHV0ZWRLZXlzLmZvckVhY2goY2tleSA9PiB7XG4gICAgICAgIHRoaXNbY2tleV0gPSBjb21wdXRlZFtja2V5XS5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLiR3YXRjaGVyLnRyaWdnZXIoY2tleSwgdGhpc1tja2V5XSwgJycpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgY29tcHV0ZWRLZXlzLmZvckVhY2goY2tleSA9PiB7XG4gICAgICB0aGlzW2NrZXldID0gY29tcHV0ZWRbY2tleV0uY2FsbCh0aGlzKTtcbiAgICAgIHRoaXMuJHdhdGNoZXIudHJpZ2dlcihja2V5LCB0aGlzW2NrZXldLCAnJyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGluaXRNZXRob2RzKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLm1ldGhvZHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXNba2V5XSA9IHRoaXMuY29uZmlnLm1ldGhvZHNba2V5XS5iaW5kKHRoaXMpO1xuICAgIH0pO1xuICB9XG59XG5cbi8vIOWGhee9ruaMh+S7pFxuTVZWTS5kaXJlY3RpdmUoJ21vZGVsJywge1xuICBiaW5kKGVsOiBhbnksIGJpbmRpbmcpIHtcbiAgICB0aGlzLmNhbGxiYWNrID0gKGU6IGFueSkgPT4ge1xuICAgICAgY29uc3QgdmFsID0gZS50YXJnZXQudmFsdWU7XG4gICAgICBzZXRWYWx1ZSh0aGlzLiRvd25lciwgYmluZGluZy5leHByZXNzaW9uLCB2YWwpO1xuICAgIH07XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmNhbGxiYWNrKTtcbiAgICBlbC52YWx1ZSA9IGJpbmRpbmcudmFsdWU7XG4gIH0sXG4gIHVwZGF0ZShlbDogYW55LCBiaW5kaW5nKSB7XG4gICAgaWYgKGVsLnZhbHVlID09PSBiaW5kaW5nLnZhbHVlKSByZXR1cm47XG4gICAgZWwudmFsdWUgPSBiaW5kaW5nLnZhbHVlO1xuICB9LFxuICB1bmJpbmQoZWwpIHtcbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuY2FsbGJhY2spO1xuICB9LFxufSk7XG5cbk1WVk0uZGlyZWN0aXZlKCdzaG93JywgKGVsLCBiaW5kaW5nKSA9PiB7XG4gIGVsLnN0eWxlLmRpc3BsYXkgPSBiaW5kaW5nLnZhbHVlID8gJycgOiAnbm9uZSc7XG59KTtcblxuTVZWTS5kaXJlY3RpdmUoJ2lmJywge1xuICBzY29wZWQ6IHRydWUsXG4gIGJpbmQoZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nKSB7XG4gICAgY29uc3QgaHRtbCA9IGVsLm91dGVySFRNTDtcblxuICAgIGNvbnN0IG5FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIG5FbC5pbm5lckhUTUwgPSBodG1sO1xuICAgIHRoaXMuZWwgPSBuRWwuZmlyc3RDaGlsZDtcbiAgICB0aGlzLmNFbCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJy0tIGlmIGJsb2NrIC0tJyk7XG4gICAgZWwucmVwbGFjZVdpdGgodGhpcy5lbCk7XG5cbiAgICB0aGlzLmNoaWxkU2NvcGUgPSBuZXcgQ2hpbGRTY29wZSh0aGlzLmVsLCB0aGlzLiRvd25lcik7XG5cbiAgICB0aGlzLm9uSGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jaGlsZFNjb3BlLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuZWwucmVwbGFjZVdpdGgodGhpcy5jRWwpO1xuICAgIH07XG5cbiAgICB0aGlzLm9uU2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jRWwucmVwbGFjZVdpdGgodGhpcy5lbCk7XG4gICAgfTtcblxuICAgIGlmIChiaW5kaW5nLnZhbHVlID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZShlbDogYW55LCBiaW5kaW5nKSB7XG4gICAgaWYgKGJpbmRpbmcudmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLm9uSGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uU2hvdygpO1xuICAgIH1cbiAgfSxcbiAgdW5iaW5kKGVsKSB7XG4gICAgdGhpcy5vbkhpZGUoKTtcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNVlZNO1xuIiwiaW1wb3J0IHsgZ2V0VmFsdWUsIGlzUGxhaW5PYmplY3QsIG1lcmdlRGVzY3JpcHRvciB9IGZyb20gJy4vdXRpbHMnO1xuXG50eXBlIENhbGxiYWNrID0gKHZhbDogYW55LCBvbGRWYWx1ZTogYW55KSA9PiB2b2lkO1xudHlwZSBDYWxsYmFja1dpdGhQYXRoID0gKHZhbDogYW55LCBvbGRWYWx1ZTogYW55LCBwYXRoOiBzdHJpbmcpID0+IHZvaWQ7XG5cbmNsYXNzIFRva2VuIHtcbiAgcHJpdmF0ZSB2YWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogeyBvYmo6IGFueTsga2V5OiBzdHJpbmc7IHZhbHVlOiBhbnk7IGNiOiBDYWxsYmFjayB9KSB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzO1xuICAgIGNvbnN0IHsga2V5LCB2YWx1ZSwgb2JqLCBjYiB9ID0gY29uZmlnO1xuXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiByZWFjdGl2ZVNldHRlcigpIHtcbiAgICAgICAgcmV0dXJuIHNjb3BlLnZhbHVlO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gcmVhY3RpdmVHZXR0ZXIodmFsdWUpIHtcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSBzY29wZS52YWx1ZTtcbiAgICAgICAgc2NvcGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgIGNiKHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgR0xPQUJMX0tFWSA9ICdHTE9BQkwnO1xuXG5jbGFzcyBXYXRjaGVyIHtcbiAgb3duZXI6IGFueTtcbiAgbGlzdGVuZXJzOiB7XG4gICAgW3BhdGg6IHN0cmluZ106IENhbGxiYWNrV2l0aFBhdGhbXTtcbiAgfSA9IHt9O1xuICBjb25zdHJ1Y3Rvcihvd25lcjogYW55LCBkYXRhOiBhbnkpIHtcbiAgICBtZXJnZURlc2NyaXB0b3Iob3duZXIsIHRoaXMudHJhdmVyc2VEYXRhKGRhdGEpKTtcbiAgICB0aGlzLm93bmVyID0gb3duZXI7XG4gIH1cblxuICB0cmF2ZXJzZURhdGEoZGF0YTogYW55LCBwYXRoID0gJycpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IChwYXRoID8gcGF0aCArICcuJyA6ICcnKSArIGtleTtcblxuICAgICAgbmV3IFRva2VuKHtcbiAgICAgICAgb2JqOiByZXN1bHQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IGlzUGxhaW5PYmplY3QoZGF0YVtrZXldKVxuICAgICAgICAgID8gdGhpcy50cmF2ZXJzZURhdGEoZGF0YVtrZXldLCBmdWxsUGF0aClcbiAgICAgICAgICA6IGRhdGFba2V5XSxcbiAgICAgICAgY2I6IChuZXdWYWwsIG9sZFZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aCwgbmV3VmFsLCBvbGRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGg6IHN0cmluZywgbmV3VmFsdWU6IGFueSwgb2xkVmFsdWU6IGFueSkge1xuICAgIGxldCBwYXJlbnQgPSB0aGlzLm93bmVyO1xuICAgIGNvbnN0IHBhdGhBcnIgPSBmdWxsUGF0aC5zcGxpdCgnLicpO1xuICAgIGlmIChwYXRoQXJyLmxlbmd0aCA+PSAyKSB7XG4gICAgICBwYXJlbnQgPSBuZXcgRnVuY3Rpb24oXG4gICAgICAgICdkYXRhJyxcbiAgICAgICAgYHJldHVybiBkYXRhLiR7cGF0aEFyci5zbGljZSgwLCBwYXRoQXJyLmxlbmd0aCAtIDEpLmpvaW4oJy4nKX1gXG4gICAgICApKHRoaXMub3duZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IGtleTogc3RyaW5nID0gcGF0aEFyci5wb3AoKSE7XG5cbiAgICBpZiAoaXNQbGFpbk9iamVjdChuZXdWYWx1ZSkpIHtcbiAgICAgIG5ldyBUb2tlbih7XG4gICAgICAgIG9iajogcGFyZW50LFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiB0aGlzLnRyYXZlcnNlRGF0YShuZXdWYWx1ZSwgZnVsbFBhdGgpLFxuICAgICAgICBjYjogKF9uZXdWYWx1ZSwgX29sZFZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aCwgX25ld1ZhbHVlLCBfb2xkVmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKGZ1bGxQYXRoLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIocGF0aDogc3RyaW5nLCBjYjogQ2FsbGJhY2tXaXRoUGF0aCkge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IEdMT0FCTF9LRVk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmxpc3RlbmVyc1twYXRoXSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyc1twYXRoXS5wdXNoKGNiKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKHBhdGg6IHN0cmluZywgY2I/OiBDYWxsYmFja1dpdGhQYXRoKSB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gR0xPQUJMX0tFWTtcbiAgICB9XG5cbiAgICBpZiAoIWNiKSB7XG4gICAgICBkZWxldGUgdGhpcy5saXN0ZW5lcnNbcGF0aF07XG4gICAgfSBlbHNlIHtcbiAgICAgICh0aGlzLmxpc3RlbmVyc1twYXRoXSB8fCBbXSkuZmlsdGVyKGl0ZW0gPT4gaXRlbSA9PT0gY2IpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUFsbExpc3RlbmVycygpIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICB9XG5cbiAgdHJpZ2dlcihwYXRoOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbcGF0aF0pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0uZm9yRWFjaChjYiA9PiBjYihuZXdWYWx1ZSwgb2xkVmFsdWUsIHBhdGgpKTtcblxuICAgIC8vIOaUueWPmOS6huWvueixoe+8jOmCo+S5iOWtkOe6p+S5n+W6lOivpeaUtuWIsOmAmuefpVxuICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoa2V5ICE9PSBwYXRoICYmIGtleS5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGsgPSBrZXkucmVwbGFjZShwYXRoICsgJy4nLCAnJyk7XG4gICAgICAgIGNvbnN0IG9sZFYgPSBnZXRWYWx1ZShvbGRWYWx1ZSwgayk7XG4gICAgICAgIGNvbnN0IG5ld1YgPSBnZXRWYWx1ZShuZXdWYWx1ZSwgayk7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2tleV0uZm9yRWFjaChjYiA9PiBjYihuZXdWLCBvbGRWLCBrZXkpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICh0aGlzLmxpc3RlbmVyc1tHTE9BQkxfS0VZXSB8fCBbXSkuZm9yRWFjaChjYiA9PlxuICAgICAgY2IobmV3VmFsdWUsIG9sZFZhbHVlLCBwYXRoKVxuICAgICk7XG4gIH1cbn1cblxuLy8gY29uc3Qgb3duZXI6IGFueSA9IHt9O1xuXG4vLyBjb25zdCB3YXRjaGVyID0gbmV3IFdhdGNoZXIob3duZXIsIHtcbi8vICAgYTogMTAsXG4vLyAgIGI6IHtcbi8vICAgICBjOiAxMixcbi8vICAgfSxcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLmFkZExpc3RlbmVyKCdiJywgKHAxLCBwMikgPT4ge1xuLy8gICBjb25zb2xlLmxvZygnYiBjaGFuZ2VkJywgcDEsIHAyKTtcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLmFkZExpc3RlbmVyKCdiLmMnLCAocDEsIHAyKSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKCdiLmMgY2hhbmdlZCcsIHAxLCBwMik7XG4vLyB9KTtcblxuLy8gb3duZXIuYiA9IHsgYzogMTUgfTtcbi8vIG93bmVyLmIuYyA9ICd3YWhhaGFoYSc7XG5cbmV4cG9ydCBkZWZhdWx0IFdhdGNoZXI7XG4iLCJpbXBvcnQgTVZWTSBmcm9tICcuL01WVk0nO1xuXG5jb25zdCBpbml0aWFsRGF0YSA9ICgpID0+ICh7XG4gIG5hbWU6ICdKb2huJyxcbiAgYWdlOiAxMCxcbiAgZ2VuZGVyOiAxLFxuICBzdWJtaXRpbmc6IGZhbHNlLFxuICBjdXJyZW50VGltZTogbmV3IERhdGUoKSxcbiAgZXh0cmE6IHtcbiAgICBsaWtlOiAnZ2FtZScsXG4gIH0sXG4gIHNob3dJbmZvOiB0cnVlLFxuICBsaXN0OiBbeyBuYW1lOiAneXF6JyB9LCB7IG5hbWU6ICdzaGVuamluZ3dlaScgfV0sXG59KTtcblxubmV3IE1WVk0oe1xuICBlbDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpISxcbiAgZGF0YTogaW5pdGlhbERhdGEoKSxcbiAgY3JlYXRlZCh0aGlzOiBhbnkpIHtcbiAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5jdXJyZW50VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgfSwgMTAwMCk7XG4gIH0sXG4gIGRlc3Ryb3kodGhpczogYW55KSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgfSxcbiAgY29tcHV0ZWQ6IHtcbiAgICBnZW5kZXJUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuZGVyID09IDEgPyAn55S3JyA6ICflpbMnO1xuICAgIH0sXG4gICAgY3VycmVudFRpbWVTdHIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZS50b0xvY2FsZVN0cmluZygpO1xuICAgIH0sXG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBjaGFuZ2VHZW5kZXIoKSB7XG4gICAgICB0aGlzLmdlbmRlciA9IHRoaXMuZ2VuZGVyID09IDEgPyAwIDogMTtcbiAgICB9LFxuXG4gICAgdG9nZ2xlU2hvd0luZm8oKSB7XG4gICAgICB0aGlzLnNob3dJbmZvID0gIXRoaXMuc2hvd0luZm87XG4gICAgfSxcblxuICAgIHJlc2V0KCkge1xuICAgICAgY29uc3QgbmV3RGF0YSA9IGluaXRpYWxEYXRhKCk7XG4gICAgICB0aGlzLnNldERhdGEobmV3RGF0YSk7XG4gICAgfSxcblxuICAgIHN1Ym1pdCgpIHtcbiAgICAgIHRoaXMuc3VibWl0aW5nID0gdHJ1ZTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFsZXJ0KCfmj5DkuqTmiJDlip8nKTtcbiAgICAgICAgdGhpcy5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH0sXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbnVsbDtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRWYWx1ZShvYmo6IGFueSwgcGF0aDogc3RyaW5nLCBkZWZhdWx0VmFsID0gdW5kZWZpbmVkKSB7XG4gIGxldCB2YWwgPSBvYmo7XG4gIHRyeSB7XG4gICAgdmFsID0gbmV3IEZ1bmN0aW9uKCdkYXRhJywgYHJldHVybiBkYXRhLiR7cGF0aH1gKShvYmopO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWw7XG4gIH1cbiAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbCA6IHZhbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFZhbHVlKG9iajogYW55LCBwYXRoOiBzdHJpbmcsIHZhbDogYW55KSB7XG4gIHRyeSB7XG4gICAgbmV3IEZ1bmN0aW9uKCdkYXRhJywgYGRhdGEuJHtwYXRofT0ke0pTT04uc3RyaW5naWZ5KHZhbCl9YCkob2JqKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmo6IGFueSkge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlc2NyaXB0b3IoYTogYW55LCBiOiBhbnkpIHtcbiAgZm9yIChsZXQga2V5IGluIGIpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICBhLFxuICAgICAga2V5LFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiLCBrZXkpXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKFxuICBleHByZXNzaW9uOiBzdHJpbmcsXG4gIHNjb3BlTmFtZTogc3RyaW5nID0gJ3RoaXMnXG4pIHtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IG1heCA9IGV4cHJlc3Npb24ubGVuZ3RoO1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGxldCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG5cbiAgd2hpbGUgKGluZGV4IDwgbWF4KSB7XG4gICAgbGV0IGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdChpbmRleCk7XG5cbiAgICBpZiAoLyd8XCIvLnRlc3QoY2hhcikpIHtcbiAgICAgIGNvbnN0IGMgPSBjaGFyO1xuICAgICAgbGV0IHN0ciA9IFwiJ1wiO1xuICAgICAgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KCsraW5kZXgpO1xuICAgICAgd2hpbGUgKGNoYXIgIT09IHVuZGVmaW5lZCAmJiBjaGFyICE9PSBjKSB7XG4gICAgICAgIHN0ciArPSBjaGFyO1xuICAgICAgICBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoKytpbmRleCk7XG4gICAgICB9XG4gICAgICByZXN1bHQgKz0gc3RyO1xuICAgICAgcmVzdWx0ICs9IFwiJ1wiO1xuICAgICAgaW5kZXgrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGxldCBWQVJJQUJMRVMgPSAvW0EtWmEtel9dLztcbiAgICBpZiAoVkFSSUFCTEVTLnRlc3QoY2hhcikpIHtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuXG4gICAgICBsZXQgcGF0aCA9ICcnO1xuICAgICAgbGV0IHBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgd2hpbGUgKGNoYXIgJiYgL1tBLVphLXpfMC05LigpXS8udGVzdChjaGFyKSkge1xuICAgICAgICB2YWx1ZSArPSBjaGFyO1xuXG4gICAgICAgIGlmIChjaGFyID09PSAnLicpIHtcbiAgICAgICAgICBwYXRocy5wdXNoKHBhdGgpO1xuICAgICAgICAgIHBhdGggPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRoICs9IGNoYXI7XG4gICAgICAgIH1cbiAgICAgICAgY2hhciA9IGV4cHJlc3Npb25bKytpbmRleF07XG4gICAgICB9XG5cbiAgICAgIGlmICgvXltBLVphLXpfMC05XSskLy50ZXN0KHBhdGgpKSB7XG4gICAgICAgIHBhdGhzLnB1c2gocGF0aCk7XG4gICAgICB9XG5cbiAgICAgIGRlcGVuZGVuY2llcy5wdXNoKHBhdGhzLmpvaW4oJy4nKSk7XG4gICAgICByZXN1bHQgKz0gc2NvcGVOYW1lICsgJy5nZXRWYWx1ZShcIicgKyB2YWx1ZSArIChjaGFyIHx8ICcnKSArICdcIiknO1xuICAgICAgaW5kZXgrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc3VsdCArPSBjaGFyO1xuICAgIGluZGV4Kys7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGV4cHJlc3Npb246IHJlc3VsdCxcbiAgICBkZXBlbmRlbmNpZXMsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1JlYWxWYWx1ZSh2YWx1ZTogYW55KSB7XG4gIGlmICghdmFsdWUpIHJldHVybiB2YWx1ZTtcblxuICBpZiAoL15bMC05XT8oXFwuWzAtOV0rKT8kLy50ZXN0KHZhbHVlKSkge1xuICAgIHJldHVybiBOdW1iZXIodmFsdWUpO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ251bGwnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXk8VCA9IGFueT4odmFsdWU6IEFycmF5TGlrZTxUPik6IEFycmF5PFQ+IHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHZhbHVlKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=