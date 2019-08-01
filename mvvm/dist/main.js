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

/***/ "./src/Directive.ts":
/*!**************************!*\
  !*** ./src/Directive.ts ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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



class MVVM {
    constructor(config) {
        this.directives = [];
        this.$el = config.el;
        this.$watcher = new _Watcher__WEBPACK_IMPORTED_MODULE_0__["default"](this, config.data);
        this.config = config;
        this.initLifeCycles();
        this.initMethods();
        this.traversEL(config.el);
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
            this.directives.forEach(d => d.destroy());
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
                const dd = MVVM.directiveDefinitions[directiveName];
                if (!dd) {
                    console.warn('未知的指令：', directiveName);
                }
                else {
                    this.directives.push(new _Directive__WEBPACK_IMPORTED_MODULE_2__["default"](this, node, attr.value, dd));
                }
                shouldRemoveAttrs.push(attr.name);
            }
            if (attr.name.startsWith(':')) {
                const attrName = attr.name.substr(1);
                this.parseTemplateAndSet(attr.value, (val) => {
                    // @ts-ignore
                    node[attrName] = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["toRealValue"])(val);
                });
                shouldRemoveAttrs.push(attr.name);
            }
            // @ts-ignore
            else if (attr.name.startsWith('@')) {
                const eventName = attr.name.substr(1);
                const eventFuncName = attr.value;
                if (this[eventFuncName]) {
                    node.addEventListener(eventName, this[eventFuncName]);
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
            const parsed = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["parseExpression"])(tpl);
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
            this.$watcher.addListener(k, listener);
            listener();
        });
    }
}
MVVM.directiveDefinitions = {};
MVVM.directive = function (name, config) {
    MVVM.directiveDefinitions[name] = config;
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
// watcher.addListener('b', (a, b) => {
//   console.log('b changed', a, b);
// });
// watcher.addListener('b.c', (a, b) => {
//   console.log('b.c changed', a, b);
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
function parseExpression(expression) {
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
            result += 'this.' + value + (char || '');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0RpcmVjdGl2ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTVZWTS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvV2F0Y2hlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFtQztBQVluQyxNQUFNLFNBQVM7SUFLYixZQUNFLEtBQVcsRUFDWCxFQUFlLEVBQ2YsSUFBWSxFQUNaLE1BQXVCO1FBRXZCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFFcEIsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQUU7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IFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgTVZWTSBmcm9tICcuL01WVk0nO1xuaW1wb3J0IHsgZ2V0VmFsdWUgfSBmcm9tICcuL3V0aWxzJztcblxudHlwZSBPYmplY3REaXJlY3RpdmVDb25maWcgPSB7XG4gIGJpbmQodGhpczogRGlyZWN0aXZlLCBlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IGFueSk6IHZvaWQ7XG4gIHVwZGF0ZT8odGhpczogRGlyZWN0aXZlLCBlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IGFueSk6IHZvaWQ7XG4gIHVuYmluZD8odGhpczogRGlyZWN0aXZlLCBlbDogSFRNTEVsZW1lbnQpOiB2b2lkO1xufTtcblxudHlwZSBGdW5jdGlvbkRpcmVjdGl2ZUNvbmZpZyA9IChlbDogSFRNTEVsZW1lbnQsIGJpbmRpbmc6IGFueSkgPT4gdm9pZDtcblxuZXhwb3J0IHR5cGUgRGlyZWN0aXZlQ29uZmlnID0gT2JqZWN0RGlyZWN0aXZlQ29uZmlnIHwgRnVuY3Rpb25EaXJlY3RpdmVDb25maWc7XG5cbmNsYXNzIERpcmVjdGl2ZSB7XG4gIHByaXZhdGUgY29uZmlnOiBPYmplY3REaXJlY3RpdmVDb25maWc7XG4gICRlbDogSFRNTEVsZW1lbnQ7XG4gICRvd25lcjogTVZWTTtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICBjb25zdHJ1Y3RvcihcbiAgICBvd25lcjogTVZWTSxcbiAgICBlbDogSFRNTEVsZW1lbnQsXG4gICAgcGF0aDogc3RyaW5nLFxuICAgIGNvbmZpZzogRGlyZWN0aXZlQ29uZmlnXG4gICkge1xuICAgIHRoaXMuJGVsID0gZWw7XG4gICAgdGhpcy4kb3duZXIgPSBvd25lcjtcblxuICAgIGlmICh0eXBlb2YgY29uZmlnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgICAgYmluZDogY29uZmlnLFxuICAgICAgICB1cGRhdGU6IGNvbmZpZyxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIH1cblxuICAgIHRoaXMuJG93bmVyLiR3YXRjaGVyLmFkZExpc3RlbmVyKHBhdGgsIHZhbCA9PiB7XG4gICAgICBpZiAodGhpcy5jb25maWcudXBkYXRlKSB7XG4gICAgICAgIHRoaXMuY29uZmlnLnVwZGF0ZS5jYWxsKHRoaXMsIGVsLCB7IHZhbHVlOiB2YWwsIGV4cHJlc3Npb246IHBhdGggfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbmZpZy5iaW5kLmNhbGwodGhpcywgZWwsIHtcbiAgICAgIHZhbHVlOiBnZXRWYWx1ZSh0aGlzLiRvd25lciwgcGF0aCksXG4gICAgICBleHByZXNzaW9uOiBwYXRoLFxuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jb25maWcudW5iaW5kKSB7XG4gICAgICB0aGlzLmNvbmZpZy51bmJpbmQuY2FsbCh0aGlzLCB0aGlzLiRlbCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERpcmVjdGl2ZTtcbiIsImltcG9ydCBXYXRjaGVyIGZyb20gJy4vV2F0Y2hlcic7XG5pbXBvcnQgeyBnZXRWYWx1ZSwgdG9SZWFsVmFsdWUsIHNldFZhbHVlLCBwYXJzZUV4cHJlc3Npb24gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBEaXJlY3RpdmUsIHsgRGlyZWN0aXZlQ29uZmlnIH0gZnJvbSAnLi9EaXJlY3RpdmUnO1xuXG5pbnRlcmZhY2UgTVZWTUNvbmZpZyB7XG4gIGVsOiBIVE1MRWxlbWVudDtcbiAgZGF0YTogYW55O1xuICBjcmVhdGVkPzogKCkgPT4gdm9pZDtcbiAgZGVzdHJveT86ICgpID0+IHZvaWQ7XG4gIGNvbXB1dGVkOiBhbnk7XG4gIG1ldGhvZHM6IGFueTtcbn1cblxuY2xhc3MgTVZWTSB7XG4gIHN0YXRpYyBkaXJlY3RpdmVEZWZpbml0aW9uczogeyBba2V5OiBzdHJpbmddOiBEaXJlY3RpdmVDb25maWcgfSA9IHt9O1xuICBzdGF0aWMgZGlyZWN0aXZlID0gZnVuY3Rpb24obmFtZTogc3RyaW5nLCBjb25maWc6IERpcmVjdGl2ZUNvbmZpZykge1xuICAgIE1WVk0uZGlyZWN0aXZlRGVmaW5pdGlvbnNbbmFtZV0gPSBjb25maWc7XG4gIH07XG5cbiAgJGVsOiBIVE1MRWxlbWVudDtcbiAgJHdhdGNoZXI6IFdhdGNoZXI7XG4gIHByaXZhdGUgY29uZmlnOiBNVlZNQ29uZmlnO1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG4gIHByaXZhdGUgZGlyZWN0aXZlczogRGlyZWN0aXZlW10gPSBbXTtcbiAgY29uc3RydWN0b3IoY29uZmlnOiBNVlZNQ29uZmlnKSB7XG4gICAgdGhpcy4kZWwgPSBjb25maWcuZWw7XG4gICAgdGhpcy4kd2F0Y2hlciA9IG5ldyBXYXRjaGVyKHRoaXMsIGNvbmZpZy5kYXRhKTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIHRoaXMuaW5pdExpZmVDeWNsZXMoKTtcbiAgICB0aGlzLmluaXRNZXRob2RzKCk7XG4gICAgdGhpcy50cmF2ZXJzRUwoY29uZmlnLmVsKTtcbiAgICB0aGlzLmluaXRDb21wdXRlZCgpO1xuICAgIHRoaXMuY3JlYXRlZCh0aGlzKTtcbiAgfVxuXG4gIHNldERhdGEobmV3RGF0YTogYW55KSB7XG4gICAgaWYgKCFuZXdEYXRhKSByZXR1cm47XG4gICAgT2JqZWN0LmtleXMobmV3RGF0YSkuZm9yRWFjaChrID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXNba10gPSBuZXdEYXRhW2tdO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0TGlmZUN5Y2xlcygpIHtcbiAgICB0aGlzWydjcmVhdGVkJ10gPSAoKSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZy5jcmVhdGVkICYmIHRoaXMuY29uZmlnLmNyZWF0ZWQuY2FsbCh0aGlzKTtcbiAgICB9O1xuXG4gICAgdGhpc1snZGVzdHJveSddID0gKCkgPT4ge1xuICAgICAgdGhpcy5kaXJlY3RpdmVzLmZvckVhY2goZCA9PiBkLmRlc3Ryb3koKSk7XG4gICAgICB0aGlzLiR3YXRjaGVyLnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgICAgdGhpcy5jb25maWcuZGVzdHJveSAmJiB0aGlzLmNvbmZpZy5kZXN0cm95LmNhbGwodGhpcyk7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdENvbXB1dGVkKCkge1xuICAgIGNvbnN0IGNvbXB1dGVkID0gdGhpcy5jb25maWcuY29tcHV0ZWQgfHwge307XG5cbiAgICBjb25zdCBjb21wdXRlZEtleXMgPSBPYmplY3Qua2V5cyhjb21wdXRlZCk7XG4gICAgdGhpcy4kd2F0Y2hlci5hZGRMaXN0ZW5lcignJywgKG4sIG8sIGtleSkgPT4ge1xuICAgICAgaWYgKGNvbXB1dGVkS2V5cy5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb21wdXRlZEtleXMuZm9yRWFjaChja2V5ID0+IHtcbiAgICAgICAgdGhpc1tja2V5XSA9IGNvbXB1dGVkW2NrZXldLmNhbGwodGhpcyk7XG4gICAgICAgIHRoaXMuJHdhdGNoZXIudHJpZ2dlcihja2V5LCB0aGlzW2NrZXldLCAnJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb21wdXRlZEtleXMuZm9yRWFjaChja2V5ID0+IHtcbiAgICAgIHRoaXNbY2tleV0gPSBjb21wdXRlZFtja2V5XS5jYWxsKHRoaXMpO1xuICAgICAgdGhpcy4kd2F0Y2hlci50cmlnZ2VyKGNrZXksIHRoaXNbY2tleV0sICcnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdE1ldGhvZHMoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5jb25maWcubWV0aG9kcykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpc1trZXldID0gdGhpcy5jb25maWcubWV0aG9kc1trZXldLmJpbmQodGhpcyk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHRyYXZlcnNFTChlbDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLnRyYXZlcnNBdHRyKGVsKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVsLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGU6IGFueSA9IGVsLmNoaWxkTm9kZXNbaV07XG5cbiAgICAgIC8vIHRleHRcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSAzKSB7XG4gICAgICAgIGxldCBub2RlVmFsdWUgPSBub2RlLm5vZGVWYWx1ZSE7XG5cbiAgICAgICAgbGV0IHNldE5vZGVWYWx1ZSA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIGNocm9tZSDkuI3kvJrop6blj5Hph43nu5hcbiAgICAgICAgICAvLyBpZiAobm9kZS5ub2RlVmFsdWUgIT09IHZhbCkge1xuICAgICAgICAgIG5vZGUubm9kZVZhbHVlID0gdmFsO1xuICAgICAgICAgIC8vIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQobm9kZVZhbHVlLCBzZXROb2RlVmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIHRoaXMudHJhdmVyc0VMKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhdmVyc0F0dHIobm9kZTogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBzaG91bGRSZW1vdmVBdHRyczogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgYXR0ciA9IG5vZGUuYXR0cmlidXRlc1tpXTtcblxuICAgICAgaWYgKCFhdHRyKSByZXR1cm47XG5cbiAgICAgIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aCgneC0nKSkge1xuICAgICAgICBjb25zdCBkaXJlY3RpdmVOYW1lID0gYXR0ci5uYW1lLnJlcGxhY2UoL154LS8sICcnKTtcbiAgICAgICAgY29uc3QgZGQgPSBNVlZNLmRpcmVjdGl2ZURlZmluaXRpb25zW2RpcmVjdGl2ZU5hbWVdO1xuXG4gICAgICAgIGlmICghZGQpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ+acquefpeeahOaMh+S7pO+8micsIGRpcmVjdGl2ZU5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZGlyZWN0aXZlcy5wdXNoKG5ldyBEaXJlY3RpdmUodGhpcywgbm9kZSwgYXR0ci52YWx1ZSwgZGQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3VsZFJlbW92ZUF0dHJzLnB1c2goYXR0ci5uYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aCgnOicpKSB7XG4gICAgICAgIGNvbnN0IGF0dHJOYW1lID0gYXR0ci5uYW1lLnN1YnN0cigxKTtcbiAgICAgICAgdGhpcy5wYXJzZVRlbXBsYXRlQW5kU2V0KGF0dHIudmFsdWUsICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBub2RlW2F0dHJOYW1lXSA9IHRvUmVhbFZhbHVlKHZhbCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNob3VsZFJlbW92ZUF0dHJzLnB1c2goYXR0ci5uYW1lKTtcbiAgICAgIH1cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGVsc2UgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYXR0ci5uYW1lLnN1YnN0cigxKTtcbiAgICAgICAgY29uc3QgZXZlbnRGdW5jTmFtZSA9IGF0dHIudmFsdWU7XG4gICAgICAgIGlmICh0aGlzW2V2ZW50RnVuY05hbWVdKSB7XG4gICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpc1tldmVudEZ1bmNOYW1lXSk7XG4gICAgICAgIH1cblxuICAgICAgICBzaG91bGRSZW1vdmVBdHRycy5wdXNoKGF0dHIubmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2IgPSAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIHZhbCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5wYXJzZVRlbXBsYXRlQW5kU2V0KGF0dHIudmFsdWUsIGNiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzaG91bGRSZW1vdmVBdHRycy5mb3JFYWNoKG5hbWUgPT4gbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZVRlbXBsYXRlQW5kU2V0KFxuICAgIHRlbXBsYXRlOiBzdHJpbmcsXG4gICAgc2V0Tm9kZVZhbHVlOiAodmFsOiBzdHJpbmcpID0+IHZvaWQsXG4gICAgZm9ybU5vZGU/OiBhbnlcbiAgKSB7XG4gICAgY29uc3QgdmFsdWVSZWdleHAgPSAve3soW159XSspfX0vZztcblxuICAgIGxldCByZXN1bHQgPSB2YWx1ZVJlZ2V4cC5leGVjKHRlbXBsYXRlKTtcbiAgICBsZXQgYWxsU2NvcGVLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGxldCBjYWxDb250ZXh0czogQXJyYXk8e1xuICAgICAgc3RhcnRJbmRleDogbnVtYmVyO1xuICAgICAgZW5kSW5kZXg6IG51bWJlcjtcbiAgICAgIGNhbDogKCkgPT4gc3RyaW5nO1xuICAgIH0+ID0gW107XG5cbiAgICB3aGlsZSAocmVzdWx0KSB7XG4gICAgICBjb25zdCB7IGluZGV4IH0gPSByZXN1bHQ7XG4gICAgICBsZXQgdHBsID0gcmVzdWx0WzFdO1xuICAgICAgbGV0IGZ1bGxUcGwgPSByZXN1bHRbMF07XG4gICAgICBsZXQgc2NvcGVLZXlzOiBzdHJpbmdbXSA9IHRwbC5tYXRjaChcbiAgICAgICAgL1tfLWEtekEtejEyMzQ1Njc4OS5dKyg/IS4rXFwoKS9nXG4gICAgICApIGFzIGFueTtcblxuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VFeHByZXNzaW9uKHRwbCk7XG4gICAgICBzY29wZUtleXMgPSBwYXJzZWQuZGVwZW5kZW5jaWVzO1xuXG4gICAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbigncmV0dXJuICcgKyBwYXJzZWQuZXhwcmVzc2lvbikuYmluZCh0aGlzKTtcblxuICAgICAgYWxsU2NvcGVLZXlzID0gWy4uLmFsbFNjb3BlS2V5cywgLi4uc2NvcGVLZXlzXTtcbiAgICAgIGNhbENvbnRleHRzID0gW1xuICAgICAgICAuLi5jYWxDb250ZXh0cyxcbiAgICAgICAge1xuICAgICAgICAgIHN0YXJ0SW5kZXg6IGluZGV4LFxuICAgICAgICAgIGVuZEluZGV4OiBpbmRleCArIGZ1bGxUcGwubGVuZ3RoLFxuICAgICAgICAgIGNhbDogKCkgPT4gZm4uYXBwbHkodGhpcyksXG4gICAgICAgIH0sXG4gICAgICBdO1xuXG4gICAgICBpZiAoIWZvcm1Ob2RlKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlUmVnZXhwLmV4ZWModGVtcGxhdGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNhbFZhbHVlID0gKCkgPT4ge1xuICAgICAgbGV0IGxhc3RlbmQgPSAwO1xuICAgICAgbGV0IHZhbHVlID0gJyc7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGNhbENvbnRleHRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShsYXN0ZW5kLCBjYWxDb250ZXh0c1tpXS5zdGFydEluZGV4KTtcbiAgICAgICAgdmFsdWUgKz0gY2FsQ29udGV4dHNbaV0uY2FsKCk7XG4gICAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKFxuICAgICAgICAgIGNhbENvbnRleHRzW2ldLmVuZEluZGV4LFxuICAgICAgICAgIGkgPCBsIC0gMSA/IGNhbENvbnRleHRzW2kgKyAxXS5zdGFydEluZGV4IDogdW5kZWZpbmVkXG4gICAgICAgICk7XG4gICAgICAgIGxhc3RlbmQgPSBjYWxDb250ZXh0c1tpXS5lbmRJbmRleDtcbiAgICAgIH1cblxuICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UoXG4gICAgICAgIGxhc3RlbmQsXG4gICAgICAgIGNhbENvbnRleHRzW2NhbENvbnRleHRzLmxlbmd0aCAtIDFdLnN0YXJ0SW5kZXhcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuXG4gICAgYWxsU2NvcGVLZXlzLmZvckVhY2goayA9PiB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgdmFsID0gY2FsVmFsdWUoKTtcbiAgICAgICAgLy8g6Ziy5q2i6KGo5Y2V5YWD57Sg5YWJ5qCH5Ye66ZSZXG4gICAgICAgIGlmIChmb3JtTm9kZSkge1xuICAgICAgICAgIGlmIChmb3JtTm9kZS52YWx1ZSA9PT0gdmFsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNldE5vZGVWYWx1ZShjYWxWYWx1ZSgpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLiR3YXRjaGVyLmFkZExpc3RlbmVyKGssIGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVyKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuLy8g5YaF572u5oyH5LukXG5NVlZNLmRpcmVjdGl2ZSgnbW9kZWwnLCB7XG4gIGJpbmQoZWw6IGFueSwgYmluZGluZykge1xuICAgIHRoaXMuY2FsbGJhY2sgPSAoZTogYW55KSA9PiB7XG4gICAgICBjb25zdCB2YWwgPSBlLnRhcmdldC52YWx1ZTtcbiAgICAgIHNldFZhbHVlKHRoaXMuJG93bmVyLCBiaW5kaW5nLmV4cHJlc3Npb24sIHZhbCk7XG4gICAgfTtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRoaXMuY2FsbGJhY2spO1xuICAgIGVsLnZhbHVlID0gYmluZGluZy52YWx1ZTtcbiAgfSxcbiAgdXBkYXRlKGVsOiBhbnksIGJpbmRpbmcpIHtcbiAgICBlbC52YWx1ZSA9IGJpbmRpbmcudmFsdWU7XG4gIH0sXG4gIHVuYmluZChlbCkge1xuICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGhpcy5jYWxsYmFjayk7XG4gIH0sXG59KTtcblxuTVZWTS5kaXJlY3RpdmUoJ3Nob3cnLCAoZWwsIGJpbmRpbmcpID0+IHtcbiAgZWwuc3R5bGUuZGlzcGxheSA9IGJpbmRpbmcudmFsdWUgPyAnJyA6ICdub25lJztcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBNVlZNO1xuIiwiaW1wb3J0IHsgZ2V0VmFsdWUsIGlzUGxhaW5PYmplY3QsIG1lcmdlRGVzY3JpcHRvciB9IGZyb20gJy4vdXRpbHMnO1xuXG50eXBlIENhbGxiYWNrID0gKHZhbDogYW55LCBvbGRWYWx1ZTogYW55KSA9PiB2b2lkO1xudHlwZSBDYWxsYmFja1dpdGhQYXRoID0gKHZhbDogYW55LCBvbGRWYWx1ZTogYW55LCBwYXRoOiBzdHJpbmcpID0+IHZvaWQ7XG5cbmNsYXNzIFRva2VuIHtcbiAgcHJpdmF0ZSB2YWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogeyBvYmo6IGFueTsga2V5OiBzdHJpbmc7IHZhbHVlOiBhbnk7IGNiOiBDYWxsYmFjayB9KSB7XG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzO1xuICAgIGNvbnN0IHsga2V5LCB2YWx1ZSwgb2JqLCBjYiB9ID0gY29uZmlnO1xuXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiByZWFjdGl2ZVNldHRlcigpIHtcbiAgICAgICAgcmV0dXJuIHNjb3BlLnZhbHVlO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gcmVhY3RpdmVHZXR0ZXIodmFsdWUpIHtcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSBzY29wZS52YWx1ZTtcbiAgICAgICAgc2NvcGUudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgIGNiKHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgR0xPQUJMX0tFWSA9ICdHTE9BQkwnO1xuXG5jbGFzcyBXYXRjaGVyIHtcbiAgb3duZXI6IGFueTtcbiAgbGlzdGVuZXJzOiB7XG4gICAgW3BhdGg6IHN0cmluZ106IENhbGxiYWNrV2l0aFBhdGhbXTtcbiAgfSA9IHt9O1xuICBjb25zdHJ1Y3Rvcihvd25lcjogYW55LCBkYXRhOiBhbnkpIHtcbiAgICBtZXJnZURlc2NyaXB0b3Iob3duZXIsIHRoaXMudHJhdmVyc2VEYXRhKGRhdGEpKTtcbiAgICB0aGlzLm93bmVyID0gb3duZXI7XG4gIH1cblxuICB0cmF2ZXJzZURhdGEoZGF0YTogYW55LCBwYXRoID0gJycpIHtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IChwYXRoID8gcGF0aCArICcuJyA6ICcnKSArIGtleTtcblxuICAgICAgbmV3IFRva2VuKHtcbiAgICAgICAgb2JqOiByZXN1bHQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IGlzUGxhaW5PYmplY3QoZGF0YVtrZXldKVxuICAgICAgICAgID8gdGhpcy50cmF2ZXJzZURhdGEoZGF0YVtrZXldLCBmdWxsUGF0aClcbiAgICAgICAgICA6IGRhdGFba2V5XSxcbiAgICAgICAgY2I6IChuZXdWYWwsIG9sZFZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aCwgbmV3VmFsLCBvbGRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGg6IHN0cmluZywgbmV3VmFsdWU6IGFueSwgb2xkVmFsdWU6IGFueSkge1xuICAgIGxldCBwYXJlbnQgPSB0aGlzLm93bmVyO1xuICAgIGNvbnN0IHBhdGhBcnIgPSBmdWxsUGF0aC5zcGxpdCgnLicpO1xuICAgIGlmIChwYXRoQXJyLmxlbmd0aCA+PSAyKSB7XG4gICAgICBwYXJlbnQgPSBuZXcgRnVuY3Rpb24oXG4gICAgICAgICdkYXRhJyxcbiAgICAgICAgYHJldHVybiBkYXRhLiR7cGF0aEFyci5zbGljZSgwLCBwYXRoQXJyLmxlbmd0aCAtIDEpLmpvaW4oJy4nKX1gXG4gICAgICApKHRoaXMub3duZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IGtleTogc3RyaW5nID0gcGF0aEFyci5wb3AoKSE7XG5cbiAgICBpZiAoaXNQbGFpbk9iamVjdChuZXdWYWx1ZSkpIHtcbiAgICAgIG5ldyBUb2tlbih7XG4gICAgICAgIG9iajogcGFyZW50LFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiB0aGlzLnRyYXZlcnNlRGF0YShuZXdWYWx1ZSwgZnVsbFBhdGgpLFxuICAgICAgICBjYjogKF9uZXdWYWx1ZSwgX29sZFZhbHVlKSA9PiB7XG4gICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aCwgX25ld1ZhbHVlLCBfb2xkVmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyKGZ1bGxQYXRoLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICB9XG5cbiAgYWRkTGlzdGVuZXIocGF0aDogc3RyaW5nLCBjYjogQ2FsbGJhY2tXaXRoUGF0aCkge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IEdMT0FCTF9LRVk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmxpc3RlbmVyc1twYXRoXSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyc1twYXRoXS5wdXNoKGNiKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKHBhdGg6IHN0cmluZywgY2I/OiBDYWxsYmFja1dpdGhQYXRoKSB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gR0xPQUJMX0tFWTtcbiAgICB9XG5cbiAgICBpZiAoIWNiKSB7XG4gICAgICBkZWxldGUgdGhpcy5saXN0ZW5lcnNbcGF0aF07XG4gICAgfSBlbHNlIHtcbiAgICAgICh0aGlzLmxpc3RlbmVyc1twYXRoXSB8fCBbXSkuZmlsdGVyKGl0ZW0gPT4gaXRlbSA9PT0gY2IpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUFsbExpc3RlbmVycygpIHtcbiAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xuICB9XG5cbiAgdHJpZ2dlcihwYXRoOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbcGF0aF0pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0uZm9yRWFjaChjYiA9PiBjYihuZXdWYWx1ZSwgb2xkVmFsdWUsIHBhdGgpKTtcblxuICAgIC8vIOaUueWPmOS6huWvueixoe+8jOmCo+S5iOWtkOe6p+S5n+W6lOivpeaUtuWIsOmAmuefpVxuICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoa2V5ICE9PSBwYXRoICYmIGtleS5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGsgPSBrZXkucmVwbGFjZShwYXRoICsgJy4nLCAnJyk7XG4gICAgICAgIGNvbnN0IG9sZFYgPSBnZXRWYWx1ZShvbGRWYWx1ZSwgayk7XG4gICAgICAgIGNvbnN0IG5ld1YgPSBnZXRWYWx1ZShuZXdWYWx1ZSwgayk7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2tleV0uZm9yRWFjaChjYiA9PiBjYihuZXdWLCBvbGRWLCBrZXkpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgICh0aGlzLmxpc3RlbmVyc1tHTE9BQkxfS0VZXSB8fCBbXSkuZm9yRWFjaChjYiA9PlxuICAgICAgY2IobmV3VmFsdWUsIG9sZFZhbHVlLCBwYXRoKVxuICAgICk7XG4gIH1cbn1cblxuLy8gY29uc3Qgb3duZXI6IGFueSA9IHt9O1xuXG4vLyBjb25zdCB3YXRjaGVyID0gbmV3IFdhdGNoZXIob3duZXIsIHtcbi8vICAgYTogMTAsXG4vLyAgIGI6IHtcbi8vICAgICBjOiAxMixcbi8vICAgfSxcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLmFkZExpc3RlbmVyKCdiJywgKGEsIGIpID0+IHtcbi8vICAgY29uc29sZS5sb2coJ2IgY2hhbmdlZCcsIGEsIGIpO1xuLy8gfSk7XG5cbi8vIHdhdGNoZXIuYWRkTGlzdGVuZXIoJ2IuYycsIChhLCBiKSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKCdiLmMgY2hhbmdlZCcsIGEsIGIpO1xuLy8gfSk7XG5cbi8vIG93bmVyLmIgPSB7IGM6IDE1IH07XG4vLyBvd25lci5iLmMgPSAnd2FoYWhhaGEnO1xuXG5leHBvcnQgZGVmYXVsdCBXYXRjaGVyO1xuIiwiaW1wb3J0IE1WVk0gZnJvbSAnLi9NVlZNJztcblxuY29uc3QgaW5pdGlhbERhdGEgPSAoKSA9PiAoe1xuICBuYW1lOiAnSm9obicsXG4gIGFnZTogMTAsXG4gIGdlbmRlcjogMSxcbiAgc3VibWl0aW5nOiBmYWxzZSxcbiAgY3VycmVudFRpbWU6IG5ldyBEYXRlKCksXG4gIGV4dHJhOiB7XG4gICAgbGlrZTogJ2dhbWUnLFxuICB9LFxuICBzaG93SW5mbzogdHJ1ZSxcbiAgbGlzdDogW3sgbmFtZTogJ3lxeicgfSwgeyBuYW1lOiAnc2hlbmppbmd3ZWknIH1dLFxufSk7XG5cbm5ldyBNVlZNKHtcbiAgZWw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSEsXG4gIGRhdGE6IGluaXRpYWxEYXRhKCksXG4gIGNyZWF0ZWQodGhpczogYW55KSB7XG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHRoaXMuY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIH0sIDEwMDApO1xuICB9LFxuICBkZXN0cm95KHRoaXM6IGFueSkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gIH0sXG4gIGNvbXB1dGVkOiB7XG4gICAgZ2VuZGVyVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdlbmRlciA9PSAxID8gJ+eUtycgOiAn5aWzJztcbiAgICB9LFxuICAgIGN1cnJlbnRUaW1lU3RyKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRpbWUudG9Mb2NhbGVTdHJpbmcoKTtcbiAgICB9LFxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgY2hhbmdlR2VuZGVyKCkge1xuICAgICAgdGhpcy5nZW5kZXIgPSB0aGlzLmdlbmRlciA9PSAxID8gMCA6IDE7XG4gICAgfSxcblxuICAgIHRvZ2dsZVNob3dJbmZvKCkge1xuICAgICAgdGhpcy5zaG93SW5mbyA9ICF0aGlzLnNob3dJbmZvO1xuICAgIH0sXG5cbiAgICByZXNldCgpIHtcbiAgICAgIGNvbnN0IG5ld0RhdGEgPSBpbml0aWFsRGF0YSgpO1xuICAgICAgdGhpcy5zZXREYXRhKG5ld0RhdGEpO1xuICAgIH0sXG5cbiAgICBzdWJtaXQoKSB7XG4gICAgICB0aGlzLnN1Ym1pdGluZyA9IHRydWU7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBhbGVydCgn5o+Q5Lqk5oiQ5YqfJyk7XG4gICAgICAgIHRoaXMuc3VibWl0aW5nID0gZmFsc2U7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG51bGw7XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0VmFsdWUob2JqOiBhbnksIHBhdGg6IHN0cmluZywgZGVmYXVsdFZhbCA9IHVuZGVmaW5lZCkge1xuICBsZXQgdmFsID0gb2JqO1xuICB0cnkge1xuICAgIHZhbCA9IG5ldyBGdW5jdGlvbignZGF0YScsIGByZXR1cm4gZGF0YS4ke3BhdGh9YCkob2JqKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBkZWZhdWx0VmFsO1xuICB9XG4gIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWwgOiB2YWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRWYWx1ZShvYmo6IGFueSwgcGF0aDogc3RyaW5nLCB2YWw6IGFueSkge1xuICB0cnkge1xuICAgIG5ldyBGdW5jdGlvbignZGF0YScsIGBkYXRhLiR7cGF0aH09JHtKU09OLnN0cmluZ2lmeSh2YWwpfWApKG9iaik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqOiBhbnkpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEZXNjcmlwdG9yKGE6IGFueSwgYjogYW55KSB7XG4gIGZvciAobGV0IGtleSBpbiBiKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxuICAgICAgYSxcbiAgICAgIGtleSxcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoYiwga2V5KVxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpIHtcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGV0IG1heCA9IGV4cHJlc3Npb24ubGVuZ3RoO1xuICBsZXQgcmVzdWx0ID0gJyc7XG4gIGxldCBkZXBlbmRlbmNpZXM6IHN0cmluZ1tdID0gW107XG5cbiAgd2hpbGUgKGluZGV4IDwgbWF4KSB7XG4gICAgbGV0IGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdChpbmRleCk7XG5cbiAgICBpZiAoLyd8XCIvLnRlc3QoY2hhcikpIHtcbiAgICAgIGNvbnN0IGMgPSBjaGFyO1xuICAgICAgbGV0IHN0ciA9IFwiJ1wiO1xuICAgICAgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KCsraW5kZXgpO1xuICAgICAgd2hpbGUgKGNoYXIgIT09IHVuZGVmaW5lZCAmJiBjaGFyICE9PSBjKSB7XG4gICAgICAgIHN0ciArPSBjaGFyO1xuICAgICAgICBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoKytpbmRleCk7XG4gICAgICB9XG4gICAgICByZXN1bHQgKz0gc3RyO1xuICAgICAgcmVzdWx0ICs9IFwiJ1wiO1xuICAgICAgaW5kZXgrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGxldCBWQVJJQUJMRVMgPSAvW0EtWmEtel9dLztcbiAgICBpZiAoVkFSSUFCTEVTLnRlc3QoY2hhcikpIHtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuXG4gICAgICBsZXQgcGF0aCA9ICcnO1xuICAgICAgbGV0IHBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgd2hpbGUgKGNoYXIgJiYgL1tBLVphLXpfMC05LigpXS8udGVzdChjaGFyKSkge1xuICAgICAgICB2YWx1ZSArPSBjaGFyO1xuXG4gICAgICAgIGlmIChjaGFyID09PSAnLicpIHtcbiAgICAgICAgICBwYXRocy5wdXNoKHBhdGgpO1xuICAgICAgICAgIHBhdGggPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRoICs9IGNoYXI7XG4gICAgICAgIH1cbiAgICAgICAgY2hhciA9IGV4cHJlc3Npb25bKytpbmRleF07XG4gICAgICB9XG5cbiAgICAgIGlmICgvXltBLVphLXpfMC05XSskLy50ZXN0KHBhdGgpKSB7XG4gICAgICAgIHBhdGhzLnB1c2gocGF0aCk7XG4gICAgICB9XG5cbiAgICAgIGRlcGVuZGVuY2llcy5wdXNoKHBhdGhzLmpvaW4oJy4nKSk7XG4gICAgICByZXN1bHQgKz0gJ3RoaXMuJyArIHZhbHVlICsgKGNoYXIgfHwgJycpO1xuICAgICAgaW5kZXgrKztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlc3VsdCArPSBjaGFyO1xuICAgIGluZGV4Kys7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGV4cHJlc3Npb246IHJlc3VsdCxcbiAgICBkZXBlbmRlbmNpZXMsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1JlYWxWYWx1ZSh2YWx1ZTogYW55KSB7XG4gIGlmICghdmFsdWUpIHJldHVybiB2YWx1ZTtcblxuICBpZiAoL15bMC05XT8oXFwuWzAtOV0rKT8kLy50ZXN0KHZhbHVlKSkge1xuICAgIHJldHVybiBOdW1iZXIodmFsdWUpO1xuICB9IGVsc2UgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ251bGwnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0gZWxzZSBpZiAodmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=