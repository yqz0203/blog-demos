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
        this.initLifeCycles();
        this.initMethods();
        this.$complier.init();
        this.initComputed();
        this.initWatch();
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
        return this[name] ? this[name].bind(this) : '';
    }
    initLifeCycles() {
        this['created'] = () => {
            this.config.created && this.config.created.call(this);
        };
        this['destroyed'] = () => {
            this.$complier.destroy();
            this.$watcher.removeAllListeners();
            this.config.destroyed && this.config.destroyed.call(this);
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
    destroyed() {
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
    watch: {
        currentTime: function (value) {
            console.log(value);
        },
    },
    methods: {
        changeGender(...args) {
            console.log(args);
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

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NoaWxkU2NvcGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbXBpbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9EaXJlY3RpdmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01WVk0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDakZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBZ0M7QUFDRTtBQUNDO0FBRXBCLE1BQU0sVUFBVTtJQVU3QixZQUFZLEVBQU8sRUFBRSxNQUFjO1FBSm5DLG9CQUFlLEdBQUcsQ0FBQyxDQUFNLEVBQUUsQ0FBTSxF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QUNsQixZQUFZO0tBQ2IsQ0FBQztBQUNKLENBQUM7QUFFTSxTQUFTLFdBQVcsQ0FBQyxLQUFVO0lBQ3BDLElBQUksQ0FBQyxLQUFLO1FBQUUsT0FBTyxLQUFLLENBQUM7SUFFekIsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDckMsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdEI7U0FBTSxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7UUFDM0IsT0FBTyxJQUFJLENBQUM7S0FDYjtTQUFNLElBQUksS0FBSyxLQUFLLE9BQU8sRUFBRTtRQUM1QixPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU0sSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFO1FBQzNCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7U0FBTSxJQUFJLEtBQUssS0FBSyxXQUFXLEVBQUU7UUFDaEMsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFTSxTQUFTLE9BQU8sQ0FBVSxLQUFtQjtJQUNsRCxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQyxDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCBJT3duZXIgZnJvbSAnLi9JT3duZXInO1xuaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi9XYXRjaGVyJztcbmltcG9ydCBDb21waWxlciBmcm9tICcuL0NvbXBpbGVyJztcbmltcG9ydCB7IGdldFZhbHVlIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoaWxkU2NvcGUgaW1wbGVtZW50cyBJT3duZXIge1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG4gICRwYXJlbnQ6IElPd25lcjtcbiAgJHdhdGNoZXI6IFdhdGNoZXI7XG4gICRlbDogYW55O1xuICAkY29tcGxpZXI6IENvbXBpbGVyO1xuICAkcGFyZW50TGlzdGVuZXIgPSAobjogYW55LCBvOiBhbnksIHA6IHN0cmluZykgPT4ge1xuICAgIHRoaXMuJHdhdGNoZXIudHJpZ2dlcihwLCBuLCBvKTtcbiAgfTtcblxuICBjb25zdHJ1Y3RvcihlbDogYW55LCBwYXJlbnQ6IElPd25lcikge1xuICAgIHRoaXMuJHBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLiRlbCA9IGVsO1xuICAgIHRoaXMuJHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih0aGlzLCB7fSk7XG4gICAgdGhpcy4kY29tcGxpZXIgPSBuZXcgQ29tcGlsZXIodGhpcyk7XG4gICAgdGhpcy4kY29tcGxpZXIuaW5pdCgpO1xuXG4gICAgdGhpcy4kcGFyZW50LiR3YXRjaGVyLmFkZExpc3RlbmVyKCcnLCB0aGlzLiRwYXJlbnRMaXN0ZW5lcik7XG4gIH1cblxuICBnZXRWYWx1ZShwYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zdCB2YWwgPSBnZXRWYWx1ZSh0aGlzLCBwYXRoKTtcblxuICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHBhcmVudC5nZXRWYWx1ZShwYXRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgc2V0RGF0YShuZXdEYXRhOiBhbnkpIHtcbiAgICB0aGlzLiRwYXJlbnQuc2V0RGF0YShuZXdEYXRhKTtcbiAgfVxuXG4gIGdldEV2ZW50KG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLiRwYXJlbnQuZ2V0RXZlbnQobmFtZSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuJGNvbXBsaWVyLmRlc3Ryb3koKTtcbiAgICB0aGlzLiR3YXRjaGVyLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgIHRoaXMuJHBhcmVudC4kd2F0Y2hlci5yZW1vdmVMaXN0ZW5lcignJywgdGhpcy4kcGFyZW50TGlzdGVuZXIpO1xuICB9XG59XG4iLCJpbXBvcnQgRGlyZWN0aXZlLCB7IGRpcmVjdGl2ZUNvbmZpZ01hcCwgRElSRUNUSVZFX1BSRUZJWCB9IGZyb20gJy4vRGlyZWN0aXZlJztcbmltcG9ydCB7IHBhcnNlRXhwcmVzc2lvbiwgdG9SZWFsVmFsdWUsIHRvQXJyYXkgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBJT3duZXIgZnJvbSAnLi9JT3duZXInO1xuXG5jbGFzcyBDb21waWxlciB7XG4gIG93bmVyOiBJT3duZXI7XG4gIGRpcmVjdGl2ZXM6IERpcmVjdGl2ZVtdID0gW107XG5cbiAgY29uc3RydWN0b3Iob3duZXI6IElPd25lcikge1xuICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy50cmF2ZXJzRUwodGhpcy5vd25lci4kZWwpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRpcmVjdGl2ZXMuZm9yRWFjaChkID0+IGQuZGVzdHJveSgpKTtcbiAgfVxuXG4gIHByaXZhdGUgdHJhdmVyc0VMKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGlmICh0aGlzLnRyYXZlcnNBdHRyKGVsKSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IGVsLmNoaWxkTm9kZXNbaV07XG5cbiAgICAgIC8vIHRleHRcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIGxldCBub2RlVmFsdWUgPSBub2RlLm5vZGVWYWx1ZSE7XG5cbiAgICAgICAgbGV0IHNldE5vZGVWYWx1ZSA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIGNocm9tZSDkuI3kvJrop6blj5Hph43nu5hcbiAgICAgICAgICAvLyBpZiAobm9kZS5ub2RlVmFsdWUgIT09IHZhbCkge1xuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gdmFsO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQobm9kZVZhbHVlLCBzZXROb2RlVmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIHRoaXMudHJhdmVyc0VMKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhdmVyc0F0dHIobm9kZTogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdG9BcnJheShub2RlLmF0dHJpYnV0ZXMpO1xuXG4gICAgbGV0IHNjb3BlZEF0dHI6IGFueTtcblxuICAgIGF0dHJpYnV0ZXMuc29tZShpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IGRpcmVjdGl2ZUNvbmZpZ01hcC5nZXQoaXRlbS5uYW1lKTtcblxuICAgICAgLy8gaWbnmoTkvJjlhYjnuqfmmK/mnIDpq5jnmoRcbiAgICAgIGlmIChpdGVtLm5hbWUgPT09IERJUkVDVElWRV9QUkVGSVggKyAnaWYnKSB7XG4gICAgICAgIHNjb3BlZEF0dHIgPSBpdGVtO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXNjb3BlZEF0dHIgJiYgdHlwZW9mIGNvbmZpZyA9PT0gJ29iamVjdCcgJiYgY29uZmlnLnNjb3BlZCkge1xuICAgICAgICBzY29wZWRBdHRyID0gaXRlbTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChzY29wZWRBdHRyKSB7XG4gICAgICBjb25zdCBkaXJlY3RpdmUgPSB0aGlzLmluaXREaXJlY3RpdmUobm9kZSwgc2NvcGVkQXR0cik7XG5cbiAgICAgIGlmIChkaXJlY3RpdmUgJiYgZGlyZWN0aXZlLiRzY29wZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgIGlmICghYXR0cikgcmV0dXJuO1xuXG4gICAgICAvLyDmjIfku6RcbiAgICAgIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aChESVJFQ1RJVkVfUFJFRklYKSkge1xuICAgICAgICB0aGlzLmluaXREaXJlY3RpdmUobm9kZSwgYXR0cik7XG4gICAgICB9XG4gICAgICAvLyBkb23lsZ7mgKdcbiAgICAgIGVsc2UgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKCc6JykpIHtcbiAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICAgICAgY29uc3QgYXR0ck5hbWUgPSBhdHRyLm5hbWUuc3Vic3RyKDEpO1xuXG4gICAgICAgIHRoaXMucGFyc2VUZW1wbGF0ZUFuZFNldCgne3snICsgYXR0ci52YWx1ZSArICd9fScsICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBub2RlW2F0dHJOYW1lXSA9IHRvUmVhbFZhbHVlKHZhbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgLy8g5Zue6LCD5Ye95pWwXG4gICAgICBlbHNlIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aCgnQCcpKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGF0dHIubmFtZS5zdWJzdHIoMSk7XG4gICAgICAgIGxldCBldmVudEZ1bmNOYW1lID0gYXR0ci52YWx1ZTtcbiAgICAgICAgY29uc3QgcGFyc2VkczogQXJyYXk8UmV0dXJuVHlwZTx0eXBlb2YgcGFyc2VFeHByZXNzaW9uPj4gPSBbXTtcbiAgICAgICAgY29uc3QgbWF0Y2hlZCA9IGV2ZW50RnVuY05hbWUubWF0Y2goLyhbXigpXSspXFwoKC4rKVxcKS8pO1xuICAgICAgICAvLyDluKblj4LmlbDnmoTlm57osINcbiAgICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgICBldmVudEZ1bmNOYW1lID0gbWF0Y2hlZFsxXTtcbiAgICAgICAgICBjb25zdCBwYXJhbXMgPSBtYXRjaGVkWzJdO1xuICAgICAgICAgIHBhcmFtcy5zcGxpdCgnLCcpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUV4cHJlc3Npb24ocCwgJ3RoaXMub3duZXInKTtcbiAgICAgICAgICAgIHBhcnNlZHMucHVzaChwYXJzZWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2IgPSB0aGlzLm93bmVyLmdldEV2ZW50KGV2ZW50RnVuY05hbWUudHJpbSgpKTtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY29uc3QgZnVuY3MgPSBwYXJzZWRzLm1hcChwYXJzZWQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbigncmV0dXJuICcgKyBwYXJzZWQuZXhwcmVzc2lvbikuYmluZCh0aGlzKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBlID0+IHtcbiAgICAgICAgICAgIGNiLmFwcGx5KG51bGwsIFtlLCAuLi5mdW5jcy5tYXAoZnVuYyA9PiBmdW5jKCkpXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGh0bWzlsZ7mgKdcbiAgICAgIGVsc2Uge1xuICAgICAgICBsZXQgY2IgPSAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIHZhbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wYXJzZVRlbXBsYXRlQW5kU2V0KGF0dHIudmFsdWUsIGNiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0RGlyZWN0aXZlKG5vZGU6IGFueSwgYXR0cjogQXR0cikge1xuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgY29uc3QgZGlyZWN0aXZlTmFtZSA9IGF0dHIubmFtZS5yZXBsYWNlKFxuICAgICAgbmV3IFJlZ0V4cCgnXicgKyBESVJFQ1RJVkVfUFJFRklYKSxcbiAgICAgICcnXG4gICAgKTtcbiAgICBjb25zdCBkZCA9IGRpcmVjdGl2ZUNvbmZpZ01hcC5nZXQoZGlyZWN0aXZlTmFtZSk7XG5cbiAgICBpZiAoIWRkKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ+acquefpeeahOaMh+S7pO+8micsIGRpcmVjdGl2ZU5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBkaXJlY3RpdmUgPSBuZXcgRGlyZWN0aXZlKHRoaXMub3duZXIsIG5vZGUsIGF0dHIudmFsdWUsIGRkKTtcbiAgICAgIHRoaXMuZGlyZWN0aXZlcy5wdXNoKGRpcmVjdGl2ZSk7XG5cbiAgICAgIHJldHVybiBkaXJlY3RpdmU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZVRlbXBsYXRlQW5kU2V0KFxuICAgIHRlbXBsYXRlOiBzdHJpbmcsXG4gICAgc2V0Tm9kZVZhbHVlOiAodmFsOiBzdHJpbmcpID0+IHZvaWRcbiAgKSB7XG4gICAgY29uc3QgdmFsdWVSZWdleHAgPSAve3soW159XSspfX0vZztcblxuICAgIGxldCByZXN1bHQgPSB2YWx1ZVJlZ2V4cC5leGVjKHRlbXBsYXRlKTtcbiAgICBsZXQgYWxsU2NvcGVLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBjYWxDb250ZXh0czogQXJyYXk8e1xuICAgICAgc3RhcnRJbmRleDogbnVtYmVyO1xuICAgICAgZW5kSW5kZXg6IG51bWJlcjtcbiAgICAgIGNhbDogKCkgPT4gc3RyaW5nO1xuICAgIH0+ID0gW107XG5cbiAgICB3aGlsZSAocmVzdWx0KSB7XG4gICAgICBjb25zdCB7IGluZGV4IH0gPSByZXN1bHQ7XG4gICAgICBsZXQgdHBsID0gcmVzdWx0WzFdO1xuICAgICAgbGV0IGZ1bGxUcGwgPSByZXN1bHRbMF07XG5cbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlRXhwcmVzc2lvbih0cGwsICd0aGlzLm93bmVyJyk7XG4gICAgICBsZXQgc2NvcGVLZXlzID0gcGFyc2VkLmRlcGVuZGVuY2llcztcblxuICAgICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgcGFyc2VkLmV4cHJlc3Npb24pLmJpbmQodGhpcyk7XG5cbiAgICAgIGFsbFNjb3BlS2V5cyA9IFsuLi5hbGxTY29wZUtleXMsIC4uLnNjb3BlS2V5c107XG4gICAgICBjYWxDb250ZXh0cyA9IFtcbiAgICAgICAgLi4uY2FsQ29udGV4dHMsXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFydEluZGV4OiBpbmRleCxcbiAgICAgICAgICBlbmRJbmRleDogaW5kZXggKyBmdWxsVHBsLmxlbmd0aCxcbiAgICAgICAgICBjYWw6ICgpID0+IGZuLmFwcGx5KHRoaXMpLFxuICAgICAgICB9LFxuICAgICAgXTtcblxuICAgICAgcmVzdWx0ID0gdmFsdWVSZWdleHAuZXhlYyh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgY29uc3QgY2FsVmFsdWUgPSAoKSA9PiB7XG4gICAgICBsZXQgbGFzdGVuZCA9IDA7XG4gICAgICBsZXQgdmFsdWUgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gY2FsQ29udGV4dHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKGxhc3RlbmQsIGNhbENvbnRleHRzW2ldLnN0YXJ0SW5kZXgpO1xuICAgICAgICB2YWx1ZSArPSBjYWxDb250ZXh0c1tpXS5jYWwoKTtcbiAgICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UoXG4gICAgICAgICAgY2FsQ29udGV4dHNbaV0uZW5kSW5kZXgsXG4gICAgICAgICAgaSA8IGwgLSAxID8gY2FsQ29udGV4dHNbaSArIDFdLnN0YXJ0SW5kZXggOiB1bmRlZmluZWRcbiAgICAgICAgKTtcbiAgICAgICAgbGFzdGVuZCA9IGNhbENvbnRleHRzW2ldLmVuZEluZGV4O1xuICAgICAgfVxuXG4gICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShcbiAgICAgICAgbGFzdGVuZCxcbiAgICAgICAgY2FsQ29udGV4dHNbY2FsQ29udGV4dHMubGVuZ3RoIC0gMV0uc3RhcnRJbmRleFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG5cbiAgICBhbGxTY29wZUtleXMuZm9yRWFjaChrID0+IHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gKCkgPT4ge1xuICAgICAgICBzZXROb2RlVmFsdWUoY2FsVmFsdWUoKSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5vd25lci4kd2F0Y2hlci5hZGRMaXN0ZW5lcihrLCBsaXN0ZW5lcik7XG4gICAgICBsaXN0ZW5lcigpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBpbGVyO1xuIiwiaW1wb3J0IElPd25lciBmcm9tICcuL0lPd25lcic7XG5cbnR5cGUgT2JqZWN0RGlyZWN0aXZlQ29uZmlnID0ge1xuICBzY29wZWQ/OiBib29sZWFuO1xuICBiaW5kKHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpOiB2b2lkO1xuICB1cGRhdGU/KHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpOiB2b2lkO1xuICB1bmJpbmQ/KHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50KTogdm9pZDtcbn07XG5cbnR5cGUgRnVuY3Rpb25EaXJlY3RpdmVDb25maWcgPSAoZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIERpcmVjdGl2ZUNvbmZpZyA9IE9iamVjdERpcmVjdGl2ZUNvbmZpZyB8IEZ1bmN0aW9uRGlyZWN0aXZlQ29uZmlnO1xuXG5jbGFzcyBEaXJlY3RpdmUge1xuICBwcml2YXRlIGNvbmZpZzogT2JqZWN0RGlyZWN0aXZlQ29uZmlnO1xuICAkZWw6IEhUTUxFbGVtZW50O1xuICAkb3duZXI6IElPd25lcjtcbiAgJHNjb3BlZDogYm9vbGVhbjtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICBjb25zdHJ1Y3RvcihcbiAgICBvd25lcjogSU93bmVyLFxuICAgIGVsOiBIVE1MRWxlbWVudCxcbiAgICBwYXRoOiBzdHJpbmcsXG4gICAgY29uZmlnOiBEaXJlY3RpdmVDb25maWdcbiAgKSB7XG4gICAgdGhpcy4kZWwgPSBlbDtcbiAgICB0aGlzLiRvd25lciA9IG93bmVyO1xuXG4gICAgaWYgKHR5cGVvZiBjb25maWcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgICBiaW5kOiBjb25maWcsXG4gICAgICAgIHVwZGF0ZTogY29uZmlnLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgdGhpcy4kb3duZXIuJHdhdGNoZXIuYWRkTGlzdGVuZXIocGF0aCwgdmFsID0+IHtcbiAgICAgIGlmICh0aGlzLmNvbmZpZy51cGRhdGUpIHtcbiAgICAgICAgdGhpcy5jb25maWcudXBkYXRlLmNhbGwodGhpcywgZWwsIHsgdmFsdWU6IHZhbCwgZXhwcmVzc2lvbjogcGF0aCB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY29uZmlnLmJpbmQuY2FsbCh0aGlzLCBlbCwge1xuICAgICAgdmFsdWU6IHRoaXMuJG93bmVyLmdldFZhbHVlKHBhdGgpLFxuICAgICAgZXhwcmVzc2lvbjogcGF0aCxcbiAgICB9KTtcblxuICAgIHRoaXMuJHNjb3BlZCA9IHRoaXMuY29uZmlnLnNjb3BlZCB8fCBmYWxzZTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnVuYmluZCkge1xuICAgICAgdGhpcy5jb25maWcudW5iaW5kLmNhbGwodGhpcywgdGhpcy4kZWwpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZGlyZWN0aXZlQ29uZmlnTWFwID0gbmV3IE1hcDxzdHJpbmcsIERpcmVjdGl2ZUNvbmZpZz4oKTtcblxuZXhwb3J0IGNvbnN0IERJUkVDVElWRV9QUkVGSVggPSAneC0nO1xuXG5leHBvcnQgZGVmYXVsdCBEaXJlY3RpdmU7XG4iLCJpbXBvcnQgV2F0Y2hlciBmcm9tICcuL1dhdGNoZXInO1xuaW1wb3J0IHsgc2V0VmFsdWUsIGdldFZhbHVlIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyBEaXJlY3RpdmVDb25maWcsIGRpcmVjdGl2ZUNvbmZpZ01hcCB9IGZyb20gJy4vRGlyZWN0aXZlJztcbmltcG9ydCBDb21waWxlciBmcm9tICcuL0NvbXBpbGVyJztcbmltcG9ydCBJT3duZXIgZnJvbSAnLi9JT3duZXInO1xuaW1wb3J0IENoaWxkU2NvcGUgZnJvbSAnLi9DaGlsZFNjb3BlJztcblxuaW50ZXJmYWNlIE1WVk1Db25maWcge1xuICBlbDogSFRNTEVsZW1lbnQ7XG4gIGRhdGE6IGFueTtcbiAgY3JlYXRlZD86ICgpID0+IHZvaWQ7XG4gIGRlc3Ryb3llZD86ICgpID0+IHZvaWQ7XG4gIHdhdGNoPzogeyBba2V5OiBzdHJpbmddOiAobmV3VmFsdWU6IGFueSwgb2xkVmFsdWU6IGFueSkgPT4gdm9pZCB9O1xuICBjb21wdXRlZDogYW55O1xuICBtZXRob2RzOiBhbnk7XG59XG5cbmNsYXNzIE1WVk0gaW1wbGVtZW50cyBJT3duZXIge1xuICBzdGF0aWMgZGlyZWN0aXZlID0gZnVuY3Rpb24obmFtZTogc3RyaW5nLCBjb25maWc6IERpcmVjdGl2ZUNvbmZpZykge1xuICAgIGRpcmVjdGl2ZUNvbmZpZ01hcC5zZXQobmFtZSwgY29uZmlnKTtcbiAgfTtcblxuICAkZWw6IEhUTUxFbGVtZW50O1xuICAkd2F0Y2hlcjogV2F0Y2hlcjtcbiAgJGNvbXBsaWVyOiBDb21waWxlcjtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuXG4gIHByaXZhdGUgY29uZmlnOiBNVlZNQ29uZmlnO1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IE1WVk1Db25maWcpIHtcbiAgICB0aGlzLiRlbCA9IGNvbmZpZy5lbDtcbiAgICB0aGlzLiR3YXRjaGVyID0gbmV3IFdhdGNoZXIodGhpcywgY29uZmlnLmRhdGEpO1xuICAgIHRoaXMuJGNvbXBsaWVyID0gbmV3IENvbXBpbGVyKHRoaXMpO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgdGhpcy5pbml0TGlmZUN5Y2xlcygpO1xuICAgIHRoaXMuaW5pdE1ldGhvZHMoKTtcbiAgICB0aGlzLiRjb21wbGllci5pbml0KCk7XG4gICAgdGhpcy5pbml0Q29tcHV0ZWQoKTtcbiAgICB0aGlzLmluaXRXYXRjaCgpO1xuICAgIHRoaXMuY3JlYXRlZCh0aGlzKTtcbiAgfVxuXG4gIHNldERhdGEobmV3RGF0YTogYW55KSB7XG4gICAgaWYgKCFuZXdEYXRhKSByZXR1cm47XG4gICAgT2JqZWN0LmtleXMobmV3RGF0YSkuZm9yRWFjaChrID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXNba10gPSBuZXdEYXRhW2tdO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0VmFsdWUocGF0aDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGdldFZhbHVlKHRoaXMsIHBhdGgpO1xuICB9XG5cbiAgZ2V0RXZlbnQobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXNbbmFtZV0gPyB0aGlzW25hbWVdLmJpbmQodGhpcykgOiAnJztcbiAgfVxuXG4gIHByaXZhdGUgaW5pdExpZmVDeWNsZXMoKSB7XG4gICAgdGhpc1snY3JlYXRlZCddID0gKCkgPT4ge1xuICAgICAgdGhpcy5jb25maWcuY3JlYXRlZCAmJiB0aGlzLmNvbmZpZy5jcmVhdGVkLmNhbGwodGhpcyk7XG4gICAgfTtcblxuICAgIHRoaXNbJ2Rlc3Ryb3llZCddID0gKCkgPT4ge1xuICAgICAgdGhpcy4kY29tcGxpZXIuZGVzdHJveSgpO1xuICAgICAgdGhpcy4kd2F0Y2hlci5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuY29uZmlnLmRlc3Ryb3llZCAmJiB0aGlzLmNvbmZpZy5kZXN0cm95ZWQuY2FsbCh0aGlzKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0Q29tcHV0ZWQoKSB7XG4gICAgY29uc3QgY29tcHV0ZWQgPSB0aGlzLmNvbmZpZy5jb21wdXRlZCB8fCB7fTtcblxuICAgIGNvbnN0IGNvbXB1dGVkS2V5cyA9IE9iamVjdC5rZXlzKGNvbXB1dGVkKTtcbiAgICB0aGlzLiR3YXRjaGVyLmFkZExpc3RlbmVyKCcnLCAobiwgbywga2V5KSA9PiB7XG4gICAgICBpZiAoY29tcHV0ZWRLZXlzLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbXB1dGVkS2V5cy5mb3JFYWNoKGNrZXkgPT4ge1xuICAgICAgICB0aGlzW2NrZXldID0gY29tcHV0ZWRbY2tleV0uY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy4kd2F0Y2hlci50cmlnZ2VyKGNrZXksIHRoaXNbY2tleV0sICcnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGNvbXB1dGVkS2V5cy5mb3JFYWNoKGNrZXkgPT4ge1xuICAgICAgdGhpc1tja2V5XSA9IGNvbXB1dGVkW2NrZXldLmNhbGwodGhpcyk7XG4gICAgICB0aGlzLiR3YXRjaGVyLnRyaWdnZXIoY2tleSwgdGhpc1tja2V5XSwgJycpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0V2F0Y2goKSB7XG4gICAgY29uc3Qgd2F0Y2ggPSB0aGlzLmNvbmZpZy53YXRjaCB8fCB7fTtcbiAgICBjb25zdCB3YXRjaEtleXMgPSBPYmplY3Qua2V5cyh3YXRjaCk7XG4gICAgd2F0Y2hLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIHRoaXMuJHdhdGNoZXIuYWRkTGlzdGVuZXIoa2V5LCAobiwgbywga2V5KSA9PiB7XG4gICAgICAgIHdhdGNoW2tleV0uY2FsbCh0aGlzLCBuLCBvKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0TWV0aG9kcygpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5tZXRob2RzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzW2tleV0gPSB0aGlzLmNvbmZpZy5tZXRob2RzW2tleV0uYmluZCh0aGlzKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vLyDlhoXnva7mjIfku6Rcbk1WVk0uZGlyZWN0aXZlKCdtb2RlbCcsIHtcbiAgYmluZChlbDogYW55LCBiaW5kaW5nKSB7XG4gICAgdGhpcy5jYWxsYmFjayA9IChlOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHZhbCA9IGUudGFyZ2V0LnZhbHVlO1xuICAgICAgc2V0VmFsdWUodGhpcy4kb3duZXIsIGJpbmRpbmcuZXhwcmVzc2lvbiwgdmFsKTtcbiAgICB9O1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5jYWxsYmFjayk7XG4gICAgZWwudmFsdWUgPSBiaW5kaW5nLnZhbHVlO1xuICB9LFxuICB1cGRhdGUoZWw6IGFueSwgYmluZGluZykge1xuICAgIGlmIChlbC52YWx1ZSA9PT0gYmluZGluZy52YWx1ZSkgcmV0dXJuO1xuICAgIGVsLnZhbHVlID0gYmluZGluZy52YWx1ZTtcbiAgfSxcbiAgdW5iaW5kKGVsKSB7XG4gICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0aGlzLmNhbGxiYWNrKTtcbiAgfSxcbn0pO1xuXG5NVlZNLmRpcmVjdGl2ZSgnc2hvdycsIChlbCwgYmluZGluZykgPT4ge1xuICBlbC5zdHlsZS5kaXNwbGF5ID0gYmluZGluZy52YWx1ZSA/ICcnIDogJ25vbmUnO1xufSk7XG5cbk1WVk0uZGlyZWN0aXZlKCdpZicsIHtcbiAgc2NvcGVkOiB0cnVlLFxuICBiaW5kKGVsOiBIVE1MRWxlbWVudCwgYmluZGluZykge1xuICAgIGNvbnN0IGh0bWwgPSBlbC5vdXRlckhUTUw7XG4gICAgdGhpcy5jRWwgPSBkb2N1bWVudC5jcmVhdGVDb21tZW50KCctLSBpZiBibG9jayAtLScpO1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLm9uSGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jaGlsZFNjb3BlICYmIHRoaXMuY2hpbGRTY29wZS5kZXN0cm95KCk7XG4gICAgICB0aGlzLmVsLnJlcGxhY2VXaXRoKHRoaXMuY0VsKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vblNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBuRWw6IGFueSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgbkVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICBuRWwgPSBuRWwuZmlyc3RDaGlsZDtcblxuICAgICAgdGhpcy5lbC5yZXBsYWNlV2l0aChuRWwpO1xuICAgICAgdGhpcy5lbCA9IG5FbDtcbiAgICAgIHRoaXMuY2hpbGRTY29wZSA9IG5ldyBDaGlsZFNjb3BlKHRoaXMuZWwsIHRoaXMuJG93bmVyKTtcbiAgICAgIHRoaXMuY0VsLnJlcGxhY2VXaXRoKHRoaXMuZWwpO1xuICAgIH07XG5cbiAgICBpZiAoYmluZGluZy52YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMub25IaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25TaG93KCk7XG4gICAgfVxuICB9LFxuICB1cGRhdGUoZWw6IGFueSwgYmluZGluZykge1xuICAgIGlmIChiaW5kaW5nLnZhbHVlID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5vbkhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vblNob3coKTtcbiAgICB9XG4gIH0sXG4gIHVuYmluZChlbCkge1xuICAgIHRoaXMub25IaWRlKCk7XG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgTVZWTTtcbiIsImltcG9ydCB7IGdldFZhbHVlLCBpc1BsYWluT2JqZWN0LCBtZXJnZURlc2NyaXB0b3IgfSBmcm9tICcuL3V0aWxzJztcblxudHlwZSBDYWxsYmFjayA9ICh2YWw6IGFueSwgb2xkVmFsdWU6IGFueSkgPT4gdm9pZDtcbnR5cGUgQ2FsbGJhY2tXaXRoUGF0aCA9ICh2YWw6IGFueSwgb2xkVmFsdWU6IGFueSwgcGF0aDogc3RyaW5nKSA9PiB2b2lkO1xuXG5jbGFzcyBUb2tlbiB7XG4gIHByaXZhdGUgdmFsdWU6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IHsgb2JqOiBhbnk7IGtleTogc3RyaW5nOyB2YWx1ZTogYW55OyBjYjogQ2FsbGJhY2sgfSkge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcztcbiAgICBjb25zdCB7IGtleSwgdmFsdWUsIG9iaiwgY2IgfSA9IGNvbmZpZztcblxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gcmVhY3RpdmVTZXR0ZXIoKSB7XG4gICAgICAgIHJldHVybiBzY29wZS52YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlR2V0dGVyKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gc2NvcGUudmFsdWU7XG4gICAgICAgIHNjb3BlLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICBjYih2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IEdMT0FCTF9LRVkgPSAnR0xPQUJMJztcblxuY2xhc3MgV2F0Y2hlciB7XG4gIG93bmVyOiBhbnk7XG4gIGxpc3RlbmVyczoge1xuICAgIFtwYXRoOiBzdHJpbmddOiBDYWxsYmFja1dpdGhQYXRoW107XG4gIH0gPSB7fTtcbiAgY29uc3RydWN0b3Iob3duZXI6IGFueSwgZGF0YTogYW55KSB7XG4gICAgbWVyZ2VEZXNjcmlwdG9yKG93bmVyLCB0aGlzLnRyYXZlcnNlRGF0YShkYXRhKSk7XG4gICAgdGhpcy5vd25lciA9IG93bmVyO1xuICB9XG5cbiAgdHJhdmVyc2VEYXRhKGRhdGE6IGFueSwgcGF0aCA9ICcnKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgZnVsbFBhdGggPSAocGF0aCA/IHBhdGggKyAnLicgOiAnJykgKyBrZXk7XG5cbiAgICAgIG5ldyBUb2tlbih7XG4gICAgICAgIG9iajogcmVzdWx0LFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiBpc1BsYWluT2JqZWN0KGRhdGFba2V5XSlcbiAgICAgICAgICA/IHRoaXMudHJhdmVyc2VEYXRhKGRhdGFba2V5XSwgZnVsbFBhdGgpXG4gICAgICAgICAgOiBkYXRhW2tleV0sXG4gICAgICAgIGNiOiAobmV3VmFsLCBvbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGgsIG5ld1ZhbCwgb2xkVmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGhhbmRsZVZhbHVlQ2hhbmdlKGZ1bGxQYXRoOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpIHtcbiAgICBsZXQgcGFyZW50ID0gdGhpcy5vd25lcjtcbiAgICBjb25zdCBwYXRoQXJyID0gZnVsbFBhdGguc3BsaXQoJy4nKTtcbiAgICBpZiAocGF0aEFyci5sZW5ndGggPj0gMikge1xuICAgICAgcGFyZW50ID0gbmV3IEZ1bmN0aW9uKFxuICAgICAgICAnZGF0YScsXG4gICAgICAgIGByZXR1cm4gZGF0YS4ke3BhdGhBcnIuc2xpY2UoMCwgcGF0aEFyci5sZW5ndGggLSAxKS5qb2luKCcuJyl9YFxuICAgICAgKSh0aGlzLm93bmVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBrZXk6IHN0cmluZyA9IHBhdGhBcnIucG9wKCkhO1xuXG4gICAgaWYgKGlzUGxhaW5PYmplY3QobmV3VmFsdWUpKSB7XG4gICAgICBuZXcgVG9rZW4oe1xuICAgICAgICBvYmo6IHBhcmVudCxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogdGhpcy50cmF2ZXJzZURhdGEobmV3VmFsdWUsIGZ1bGxQYXRoKSxcbiAgICAgICAgY2I6IChfbmV3VmFsdWUsIF9vbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGgsIF9uZXdWYWx1ZSwgX29sZFZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcihmdWxsUGF0aCwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIGFkZExpc3RlbmVyKHBhdGg6IHN0cmluZywgY2I6IENhbGxiYWNrV2l0aFBhdGgpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbcGF0aF0pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0ucHVzaChjYik7XG4gIH1cblxuICByZW1vdmVMaXN0ZW5lcihwYXRoOiBzdHJpbmcsIGNiPzogQ2FsbGJhY2tXaXRoUGF0aCkge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IEdMT0FCTF9LRVk7XG4gICAgfVxuXG4gICAgaWYgKCFjYikge1xuICAgICAgZGVsZXRlIHRoaXMubGlzdGVuZXJzW3BhdGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICAodGhpcy5saXN0ZW5lcnNbcGF0aF0gfHwgW10pLmZpbHRlcihpdGVtID0+IGl0ZW0gPT09IGNiKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVBbGxMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMgPSB7fTtcbiAgfVxuXG4gIHRyaWdnZXIocGF0aDogc3RyaW5nLCBuZXdWYWx1ZTogYW55LCBvbGRWYWx1ZTogYW55KSB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gR0xPQUJMX0tFWTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubGlzdGVuZXJzW3BhdGhdKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyc1twYXRoXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdLmZvckVhY2goY2IgPT4gY2IobmV3VmFsdWUsIG9sZFZhbHVlLCBwYXRoKSk7XG5cbiAgICAvLyDmlLnlj5jkuoblr7nosaHvvIzpgqPkuYjlrZDnuqfkuZ/lupTor6XmlLbliLDpgJrnn6VcbiAgICBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVycykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKGtleSAhPT0gcGF0aCAmJiBrZXkuc3RhcnRzV2l0aChwYXRoKSkge1xuICAgICAgICBjb25zdCBrID0ga2V5LnJlcGxhY2UocGF0aCArICcuJywgJycpO1xuICAgICAgICBjb25zdCBvbGRWID0gZ2V0VmFsdWUob2xkVmFsdWUsIGspO1xuICAgICAgICBjb25zdCBuZXdWID0gZ2V0VmFsdWUobmV3VmFsdWUsIGspO1xuICAgICAgICB0aGlzLmxpc3RlbmVyc1trZXldLmZvckVhY2goY2IgPT4gY2IobmV3Viwgb2xkViwga2V5KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAodGhpcy5saXN0ZW5lcnNbR0xPQUJMX0tFWV0gfHwgW10pLmZvckVhY2goY2IgPT5cbiAgICAgIGNiKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgcGF0aClcbiAgICApO1xuICB9XG59XG5cbi8vIGNvbnN0IG93bmVyOiBhbnkgPSB7fTtcblxuLy8gY29uc3Qgd2F0Y2hlciA9IG5ldyBXYXRjaGVyKG93bmVyLCB7XG4vLyAgIGE6IDEwLFxuLy8gICBiOiB7XG4vLyAgICAgYzogMTIsXG4vLyAgIH0sXG4vLyB9KTtcblxuLy8gd2F0Y2hlci5hZGRMaXN0ZW5lcignYicsIChwMSwgcDIpID0+IHtcbi8vICAgY29uc29sZS5sb2coJ2IgY2hhbmdlZCcsIHAxLCBwMik7XG4vLyB9KTtcblxuLy8gd2F0Y2hlci5hZGRMaXN0ZW5lcignYi5jJywgKHAxLCBwMikgPT4ge1xuLy8gICBjb25zb2xlLmxvZygnYi5jIGNoYW5nZWQnLCBwMSwgcDIpO1xuLy8gfSk7XG5cbi8vIG93bmVyLmIgPSB7IGM6IDE1IH07XG4vLyBvd25lci5iLmMgPSAnd2FoYWhhaGEnO1xuXG5leHBvcnQgZGVmYXVsdCBXYXRjaGVyO1xuIiwiaW1wb3J0IE1WVk0gZnJvbSAnLi9NVlZNJztcblxuY29uc3QgaW5pdGlhbERhdGEgPSAoKSA9PiAoe1xuICBuYW1lOiAnSm9obicsXG4gIGFnZTogMTAsXG4gIGdlbmRlcjogMSxcbiAgc3VibWl0aW5nOiBmYWxzZSxcbiAgY3VycmVudFRpbWU6IG5ldyBEYXRlKCksXG4gIGV4dHJhOiB7XG4gICAgbGlrZTogJ2dhbWUnLFxuICB9LFxuICBzaG93SW5mbzogdHJ1ZSxcbiAgbGlzdDogW3sgbmFtZTogJ3lxeicgfSwgeyBuYW1lOiAnc2hlbmppbmd3ZWknIH1dLFxufSk7XG5cbm5ldyBNVlZNKHtcbiAgZWw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSEsXG4gIGRhdGE6IGluaXRpYWxEYXRhKCksXG4gIGNyZWF0ZWQodGhpczogYW55KSB7XG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHRoaXMuY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIH0sIDEwMDApO1xuICB9LFxuICBkZXN0cm95ZWQodGhpczogYW55KSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgfSxcbiAgY29tcHV0ZWQ6IHtcbiAgICBnZW5kZXJUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuZGVyID09IDEgPyAn55S3JyA6ICflpbMnO1xuICAgIH0sXG4gICAgY3VycmVudFRpbWVTdHIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZS50b0xvY2FsZVN0cmluZygpO1xuICAgIH0sXG4gIH0sXG4gIHdhdGNoOiB7XG4gICAgY3VycmVudFRpbWU6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gICAgfSxcbiAgfSxcbiAgbWV0aG9kczoge1xuICAgIGNoYW5nZUdlbmRlciguLi5hcmdzOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUubG9nKGFyZ3MpO1xuICAgICAgdGhpcy5nZW5kZXIgPSB0aGlzLmdlbmRlciA9PSAxID8gMCA6IDE7XG4gICAgfSxcblxuICAgIHRvZ2dsZVNob3dJbmZvKCkge1xuICAgICAgdGhpcy5zaG93SW5mbyA9ICF0aGlzLnNob3dJbmZvO1xuICAgIH0sXG5cbiAgICByZXNldCgpIHtcbiAgICAgIGNvbnN0IG5ld0RhdGEgPSBpbml0aWFsRGF0YSgpO1xuICAgICAgdGhpcy5zZXREYXRhKG5ld0RhdGEpO1xuICAgIH0sXG5cbiAgICBzdWJtaXQoKSB7XG4gICAgICB0aGlzLnN1Ym1pdGluZyA9IHRydWU7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbGVydCgn5o+Q5Lqk5oiQ5YqfJyk7XG4gICAgICAgIHRoaXMuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG51bGw7XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWUob2JqOiBhbnksIHBhdGg6IHN0cmluZywgZGVmYXVsdFZhbCA9IHVuZGVmaW5lZCkge1xuICBsZXQgdmFsID0gb2JqO1xuICB0cnkge1xuICAgIHZhbCA9IG5ldyBGdW5jdGlvbignZGF0YScsIGByZXR1cm4gZGF0YS4ke3BhdGh9YCkob2JqKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBkZWZhdWx0VmFsO1xuICB9XG4gIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWwgOiB2YWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRWYWx1ZShvYmo6IGFueSwgcGF0aDogc3RyaW5nLCB2YWw6IGFueSkge1xuICB0cnkge1xuICAgIG5ldyBGdW5jdGlvbignZGF0YScsIGBkYXRhLiR7cGF0aH09JHtKU09OLnN0cmluZ2lmeSh2YWwpfWApKG9iaik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqOiBhbnkpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEZXNjcmlwdG9yKGE6IGFueSwgYjogYW55KSB7XG4gIGZvciAobGV0IGtleSBpbiBiKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgYSxcbiAgICAgIGtleSxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYiwga2V5KVxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbihcbiAgZXhwcmVzc2lvbjogc3RyaW5nLFxuICBzY29wZU5hbWU6IHN0cmluZyA9ICd0aGlzJ1xuKSB7XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBtYXggPSBleHByZXNzaW9uLmxlbmd0aDtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBsZXQgZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIHdoaWxlIChpbmRleCA8IG1heCkge1xuICAgIGxldCBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoaW5kZXgpO1xuXG4gICAgaWYgKC8nfFwiLy50ZXN0KGNoYXIpKSB7XG4gICAgICBjb25zdCBjID0gY2hhcjtcbiAgICAgIGxldCBzdHIgPSBcIidcIjtcbiAgICAgIGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdCgrK2luZGV4KTtcbiAgICAgIHdoaWxlIChjaGFyICE9PSB1bmRlZmluZWQgJiYgY2hhciAhPT0gYykge1xuICAgICAgICBzdHIgKz0gY2hhcjtcbiAgICAgICAgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KCsraW5kZXgpO1xuICAgICAgfVxuICAgICAgcmVzdWx0ICs9IHN0cjtcbiAgICAgIHJlc3VsdCArPSBcIidcIjtcbiAgICAgIGluZGV4Kys7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBsZXQgVkFSSUFCTEVTID0gL1tBLVphLXpfXS87XG4gICAgaWYgKFZBUklBQkxFUy50ZXN0KGNoYXIpKSB7XG4gICAgICBsZXQgdmFsdWUgPSAnJztcblxuICAgICAgbGV0IHBhdGggPSAnJztcbiAgICAgIGxldCBwYXRoczogc3RyaW5nW10gPSBbXTtcbiAgICAgIHdoaWxlIChjaGFyICYmIC9bQS1aYS16XzAtOS4oKV0vLnRlc3QoY2hhcikpIHtcbiAgICAgICAgdmFsdWUgKz0gY2hhcjtcblxuICAgICAgICBpZiAoY2hhciA9PT0gJy4nKSB7XG4gICAgICAgICAgcGF0aHMucHVzaChwYXRoKTtcbiAgICAgICAgICBwYXRoID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGF0aCArPSBjaGFyO1xuICAgICAgICB9XG4gICAgICAgIGNoYXIgPSBleHByZXNzaW9uWysraW5kZXhdIHx8ICcnO1xuICAgICAgfVxuXG4gICAgICAvLyDnibnmrorlgLxcbiAgICAgIGlmIChbJ3RydWUnLCAnZmFsc2UnLCAnbnVsbCcsICd1bmRlZmluZWQnXS5pbmRleE9mKHBhdGgpID49IDApIHtcbiAgICAgICAgcmVzdWx0ICs9IHBhdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoL15bQS1aYS16XzAtOV0rJC8udGVzdChwYXRoKSkge1xuICAgICAgICAgIHBhdGhzLnB1c2gocGF0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBkZXBlbmRlbmNpZXMucHVzaChwYXRocy5qb2luKCcuJykpO1xuICAgICAgICByZXN1bHQgKz0gc2NvcGVOYW1lICsgJy5nZXRWYWx1ZShcIicgKyB2YWx1ZSArICdcIiknO1xuICAgICAgICBpbmRleCsrO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQgKz0gY2hhcjtcbiAgICBpbmRleCsrO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBleHByZXNzaW9uOiByZXN1bHQsXG4gICAgZGVwZW5kZW5jaWVzLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9SZWFsVmFsdWUodmFsdWU6IGFueSkge1xuICBpZiAoIXZhbHVlKSByZXR1cm4gdmFsdWU7XG5cbiAgaWYgKC9eWzAtOV0/KFxcLlswLTldKyk/JC8udGVzdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTnVtYmVyKHZhbHVlKTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICdudWxsJykge1xuICAgIHJldHVybiBudWxsO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5PFQgPSBhbnk+KHZhbHVlOiBBcnJheUxpa2U8VD4pOiBBcnJheTxUPiB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh2YWx1ZSk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9