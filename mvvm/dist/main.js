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
        this.traversAttr(el);
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
        const shouldRemoveAttrs = [];
        for (let i = 0, l = node.attributes.length; i < l; i++) {
            const attr = node.attributes[i];
            if (!attr)
                return;
            if (attr.name.startsWith('x-')) {
                const directiveName = attr.name.replace(/^x-/, '');
                const dd = _Directive__WEBPACK_IMPORTED_MODULE_0__["directiveMapping"][directiveName];
                if (!dd) {
                    console.warn('未知的指令：', directiveName);
                }
                else {
                    this.directives.push(new _Directive__WEBPACK_IMPORTED_MODULE_0__["default"](this.owner, node, attr.value, dd));
                }
                shouldRemoveAttrs.push(attr.name);
            }
            if (attr.name.startsWith(':')) {
                const attrName = attr.name.substr(1);
                this.parseTemplateAndSet('{{' + attr.value + '}}', (val) => {
                    // @ts-ignore
                    node[attrName] = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["toRealValue"])(val);
                });
                shouldRemoveAttrs.push(attr.name);
            }
            // @ts-ignore
            else if (attr.name.startsWith('@')) {
                const eventName = attr.name.substr(1);
                const eventFuncName = attr.value;
                if (this.owner[eventFuncName]) {
                    node.addEventListener(eventName, this.owner[eventFuncName]);
                }
                shouldRemoveAttrs.push(attr.name);
            }
            else {
                let cb = (val) => {
                    node.setAttribute(attr.name, val);
                };
                this.parseTemplateAndSet(attr.value, cb);
            }
        }
        shouldRemoveAttrs.forEach(name => node.removeAttribute(name));
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
            let scopeKeys = tpl.match(/[_-a-zA-z123456789.]+(?!.+\()/g);
            const parsed = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["parseExpression"])(tpl, 'this.owner');
            scopeKeys = parsed.dependencies;
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
            if (!formNode) {
                result = valueRegexp.exec(template);
            }
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
                const val = calValue();
                // 防止表单元素光标出错
                if (formNode) {
                    if (formNode.value === val) {
                        return;
                    }
                }
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
/*! exports provided: directiveMapping, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "directiveMapping", function() { return directiveMapping; });
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
        this.$owner.$watcher.addListener(path, val => {
            if (this.config.update) {
                this.config.update.call(this, el, { value: val, expression: path });
            }
        });
        this.config.bind.call(this, el, {
            value: Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getValue"])(this.$owner, path),
            expression: path,
        });
    }
    destroy() {
        if (this.config.unbind) {
            this.config.unbind.call(this, this.$el);
        }
    }
}
const directiveMapping = {};
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
    _Directive__WEBPACK_IMPORTED_MODULE_2__["directiveMapping"][name] = config;
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
        el.value = binding.value;
    },
    unbind(el) {
        el.removeEventListener('input', this.callback);
    },
});
MVVM.directive('show', (el, binding) => {
    el.style.display = binding.value ? '' : 'none';
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
/*! exports provided: getValue, setValue, isPlainObject, mergeDescriptor, parseExpression, toRealValue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getValue", function() { return getValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setValue", function() { return setValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPlainObject", function() { return isPlainObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeDescriptor", function() { return mergeDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseExpression", function() { return parseExpression; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRealValue", function() { return toRealValue; });
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
            result += scopeName + '.' + value + (char || '');
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0NvbXBsaWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9EaXJlY3RpdmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01WVk0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUEwRDtBQUNIO0FBRXZELE1BQU0sUUFBUTtJQUlaLFlBQVksS0FBVTtRQUZ0QixlQUFVLEdBQWdCLEVBQUUsQ0FBQztRQUczQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVPLFNBQVMsQ0FBQyxFQUFlO1FBQy9CLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdDLE1BQU0sSUFBSSxHQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkMsT0FBTztZQUNQLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLEVBQUU7Z0JBQ3ZCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFVLENBQUM7Z0JBRWhDLElBQUksWUFBWSxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUU7b0JBQ2pDLGdCQUFnQjtvQkFDaEIsZ0NBQWdDO29CQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztvQkFDckIsSUFBSTtnQkFDTixDQUFDLENBQUM7Z0JBRUYsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQzthQUNuRDtpQkFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxFQUFFO2dCQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3RCO1NBQ0Y7SUFDSCxDQUFDO0lBRU8sV0FBVyxDQUFDLElBQWlCO1FBQ25DLE1BQU0saUJBQWlCLEdBQWEsRUFBRSxDQUFDO1FBRXZDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFaEMsSUFBSSxDQUFDLElBQUk7Z0JBQUUsT0FBTztZQUVsQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sRUFBRSxHQUFHLDJEQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUUzQyxJQUFJLENBQUMsRUFBRSxFQUFFO29CQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO2lCQUN2QztxQkFBTTtvQkFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLGtEQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN2RTtnQkFFRCxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFXLEVBQUUsRUFBRTtvQkFDakUsYUFBYTtvQkFDYixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsMERBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEMsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNuQztZQUNELGFBQWE7aUJBQ1IsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDbEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ2pDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRTtvQkFDN0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7aUJBQzdEO2dCQUVELGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbkM7aUJBQU07Z0JBQ0wsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRTtvQkFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDLENBQUM7Z0JBRUYsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDMUM7U0FDRjtRQUVELGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRU8sbUJBQW1CLENBQ3pCLFFBQWdCLEVBQ2hCLFlBQW1DLEVBQ25DLFFBQWM7UUFFZCxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUM7UUFFbkMsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QyxJQUFJLFlBQVksR0FBYSxFQUFFLENBQUM7UUFDaEMsSUFBSSxXQUFXLEdBSVYsRUFBRSxDQUFDO1FBRVIsT0FBTyxNQUFNLEVBQUU7WUFDYixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDO1lBQ3pCLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxTQUFTLEdBQWEsR0FBRyxDQUFDLEtBQUssQ0FDakMsZ0NBQWdDLENBQzFCLENBQUM7WUFFVCxNQUFNLE1BQU0sR0FBRyw4REFBZSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUNsRCxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztZQUVoQyxNQUFNLEVBQUUsR0FBRyxJQUFJLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsRSxZQUFZLEdBQUcsQ0FBQyxHQUFHLFlBQVksRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1lBQy9DLFdBQVcsR0FBRztnQkFDWixHQUFHLFdBQVc7Z0JBQ2Q7b0JBQ0UsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLFFBQVEsRUFBRSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU07b0JBQ2hDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztpQkFDMUI7YUFDRixDQUFDO1lBRUYsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNyQztTQUNGO1FBRUQsTUFBTSxRQUFRLEdBQUcsR0FBRyxFQUFFO1lBQ3BCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNoQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsRCxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM1RCxLQUFLLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUM5QixLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FDckIsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFDdkIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQ3RELENBQUM7Z0JBQ0YsT0FBTyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7YUFDbkM7WUFFRCxLQUFLLElBQUksUUFBUSxDQUFDLEtBQUssQ0FDckIsT0FBTyxFQUNQLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FDL0MsQ0FBQztZQUVGLE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQyxDQUFDO1FBRUYsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN2QixNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUU7Z0JBQ3BCLE1BQU0sR0FBRyxHQUFHLFFBQVEsRUFBRSxDQUFDO2dCQUN2QixhQUFhO2dCQUNiLElBQUksUUFBUSxFQUFFO29CQUNaLElBQUksUUFBUSxDQUFDLEtBQUssS0FBSyxHQUFHLEVBQUU7d0JBQzFCLE9BQU87cUJBQ1I7aUJBQ0Y7Z0JBQ0QsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDO1lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUM3QyxRQUFRLEVBQUUsQ0FBQztRQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRWMsdUVBQVEsRUFBQzs7Ozs7Ozs7Ozs7OztBQzVLeEI7QUFBQTtBQUFBO0FBQW1DO0FBWW5DLE1BQU0sU0FBUztJQUtiLFlBQ0UsS0FBVyxFQUNYLEVBQWUsRUFDZixJQUFZLEVBQ1osTUFBdUI7UUFFdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUVwQixJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtZQUNoQyxJQUFJLENBQUMsTUFBTSxHQUFHO2dCQUNaLElBQUksRUFBRSxNQUFNO2dCQUNaLE1BQU0sRUFBRSxNQUFNO2FBQ2YsQ0FBQztTQUNIO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUN0QjtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDM0MsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ3JFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUM5QixLQUFLLEVBQUUsdURBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztZQUNsQyxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekM7SUFDSCxDQUFDO0NBQ0Y7QUFFTSxNQUFNLGdCQUFnQixHQUF1QyxFQUFFLENBQUM7QUFFeEQsd0VBQVMsRUFBQzs7Ozs7Ozs7Ozs7OztBQ3pEekI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFnQztBQUNHO0FBQzZCO0FBQzlCO0FBV2xDLE1BQU0sSUFBSTtJQVdSLFlBQVksTUFBa0I7UUFDNUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxnREFBTyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGlEQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBWTtRQUNsQixJQUFJLENBQUMsT0FBTztZQUFFLE9BQU87UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDL0IsYUFBYTtZQUNiLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sY0FBYztRQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRU8sWUFBWTtRQUNsQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFFNUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzFDLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xDLE9BQU87YUFDUjtZQUNELFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sV0FBVztRQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdDLGFBQWE7WUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7QUFuRU0sY0FBUyxHQUFHLFVBQVMsSUFBWSxFQUFFLE1BQXVCO0lBQy9ELDJEQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFvRUosT0FBTztBQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO0lBQ3RCLElBQUksQ0FBQyxFQUFPLEVBQUUsT0FBTztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBTSxFQUFFLEVBQUU7WUFDekIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDM0IsdURBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDO1FBQ0YsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDNUMsRUFBRSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxNQUFNLENBQUMsRUFBTyxFQUFFLE9BQU87UUFDckIsRUFBRSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFDRCxNQUFNLENBQUMsRUFBRTtRQUNQLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDRixDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUNyQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNqRCxDQUFDLENBQUMsQ0FBQztBQUVZLG1FQUFJLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUMzR3BCO0FBQUE7QUFBbUU7QUFLbkUsTUFBTSxLQUFLO0lBR1QsWUFBWSxNQUEyRDtRQUNyRSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLE1BQU0sQ0FBQztRQUV2QyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7WUFDOUIsVUFBVSxFQUFFLElBQUk7WUFDaEIsWUFBWSxFQUFFLElBQUk7WUFDbEIsR0FBRyxFQUFFLFNBQVMsY0FBYztnQkFDMUIsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3JCLENBQUM7WUFDRCxHQUFHLEVBQUUsU0FBUyxjQUFjLENBQUMsS0FBSztnQkFDaEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDN0IsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ3BCLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRTtvQkFDdEIsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDckI7WUFDSCxDQUFDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBRTVCLE1BQU0sT0FBTztJQUtYLFlBQVksS0FBVSxFQUFFLElBQVM7UUFIakMsY0FBUyxHQUVMLEVBQUUsQ0FBQztRQUVMLDhEQUFlLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0lBRUQsWUFBWSxDQUFDLElBQVMsRUFBRSxJQUFJLEdBQUcsRUFBRTtRQUMvQixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUVoRCxJQUFJLEtBQUssQ0FBQztnQkFDUixHQUFHLEVBQUUsTUFBTTtnQkFDWCxHQUFHO2dCQUNILEtBQUssRUFBRSw0REFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQztvQkFDeEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ2IsRUFBRSxFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFO29CQUN2QixJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDckQsQ0FBQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELGlCQUFpQixDQUFDLFFBQWdCLEVBQUUsUUFBYSxFQUFFLFFBQWE7UUFDOUQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDdkIsTUFBTSxHQUFHLElBQUksUUFBUSxDQUNuQixNQUFNLEVBQ04sZUFBZSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUNoRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNmO1FBRUQsTUFBTSxHQUFHLEdBQVcsT0FBTyxDQUFDLEdBQUcsRUFBRyxDQUFDO1FBRW5DLElBQUksNERBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUMzQixJQUFJLEtBQUssQ0FBQztnQkFDUixHQUFHLEVBQUUsTUFBTTtnQkFDWCxHQUFHO2dCQUNILEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7Z0JBQzVDLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRTtvQkFDM0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3pELENBQUM7YUFDRixDQUFDLENBQUM7U0FDSjtRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsV0FBVyxDQUFDLElBQVksRUFBRSxFQUFvQjtRQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsSUFBSSxHQUFHLFVBQVUsQ0FBQztTQUNuQjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQzNCO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELGNBQWMsQ0FBQyxJQUFZLEVBQUUsRUFBcUI7UUFDaEQsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULElBQUksR0FBRyxVQUFVLENBQUM7U0FDbkI7UUFFRCxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1AsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdCO2FBQU07WUFDTCxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzFEO0lBQ0gsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsT0FBTyxDQUFDLElBQVksRUFBRSxRQUFhLEVBQUUsUUFBYTtRQUNoRCxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsSUFBSSxHQUFHLFVBQVUsQ0FBQztTQUNuQjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQzNCO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWpFLG9CQUFvQjtRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDeEMsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxJQUFJLEdBQUcsdURBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sSUFBSSxHQUFHLHVEQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDeEQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FDOUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQzdCLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFFRCx5QkFBeUI7QUFFekIsdUNBQXVDO0FBQ3ZDLFdBQVc7QUFDWCxTQUFTO0FBQ1QsYUFBYTtBQUNiLE9BQU87QUFDUCxNQUFNO0FBRU4seUNBQXlDO0FBQ3pDLHNDQUFzQztBQUN0QyxNQUFNO0FBRU4sMkNBQTJDO0FBQzNDLHdDQUF3QztBQUN4QyxNQUFNO0FBRU4sdUJBQXVCO0FBQ3ZCLDBCQUEwQjtBQUVYLHNFQUFPLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUNuS3ZCO0FBQUE7QUFBMEI7QUFFMUIsTUFBTSxXQUFXLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QixJQUFJLEVBQUUsTUFBTTtJQUNaLEdBQUcsRUFBRSxFQUFFO0lBQ1AsTUFBTSxFQUFFLENBQUM7SUFDVCxTQUFTLEVBQUUsS0FBSztJQUNoQixXQUFXLEVBQUUsSUFBSSxJQUFJLEVBQUU7SUFDdkIsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLE1BQU07S0FDYjtJQUNELFFBQVEsRUFBRSxJQUFJO0lBQ2QsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLENBQUM7Q0FDakQsQ0FBQyxDQUFDO0FBRUgsSUFBSSw2Q0FBSSxDQUFDO0lBQ1AsRUFBRSxFQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFFO0lBQ25DLElBQUksRUFBRSxXQUFXLEVBQUU7SUFDbkIsT0FBTztRQUNMLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDaEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELE9BQU87UUFDTCxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDRCxRQUFRLEVBQUU7UUFDUixVQUFVO1lBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDdEMsQ0FBQztRQUNELGNBQWM7WUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDM0MsQ0FBQztLQUNGO0lBQ0QsT0FBTyxFQUFFO1FBQ1AsWUFBWTtZQUNWLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFFRCxjQUFjO1lBQ1osSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDakMsQ0FBQztRQUVELEtBQUs7WUFDSCxNQUFNLE9BQU8sR0FBRyxXQUFXLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFFRCxNQUFNO1lBQ0osSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFFdEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDekIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRVksbUVBQUksRUFBQzs7Ozs7Ozs7Ozs7OztBQzNEcEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBTyxTQUFTLFFBQVEsQ0FBQyxHQUFRLEVBQUUsSUFBWSxFQUFFLFVBQVUsR0FBRyxTQUFTO0lBQ3JFLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNkLElBQUk7UUFDRixHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFLGVBQWUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN4RDtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFDRCxPQUFPLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQzlDLENBQUM7QUFFTSxTQUFTLFFBQVEsQ0FBQyxHQUFRLEVBQUUsSUFBWSxFQUFFLEdBQVE7SUFDdkQsSUFBSTtRQUNGLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNsRTtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTztLQUNSO0FBQ0gsQ0FBQztBQUVNLFNBQVMsYUFBYSxDQUFDLEdBQVE7SUFDcEMsT0FBTyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUM7QUFDL0QsQ0FBQztBQUVNLFNBQVMsZUFBZSxDQUFDLENBQU0sRUFBRSxDQUFNO0lBQzVDLEtBQUssSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO1FBQ2pCLE1BQU0sQ0FBQyxjQUFjLENBQ25CLENBQUMsRUFDRCxHQUFHO1FBQ0gsYUFBYTtRQUNiLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQ3hDLENBQUM7S0FDSDtBQUNILENBQUM7QUFFTSxTQUFTLGVBQWUsQ0FBQyxVQUFrQixFQUFFLFlBQW9CLE1BQU07SUFDNUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUM1QixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxZQUFZLEdBQWEsRUFBRSxDQUFDO0lBRWhDLE9BQU8sS0FBSyxHQUFHLEdBQUcsRUFBRTtRQUNsQixJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXBDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQixNQUFNLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDZixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDZCxJQUFJLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFO2dCQUN2QyxHQUFHLElBQUksSUFBSSxDQUFDO2dCQUNaLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDbkM7WUFDRCxNQUFNLElBQUksR0FBRyxDQUFDO1lBQ2QsTUFBTSxJQUFJLEdBQUcsQ0FBQztZQUNkLEtBQUssRUFBRSxDQUFDO1lBQ1IsU0FBUztTQUNWO1FBRUQsSUFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDO1FBQzVCLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFFZixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxJQUFJLEtBQUssR0FBYSxFQUFFLENBQUM7WUFDekIsT0FBTyxJQUFJLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUMzQyxLQUFLLElBQUksSUFBSSxDQUFDO2dCQUVkLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtvQkFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakIsSUFBSSxHQUFHLEVBQUUsQ0FBQztpQkFDWDtxQkFBTTtvQkFDTCxJQUFJLElBQUksSUFBSSxDQUFDO2lCQUNkO2dCQUNELElBQUksR0FBRyxVQUFVLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUM1QjtZQUVELElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNoQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xCO1lBRUQsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxJQUFJLFNBQVMsR0FBRyxHQUFHLEdBQUcsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELEtBQUssRUFBRSxDQUFDO1lBQ1IsU0FBUztTQUNWO1FBRUQsTUFBTSxJQUFJLElBQUksQ0FBQztRQUNmLEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFFRCxPQUFPO1FBQ0wsVUFBVSxFQUFFLE1BQU07UUFDbEIsWUFBWTtLQUNiLENBQUM7QUFDSixDQUFDO0FBRU0sU0FBUyxXQUFXLENBQUMsS0FBVTtJQUNwQyxJQUFJLENBQUMsS0FBSztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBRXpCLElBQUkscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3JDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3RCO1NBQU0sSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFO1FBQzNCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7U0FBTSxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUU7UUFDNUIsT0FBTyxLQUFLLENBQUM7S0FDZDtTQUFNLElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtRQUMzQixPQUFPLElBQUksQ0FBQztLQUNiO1NBQU0sSUFBSSxLQUFLLEtBQUssV0FBVyxFQUFFO1FBQ2hDLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCBEaXJlY3RpdmUsIHsgZGlyZWN0aXZlTWFwcGluZyB9IGZyb20gJy4vRGlyZWN0aXZlJztcbmltcG9ydCB7IHBhcnNlRXhwcmVzc2lvbiwgdG9SZWFsVmFsdWUgfSBmcm9tICcuL3V0aWxzJztcblxuY2xhc3MgQ29tcGlsZXIge1xuICBvd25lcjogYW55O1xuICBkaXJlY3RpdmVzOiBEaXJlY3RpdmVbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKG93bmVyOiBhbnkpIHtcbiAgICB0aGlzLm93bmVyID0gb3duZXI7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMudHJhdmVyc0VMKHRoaXMub3duZXIuJGVsKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5kaXJlY3RpdmVzLmZvckVhY2goZCA9PiBkLmRlc3Ryb3koKSk7XG4gIH1cblxuICBwcml2YXRlIHRyYXZlcnNFTChlbDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLnRyYXZlcnNBdHRyKGVsKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IGVsLmNoaWxkTm9kZXNbaV07XG5cbiAgICAgIC8vIHRleHRcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIGxldCBub2RlVmFsdWUgPSBub2RlLm5vZGVWYWx1ZSE7XG5cbiAgICAgICAgbGV0IHNldE5vZGVWYWx1ZSA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIGNocm9tZSDkuI3kvJrop6blj5Hph43nu5hcbiAgICAgICAgICAvLyBpZiAobm9kZS5ub2RlVmFsdWUgIT09IHZhbCkge1xuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gdmFsO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQobm9kZVZhbHVlLCBzZXROb2RlVmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIHRoaXMudHJhdmVyc0VMKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhdmVyc0F0dHIobm9kZTogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBzaG91bGRSZW1vdmVBdHRyczogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgYXR0ciA9IG5vZGUuYXR0cmlidXRlc1tpXTtcblxuICAgICAgaWYgKCFhdHRyKSByZXR1cm47XG5cbiAgICAgIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aCgneC0nKSkge1xuICAgICAgICBjb25zdCBkaXJlY3RpdmVOYW1lID0gYXR0ci5uYW1lLnJlcGxhY2UoL154LS8sICcnKTtcbiAgICAgICAgY29uc3QgZGQgPSBkaXJlY3RpdmVNYXBwaW5nW2RpcmVjdGl2ZU5hbWVdO1xuXG4gICAgICAgIGlmICghZGQpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ+acquefpeeahOaMh+S7pO+8micsIGRpcmVjdGl2ZU5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGlyZWN0aXZlcy5wdXNoKG5ldyBEaXJlY3RpdmUodGhpcy5vd25lciwgbm9kZSwgYXR0ci52YWx1ZSwgZGQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3VsZFJlbW92ZUF0dHJzLnB1c2goYXR0ci5uYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aCgnOicpKSB7XG4gICAgICAgIGNvbnN0IGF0dHJOYW1lID0gYXR0ci5uYW1lLnN1YnN0cigxKTtcbiAgICAgICAgdGhpcy5wYXJzZVRlbXBsYXRlQW5kU2V0KCd7eycgKyBhdHRyLnZhbHVlICsgJ319JywgKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIG5vZGVbYXR0ck5hbWVdID0gdG9SZWFsVmFsdWUodmFsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2hvdWxkUmVtb3ZlQXR0cnMucHVzaChhdHRyLm5hbWUpO1xuICAgICAgfVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgZWxzZSBpZiAoYXR0ci5uYW1lLnN0YXJ0c1dpdGgoJ0AnKSkge1xuICAgICAgICBjb25zdCBldmVudE5hbWUgPSBhdHRyLm5hbWUuc3Vic3RyKDEpO1xuICAgICAgICBjb25zdCBldmVudEZ1bmNOYW1lID0gYXR0ci52YWx1ZTtcbiAgICAgICAgaWYgKHRoaXMub3duZXJbZXZlbnRGdW5jTmFtZV0pIHtcbiAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLm93bmVyW2V2ZW50RnVuY05hbWVdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3VsZFJlbW92ZUF0dHJzLnB1c2goYXR0ci5uYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBjYiA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgdmFsKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQoYXR0ci52YWx1ZSwgY2IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNob3VsZFJlbW92ZUF0dHJzLmZvckVhY2gobmFtZSA9PiBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKSk7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVGVtcGxhdGVBbmRTZXQoXG4gICAgdGVtcGxhdGU6IHN0cmluZyxcbiAgICBzZXROb2RlVmFsdWU6ICh2YWw6IHN0cmluZykgPT4gdm9pZCxcbiAgICBmb3JtTm9kZT86IGFueVxuICApIHtcbiAgICBjb25zdCB2YWx1ZVJlZ2V4cCA9IC97eyhbXn1dKyl9fS9nO1xuXG4gICAgbGV0IHJlc3VsdCA9IHZhbHVlUmVnZXhwLmV4ZWModGVtcGxhdGUpO1xuICAgIGxldCBhbGxTY29wZUtleXM6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGNhbENvbnRleHRzOiBBcnJheTx7XG4gICAgICBzdGFydEluZGV4OiBudW1iZXI7XG4gICAgICBlbmRJbmRleDogbnVtYmVyO1xuICAgICAgY2FsOiAoKSA9PiBzdHJpbmc7XG4gICAgfT4gPSBbXTtcblxuICAgIHdoaWxlIChyZXN1bHQpIHtcbiAgICAgIGNvbnN0IHsgaW5kZXggfSA9IHJlc3VsdDtcbiAgICAgIGxldCB0cGwgPSByZXN1bHRbMV07XG4gICAgICBsZXQgZnVsbFRwbCA9IHJlc3VsdFswXTtcbiAgICAgIGxldCBzY29wZUtleXM6IHN0cmluZ1tdID0gdHBsLm1hdGNoKFxuICAgICAgICAvW18tYS16QS16MTIzNDU2Nzg5Ll0rKD8hLitcXCgpL2dcbiAgICAgICkgYXMgYW55O1xuXG4gICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUV4cHJlc3Npb24odHBsLCAndGhpcy5vd25lcicpO1xuICAgICAgc2NvcGVLZXlzID0gcGFyc2VkLmRlcGVuZGVuY2llcztcblxuICAgICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgcGFyc2VkLmV4cHJlc3Npb24pLmJpbmQodGhpcyk7XG5cbiAgICAgIGFsbFNjb3BlS2V5cyA9IFsuLi5hbGxTY29wZUtleXMsIC4uLnNjb3BlS2V5c107XG4gICAgICBjYWxDb250ZXh0cyA9IFtcbiAgICAgICAgLi4uY2FsQ29udGV4dHMsXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFydEluZGV4OiBpbmRleCxcbiAgICAgICAgICBlbmRJbmRleDogaW5kZXggKyBmdWxsVHBsLmxlbmd0aCxcbiAgICAgICAgICBjYWw6ICgpID0+IGZuLmFwcGx5KHRoaXMpLFxuICAgICAgICB9LFxuICAgICAgXTtcblxuICAgICAgaWYgKCFmb3JtTm9kZSkge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZVJlZ2V4cC5leGVjKHRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjYWxWYWx1ZSA9ICgpID0+IHtcbiAgICAgIGxldCBsYXN0ZW5kID0gMDtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjYWxDb250ZXh0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UobGFzdGVuZCwgY2FsQ29udGV4dHNbaV0uc3RhcnRJbmRleCk7XG4gICAgICAgIHZhbHVlICs9IGNhbENvbnRleHRzW2ldLmNhbCgpO1xuICAgICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShcbiAgICAgICAgICBjYWxDb250ZXh0c1tpXS5lbmRJbmRleCxcbiAgICAgICAgICBpIDwgbCAtIDEgPyBjYWxDb250ZXh0c1tpICsgMV0uc3RhcnRJbmRleCA6IHVuZGVmaW5lZFxuICAgICAgICApO1xuICAgICAgICBsYXN0ZW5kID0gY2FsQ29udGV4dHNbaV0uZW5kSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKFxuICAgICAgICBsYXN0ZW5kLFxuICAgICAgICBjYWxDb250ZXh0c1tjYWxDb250ZXh0cy5sZW5ndGggLSAxXS5zdGFydEluZGV4XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGFsbFNjb3BlS2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGNhbFZhbHVlKCk7XG4gICAgICAgIC8vIOmYsuatouihqOWNleWFg+e0oOWFieagh+WHuumUmVxuICAgICAgICBpZiAoZm9ybU5vZGUpIHtcbiAgICAgICAgICBpZiAoZm9ybU5vZGUudmFsdWUgPT09IHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXROb2RlVmFsdWUoY2FsVmFsdWUoKSk7XG4gICAgICB9O1xuICAgICAgdGhpcy5vd25lci4kd2F0Y2hlci5hZGRMaXN0ZW5lcihrLCBsaXN0ZW5lcik7XG4gICAgICBsaXN0ZW5lcigpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBpbGVyO1xuIiwiaW1wb3J0IE1WVk0gZnJvbSAnLi9NVlZNJztcbmltcG9ydCB7IGdldFZhbHVlIH0gZnJvbSAnLi91dGlscyc7XG5cbnR5cGUgT2JqZWN0RGlyZWN0aXZlQ29uZmlnID0ge1xuICBiaW5kKHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpOiB2b2lkO1xuICB1cGRhdGU/KHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpOiB2b2lkO1xuICB1bmJpbmQ/KHRoaXM6IERpcmVjdGl2ZSwgZWw6IEhUTUxFbGVtZW50KTogdm9pZDtcbn07XG5cbnR5cGUgRnVuY3Rpb25EaXJlY3RpdmVDb25maWcgPSAoZWw6IEhUTUxFbGVtZW50LCBiaW5kaW5nOiBhbnkpID0+IHZvaWQ7XG5cbmV4cG9ydCB0eXBlIERpcmVjdGl2ZUNvbmZpZyA9IE9iamVjdERpcmVjdGl2ZUNvbmZpZyB8IEZ1bmN0aW9uRGlyZWN0aXZlQ29uZmlnO1xuXG5jbGFzcyBEaXJlY3RpdmUge1xuICBwcml2YXRlIGNvbmZpZzogT2JqZWN0RGlyZWN0aXZlQ29uZmlnO1xuICAkZWw6IEhUTUxFbGVtZW50O1xuICAkb3duZXI6IE1WVk07XG4gIFtrZXk6IHN0cmluZ106IGFueTtcbiAgY29uc3RydWN0b3IoXG4gICAgb3duZXI6IE1WVk0sXG4gICAgZWw6IEhUTUxFbGVtZW50LFxuICAgIHBhdGg6IHN0cmluZyxcbiAgICBjb25maWc6IERpcmVjdGl2ZUNvbmZpZ1xuICApIHtcbiAgICB0aGlzLiRlbCA9IGVsO1xuICAgIHRoaXMuJG93bmVyID0gb3duZXI7XG5cbiAgICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgIGJpbmQ6IGNvbmZpZyxcbiAgICAgICAgdXBkYXRlOiBjb25maWcsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG5cbiAgICB0aGlzLiRvd25lci4kd2F0Y2hlci5hZGRMaXN0ZW5lcihwYXRoLCB2YWwgPT4ge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLnVwZGF0ZSkge1xuICAgICAgICB0aGlzLmNvbmZpZy51cGRhdGUuY2FsbCh0aGlzLCBlbCwgeyB2YWx1ZTogdmFsLCBleHByZXNzaW9uOiBwYXRoIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5jb25maWcuYmluZC5jYWxsKHRoaXMsIGVsLCB7XG4gICAgICB2YWx1ZTogZ2V0VmFsdWUodGhpcy4kb3duZXIsIHBhdGgpLFxuICAgICAgZXhwcmVzc2lvbjogcGF0aCxcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnVuYmluZCkge1xuICAgICAgdGhpcy5jb25maWcudW5iaW5kLmNhbGwodGhpcywgdGhpcy4kZWwpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZGlyZWN0aXZlTWFwcGluZzogeyBba2V5OiBzdHJpbmddOiBEaXJlY3RpdmVDb25maWcgfSA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBEaXJlY3RpdmU7XG4iLCJpbXBvcnQgV2F0Y2hlciBmcm9tICcuL1dhdGNoZXInO1xuaW1wb3J0IHsgc2V0VmFsdWUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IERpcmVjdGl2ZUNvbmZpZywgZGlyZWN0aXZlTWFwcGluZyB9IGZyb20gJy4vRGlyZWN0aXZlJztcbmltcG9ydCBDb21waWxlciBmcm9tICcuL0NvbXBsaWVyJztcblxuaW50ZXJmYWNlIE1WVk1Db25maWcge1xuICBlbDogSFRNTEVsZW1lbnQ7XG4gIGRhdGE6IGFueTtcbiAgY3JlYXRlZD86ICgpID0+IHZvaWQ7XG4gIGRlc3Ryb3k/OiAoKSA9PiB2b2lkO1xuICBjb21wdXRlZDogYW55O1xuICBtZXRob2RzOiBhbnk7XG59XG5cbmNsYXNzIE1WVk0ge1xuICBzdGF0aWMgZGlyZWN0aXZlID0gZnVuY3Rpb24obmFtZTogc3RyaW5nLCBjb25maWc6IERpcmVjdGl2ZUNvbmZpZykge1xuICAgIGRpcmVjdGl2ZU1hcHBpbmdbbmFtZV0gPSBjb25maWc7XG4gIH07XG5cbiAgJGVsOiBIVE1MRWxlbWVudDtcbiAgJHdhdGNoZXI6IFdhdGNoZXI7XG4gICRjb21wbGllcjogQ29tcGlsZXI7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcblxuICBwcml2YXRlIGNvbmZpZzogTVZWTUNvbmZpZztcbiAgY29uc3RydWN0b3IoY29uZmlnOiBNVlZNQ29uZmlnKSB7XG4gICAgdGhpcy4kZWwgPSBjb25maWcuZWw7XG4gICAgdGhpcy4kd2F0Y2hlciA9IG5ldyBXYXRjaGVyKHRoaXMsIGNvbmZpZy5kYXRhKTtcbiAgICB0aGlzLiRjb21wbGllciA9IG5ldyBDb21waWxlcih0aGlzKTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIHRoaXMuaW5pdExpZmVDeWNsZXMoKTtcbiAgICB0aGlzLmluaXRNZXRob2RzKCk7XG4gICAgdGhpcy4kY29tcGxpZXIuaW5pdCgpO1xuICAgIHRoaXMuaW5pdENvbXB1dGVkKCk7XG4gICAgdGhpcy5jcmVhdGVkKHRoaXMpO1xuICB9XG5cbiAgc2V0RGF0YShuZXdEYXRhOiBhbnkpIHtcbiAgICBpZiAoIW5ld0RhdGEpIHJldHVybjtcbiAgICBPYmplY3Qua2V5cyhuZXdEYXRhKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpc1trXSA9IG5ld0RhdGFba107XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGluaXRMaWZlQ3ljbGVzKCkge1xuICAgIHRoaXNbJ2NyZWF0ZWQnXSA9ICgpID0+IHtcbiAgICAgIHRoaXMuY29uZmlnLmNyZWF0ZWQgJiYgdGhpcy5jb25maWcuY3JlYXRlZC5jYWxsKHRoaXMpO1xuICAgIH07XG5cbiAgICB0aGlzWydkZXN0cm95J10gPSAoKSA9PiB7XG4gICAgICB0aGlzLiRjb21wbGllci5kZXN0cm95KCk7XG4gICAgICB0aGlzLiR3YXRjaGVyLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgICAgdGhpcy5jb25maWcuZGVzdHJveSAmJiB0aGlzLmNvbmZpZy5kZXN0cm95LmNhbGwodGhpcyk7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdENvbXB1dGVkKCkge1xuICAgIGNvbnN0IGNvbXB1dGVkID0gdGhpcy5jb25maWcuY29tcHV0ZWQgfHwge307XG5cbiAgICBjb25zdCBjb21wdXRlZEtleXMgPSBPYmplY3Qua2V5cyhjb21wdXRlZCk7XG4gICAgdGhpcy4kd2F0Y2hlci5hZGRMaXN0ZW5lcignJywgKG4sIG8sIGtleSkgPT4ge1xuICAgICAgaWYgKGNvbXB1dGVkS2V5cy5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb21wdXRlZEtleXMuZm9yRWFjaChja2V5ID0+IHtcbiAgICAgICAgdGhpc1tja2V5XSA9IGNvbXB1dGVkW2NrZXldLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuJHdhdGNoZXIudHJpZ2dlcihja2V5LCB0aGlzW2NrZXldLCAnJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb21wdXRlZEtleXMuZm9yRWFjaChja2V5ID0+IHtcbiAgICAgIHRoaXNbY2tleV0gPSBjb21wdXRlZFtja2V5XS5jYWxsKHRoaXMpO1xuICAgICAgdGhpcy4kd2F0Y2hlci50cmlnZ2VyKGNrZXksIHRoaXNbY2tleV0sICcnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdE1ldGhvZHMoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5jb25maWcubWV0aG9kcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpc1trZXldID0gdGhpcy5jb25maWcubWV0aG9kc1trZXldLmJpbmQodGhpcyk7XG4gICAgfSk7XG4gIH1cbn1cblxuLy8g5YaF572u5oyH5LukXG5NVlZNLmRpcmVjdGl2ZSgnbW9kZWwnLCB7XG4gIGJpbmQoZWw6IGFueSwgYmluZGluZykge1xuICAgIHRoaXMuY2FsbGJhY2sgPSAoZTogYW55KSA9PiB7XG4gICAgICBjb25zdCB2YWwgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgIHNldFZhbHVlKHRoaXMuJG93bmVyLCBiaW5kaW5nLmV4cHJlc3Npb24sIHZhbCk7XG4gICAgfTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuY2FsbGJhY2spO1xuICAgIGVsLnZhbHVlID0gYmluZGluZy52YWx1ZTtcbiAgfSxcbiAgdXBkYXRlKGVsOiBhbnksIGJpbmRpbmcpIHtcbiAgICBlbC52YWx1ZSA9IGJpbmRpbmcudmFsdWU7XG4gIH0sXG4gIHVuYmluZChlbCkge1xuICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5jYWxsYmFjayk7XG4gIH0sXG59KTtcblxuTVZWTS5kaXJlY3RpdmUoJ3Nob3cnLCAoZWwsIGJpbmRpbmcpID0+IHtcbiAgZWwuc3R5bGUuZGlzcGxheSA9IGJpbmRpbmcudmFsdWUgPyAnJyA6ICdub25lJztcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNVlZNO1xuIiwiaW1wb3J0IHsgZ2V0VmFsdWUsIGlzUGxhaW5PYmplY3QsIG1lcmdlRGVzY3JpcHRvciB9IGZyb20gJy4vdXRpbHMnO1xuXG50eXBlIENhbGxiYWNrID0gKHZhbDogYW55LCBvbGRWYWx1ZTogYW55KSA9PiB2b2lkO1xudHlwZSBDYWxsYmFja1dpdGhQYXRoID0gKHZhbDogYW55LCBvbGRWYWx1ZTogYW55LCBwYXRoOiBzdHJpbmcpID0+IHZvaWQ7XG5cbmNsYXNzIFRva2VuIHtcbiAgcHJpdmF0ZSB2YWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogeyBvYmo6IGFueTsga2V5OiBzdHJpbmc7IHZhbHVlOiBhbnk7IGNiOiBDYWxsYmFjayB9KSB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzO1xuICAgIGNvbnN0IHsga2V5LCB2YWx1ZSwgb2JqLCBjYiB9ID0gY29uZmlnO1xuXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiByZWFjdGl2ZVNldHRlcigpIHtcbiAgICAgICAgcmV0dXJuIHNjb3BlLnZhbHVlO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gcmVhY3RpdmVHZXR0ZXIodmFsdWUpIHtcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSBzY29wZS52YWx1ZTtcbiAgICAgICAgc2NvcGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgIGNiKHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgR0xPQUJMX0tFWSA9ICdHTE9BQkwnO1xuXG5jbGFzcyBXYXRjaGVyIHtcbiAgb3duZXI6IGFueTtcbiAgbGlzdGVuZXJzOiB7XG4gICAgW3BhdGg6IHN0cmluZ106IENhbGxiYWNrV2l0aFBhdGhbXTtcbiAgfSA9IHt9O1xuICBjb25zdHJ1Y3Rvcihvd25lcjogYW55LCBkYXRhOiBhbnkpIHtcbiAgICBtZXJnZURlc2NyaXB0b3Iob3duZXIsIHRoaXMudHJhdmVyc2VEYXRhKGRhdGEpKTtcbiAgICB0aGlzLm93bmVyID0gb3duZXI7XG4gIH1cblxuICB0cmF2ZXJzZURhdGEoZGF0YTogYW55LCBwYXRoID0gJycpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IChwYXRoID8gcGF0aCArICcuJyA6ICcnKSArIGtleTtcblxuICAgICAgbmV3IFRva2VuKHtcbiAgICAgICAgb2JqOiByZXN1bHQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IGlzUGxhaW5PYmplY3QoZGF0YVtrZXldKVxuICAgICAgICAgID8gdGhpcy50cmF2ZXJzZURhdGEoZGF0YVtrZXldLCBmdWxsUGF0aClcbiAgICAgICAgICA6IGRhdGFba2V5XSxcbiAgICAgICAgY2I6IChuZXdWYWwsIG9sZFZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aCwgbmV3VmFsLCBvbGRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGg6IHN0cmluZywgbmV3VmFsdWU6IGFueSwgb2xkVmFsdWU6IGFueSkge1xuICAgIGxldCBwYXJlbnQgPSB0aGlzLm93bmVyO1xuICAgIGNvbnN0IHBhdGhBcnIgPSBmdWxsUGF0aC5zcGxpdCgnLicpO1xuICAgIGlmIChwYXRoQXJyLmxlbmd0aCA+PSAyKSB7XG4gICAgICBwYXJlbnQgPSBuZXcgRnVuY3Rpb24oXG4gICAgICAgICdkYXRhJyxcbiAgICAgICAgYHJldHVybiBkYXRhLiR7cGF0aEFyci5zbGljZSgwLCBwYXRoQXJyLmxlbmd0aCAtIDEpLmpvaW4oJy4nKX1gXG4gICAgICApKHRoaXMub3duZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IGtleTogc3RyaW5nID0gcGF0aEFyci5wb3AoKSE7XG5cbiAgICBpZiAoaXNQbGFpbk9iamVjdChuZXdWYWx1ZSkpIHtcbiAgICAgIG5ldyBUb2tlbih7XG4gICAgICAgIG9iajogcGFyZW50LFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiB0aGlzLnRyYXZlcnNlRGF0YShuZXdWYWx1ZSwgZnVsbFBhdGgpLFxuICAgICAgICBjYjogKF9uZXdWYWx1ZSwgX29sZFZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aCwgX25ld1ZhbHVlLCBfb2xkVmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKGZ1bGxQYXRoLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIocGF0aDogc3RyaW5nLCBjYjogQ2FsbGJhY2tXaXRoUGF0aCkge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IEdMT0FCTF9LRVk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmxpc3RlbmVyc1twYXRoXSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyc1twYXRoXS5wdXNoKGNiKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKHBhdGg6IHN0cmluZywgY2I/OiBDYWxsYmFja1dpdGhQYXRoKSB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gR0xPQUJMX0tFWTtcbiAgICB9XG5cbiAgICBpZiAoIWNiKSB7XG4gICAgICBkZWxldGUgdGhpcy5saXN0ZW5lcnNbcGF0aF07XG4gICAgfSBlbHNlIHtcbiAgICAgICh0aGlzLmxpc3RlbmVyc1twYXRoXSB8fCBbXSkuZmlsdGVyKGl0ZW0gPT4gaXRlbSA9PT0gY2IpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUFsbExpc3RlbmVycygpIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICB9XG5cbiAgdHJpZ2dlcihwYXRoOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbcGF0aF0pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0uZm9yRWFjaChjYiA9PiBjYihuZXdWYWx1ZSwgb2xkVmFsdWUsIHBhdGgpKTtcblxuICAgIC8vIOaUueWPmOS6huWvueixoe+8jOmCo+S5iOWtkOe6p+S5n+W6lOivpeaUtuWIsOmAmuefpVxuICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoa2V5ICE9PSBwYXRoICYmIGtleS5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGsgPSBrZXkucmVwbGFjZShwYXRoICsgJy4nLCAnJyk7XG4gICAgICAgIGNvbnN0IG9sZFYgPSBnZXRWYWx1ZShvbGRWYWx1ZSwgayk7XG4gICAgICAgIGNvbnN0IG5ld1YgPSBnZXRWYWx1ZShuZXdWYWx1ZSwgayk7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2tleV0uZm9yRWFjaChjYiA9PiBjYihuZXdWLCBvbGRWLCBrZXkpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICh0aGlzLmxpc3RlbmVyc1tHTE9BQkxfS0VZXSB8fCBbXSkuZm9yRWFjaChjYiA9PlxuICAgICAgY2IobmV3VmFsdWUsIG9sZFZhbHVlLCBwYXRoKVxuICAgICk7XG4gIH1cbn1cblxuLy8gY29uc3Qgb3duZXI6IGFueSA9IHt9O1xuXG4vLyBjb25zdCB3YXRjaGVyID0gbmV3IFdhdGNoZXIob3duZXIsIHtcbi8vICAgYTogMTAsXG4vLyAgIGI6IHtcbi8vICAgICBjOiAxMixcbi8vICAgfSxcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLmFkZExpc3RlbmVyKCdiJywgKHAxLCBwMikgPT4ge1xuLy8gICBjb25zb2xlLmxvZygnYiBjaGFuZ2VkJywgcDEsIHAyKTtcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLmFkZExpc3RlbmVyKCdiLmMnLCAocDEsIHAyKSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKCdiLmMgY2hhbmdlZCcsIHAxLCBwMik7XG4vLyB9KTtcblxuLy8gb3duZXIuYiA9IHsgYzogMTUgfTtcbi8vIG93bmVyLmIuYyA9ICd3YWhhaGFoYSc7XG5cbmV4cG9ydCBkZWZhdWx0IFdhdGNoZXI7XG4iLCJpbXBvcnQgTVZWTSBmcm9tICcuL01WVk0nO1xuXG5jb25zdCBpbml0aWFsRGF0YSA9ICgpID0+ICh7XG4gIG5hbWU6ICdKb2huJyxcbiAgYWdlOiAxMCxcbiAgZ2VuZGVyOiAxLFxuICBzdWJtaXRpbmc6IGZhbHNlLFxuICBjdXJyZW50VGltZTogbmV3IERhdGUoKSxcbiAgZXh0cmE6IHtcbiAgICBsaWtlOiAnZ2FtZScsXG4gIH0sXG4gIHNob3dJbmZvOiB0cnVlLFxuICBsaXN0OiBbeyBuYW1lOiAneXF6JyB9LCB7IG5hbWU6ICdzaGVuamluZ3dlaScgfV0sXG59KTtcblxubmV3IE1WVk0oe1xuICBlbDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpISxcbiAgZGF0YTogaW5pdGlhbERhdGEoKSxcbiAgY3JlYXRlZCh0aGlzOiBhbnkpIHtcbiAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5jdXJyZW50VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgfSwgMTAwMCk7XG4gIH0sXG4gIGRlc3Ryb3kodGhpczogYW55KSB7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgfSxcbiAgY29tcHV0ZWQ6IHtcbiAgICBnZW5kZXJUZXh0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuZGVyID09IDEgPyAn55S3JyA6ICflpbMnO1xuICAgIH0sXG4gICAgY3VycmVudFRpbWVTdHIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50VGltZS50b0xvY2FsZVN0cmluZygpO1xuICAgIH0sXG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBjaGFuZ2VHZW5kZXIoKSB7XG4gICAgICB0aGlzLmdlbmRlciA9IHRoaXMuZ2VuZGVyID09IDEgPyAwIDogMTtcbiAgICB9LFxuXG4gICAgdG9nZ2xlU2hvd0luZm8oKSB7XG4gICAgICB0aGlzLnNob3dJbmZvID0gIXRoaXMuc2hvd0luZm87XG4gICAgfSxcblxuICAgIHJlc2V0KCkge1xuICAgICAgY29uc3QgbmV3RGF0YSA9IGluaXRpYWxEYXRhKCk7XG4gICAgICB0aGlzLnNldERhdGEobmV3RGF0YSk7XG4gICAgfSxcblxuICAgIHN1Ym1pdCgpIHtcbiAgICAgIHRoaXMuc3VibWl0aW5nID0gdHJ1ZTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGFsZXJ0KCfmj5DkuqTmiJDlip8nKTtcbiAgICAgICAgdGhpcy5zdWJtaXRpbmcgPSBmYWxzZTtcbiAgICAgIH0sIDEwMDApO1xuICAgIH0sXG4gIH0sXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbnVsbDtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRWYWx1ZShvYmo6IGFueSwgcGF0aDogc3RyaW5nLCBkZWZhdWx0VmFsID0gdW5kZWZpbmVkKSB7XG4gIGxldCB2YWwgPSBvYmo7XG4gIHRyeSB7XG4gICAgdmFsID0gbmV3IEZ1bmN0aW9uKCdkYXRhJywgYHJldHVybiBkYXRhLiR7cGF0aH1gKShvYmopO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWw7XG4gIH1cbiAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbCA6IHZhbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFZhbHVlKG9iajogYW55LCBwYXRoOiBzdHJpbmcsIHZhbDogYW55KSB7XG4gIHRyeSB7XG4gICAgbmV3IEZ1bmN0aW9uKCdkYXRhJywgYGRhdGEuJHtwYXRofT0ke0pTT04uc3RyaW5naWZ5KHZhbCl9YCkob2JqKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQbGFpbk9iamVjdChvYmo6IGFueSkge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURlc2NyaXB0b3IoYTogYW55LCBiOiBhbnkpIHtcbiAgZm9yIChsZXQga2V5IGluIGIpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICBhLFxuICAgICAga2V5LFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiLCBrZXkpXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VFeHByZXNzaW9uKGV4cHJlc3Npb246IHN0cmluZywgc2NvcGVOYW1lOiBzdHJpbmcgPSAndGhpcycpIHtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IG1heCA9IGV4cHJlc3Npb24ubGVuZ3RoO1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGxldCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG5cbiAgd2hpbGUgKGluZGV4IDwgbWF4KSB7XG4gICAgbGV0IGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdChpbmRleCk7XG5cbiAgICBpZiAoLyd8XCIvLnRlc3QoY2hhcikpIHtcbiAgICAgIGNvbnN0IGMgPSBjaGFyO1xuICAgICAgbGV0IHN0ciA9IFwiJ1wiO1xuICAgICAgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KCsraW5kZXgpO1xuICAgICAgd2hpbGUgKGNoYXIgIT09IHVuZGVmaW5lZCAmJiBjaGFyICE9PSBjKSB7XG4gICAgICAgIHN0ciArPSBjaGFyO1xuICAgICAgICBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoKytpbmRleCk7XG4gICAgICB9XG4gICAgICByZXN1bHQgKz0gc3RyO1xuICAgICAgcmVzdWx0ICs9IFwiJ1wiO1xuICAgICAgaW5kZXgrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGxldCBWQVJJQUJMRVMgPSAvW0EtWmEtel9dLztcbiAgICBpZiAoVkFSSUFCTEVTLnRlc3QoY2hhcikpIHtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuXG4gICAgICBsZXQgcGF0aCA9ICcnO1xuICAgICAgbGV0IHBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgd2hpbGUgKGNoYXIgJiYgL1tBLVphLXpfMC05LigpXS8udGVzdChjaGFyKSkge1xuICAgICAgICB2YWx1ZSArPSBjaGFyO1xuXG4gICAgICAgIGlmIChjaGFyID09PSAnLicpIHtcbiAgICAgICAgICBwYXRocy5wdXNoKHBhdGgpO1xuICAgICAgICAgIHBhdGggPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRoICs9IGNoYXI7XG4gICAgICAgIH1cbiAgICAgICAgY2hhciA9IGV4cHJlc3Npb25bKytpbmRleF07XG4gICAgICB9XG5cbiAgICAgIGlmICgvXltBLVphLXpfMC05XSskLy50ZXN0KHBhdGgpKSB7XG4gICAgICAgIHBhdGhzLnB1c2gocGF0aCk7XG4gICAgICB9XG5cbiAgICAgIGRlcGVuZGVuY2llcy5wdXNoKHBhdGhzLmpvaW4oJy4nKSk7XG4gICAgICByZXN1bHQgKz0gc2NvcGVOYW1lICsgJy4nICsgdmFsdWUgKyAoY2hhciB8fCAnJyk7XG4gICAgICBpbmRleCsrO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcmVzdWx0ICs9IGNoYXI7XG4gICAgaW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZXhwcmVzc2lvbjogcmVzdWx0LFxuICAgIGRlcGVuZGVuY2llcyxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUmVhbFZhbHVlKHZhbHVlOiBhbnkpIHtcbiAgaWYgKCF2YWx1ZSkgcmV0dXJuIHZhbHVlO1xuXG4gIGlmICgvXlswLTldPyhcXC5bMC05XSspPyQvLnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIE51bWJlcih2YWx1ZSk7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAnbnVsbCcpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==