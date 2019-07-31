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


class MVVM {
    constructor(config) {
        this.el = config.el;
        this.watcher = new _Watcher__WEBPACK_IMPORTED_MODULE_0__["default"](this, config.data);
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
            this.config.destroy && this.config.destroy.call(this);
        };
    }
    initComputed() {
        const computed = this.config.computed || {};
        const computedKeys = Object.keys(computed);
        this.watcher.addListener('', (n, o, key) => {
            if (computedKeys.indexOf(key) >= 0) {
                return;
            }
            computedKeys.forEach(ckey => {
                this[ckey] = computed[ckey].call(this);
                this.watcher.trigger(ckey, this[ckey], '');
            });
        });
        computedKeys.forEach(ckey => {
            this[ckey] = computed[ckey].call(this);
            this.watcher.trigger(ckey, this[ckey], '');
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
            const nodeName = node.nodeName.toLowerCase();
            const isFormEl = ['input', 'textArea', 'checkbox', 'select', 'radio'].indexOf(nodeName) >= 0;
            // text
            if (node.nodeType === 3 || isFormEl) {
                let nodeValue = node.nodeValue;
                let setNodeValue = (val) => {
                    // chrome 不会触发重绘
                    // if (node.nodeValue !== val) {
                    node.nodeValue = val;
                    // }
                };
                if (isFormEl) {
                    nodeValue = node.attributes[':value']
                        ? node.attributes[':value'].value
                        : '';
                    setNodeValue = (val) => {
                        node.value = val;
                    };
                    node.removeAttribute(':value');
                }
                this.parseTemplateAndSet(nodeValue, setNodeValue, isFormEl ? node : undefined);
            }
            else if (node.nodeType === 1) {
                this.traversEL(node);
            }
        }
    }
    traversAttr(node) {
        for (let i = 0, l = node.attributes.length; i < l; i++) {
            const attr = node.attributes[i];
            // @ts-ignore
            if (attr.name.startsWith('@')) {
                const eventName = attr.name.substr(1);
                const eventFuncName = attr.value;
                if (this[eventFuncName]) {
                    node.addEventListener(eventName, this[eventFuncName]);
                }
                node.removeAttribute(attr.name);
            }
            else {
                this.parseTemplateAndSet(attr.value, (val) => {
                    node.setAttribute(attr.name, val);
                });
            }
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
            let scopeKeys = tpl.match(/[_-a-zA-z123456789.]+(?!.+\()/g);
            const parsed = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["parseExpression"])(tpl);
            scopeKeys = parsed.dependencies;
            if (formNode) {
                const nodeName = formNode.nodeName.toLowerCase();
                switch (nodeName) {
                    case 'input':
                    case 'textarea': {
                        formNode.addEventListener('input', (e) => {
                            Object(_utils__WEBPACK_IMPORTED_MODULE_1__["setValue"])(this, scopeKeys[0], e.target.value);
                        });
                        break;
                    }
                    case 'select': {
                        setNodeValue = (val) => {
                            formNode.value = val;
                            const options = formNode.querySelectorAll('option');
                            for (let i = 0, l = options.length; i < l; i++) {
                                const item = options[i];
                                if (item.value === val.toString()) {
                                    item.selected = true;
                                }
                                else {
                                    item.selected = false;
                                }
                            }
                        };
                        formNode.addEventListener('change', (e) => {
                            Object(_utils__WEBPACK_IMPORTED_MODULE_1__["setValue"])(this, scopeKeys[0], e.target.value);
                        });
                        break;
                    }
                }
                result = null;
            }
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
            this.watcher.addListener(k, listener);
            listener();
        });
    }
}
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
    // @ts-ignore
    constructor(config) {
        const scope = this;
        const { key, value, obj, cb } = config;
        this._value = value;
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveSetter() {
                return scope._value;
            },
            set: function reactiveGetter(value) {
                const oldValue = scope._value;
                scope._value = value;
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
        this.listeners[GLOABL_KEY].forEach(cb => cb(newValue, oldValue, path));
    }
}
// const obj = {
//   a: {
//     b: 1,
//   },
// };
// const watcher = new Watcher({
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
// watcher._data.b = { c: 15 };
// watcher._data.b.c = 'wahahaha';
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
    currentTime: new Date(),
    extra: {
        like: 'game',
    },
    showInfo: true,
    list: [{ name: 'yqz' }, { name: 'shenjingwei' }],
});
const mvvm = new _MVVM__WEBPACK_IMPORTED_MODULE_0__["default"]({
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
        delete(e) {
            console.log(e.target.dataset.id);
        },
    },
});
// setTimeout(() => {
//   mvvm.destroy();
// }, 3000);
/* harmony default export */ __webpack_exports__["default"] = (null);


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: getValue, setValue, isPlainObject, mergeDescriptor, parseExpression */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getValue", function() { return getValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setValue", function() { return setValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPlainObject", function() { return isPlainObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mergeDescriptor", function() { return mergeDescriptor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseExpression", function() { return parseExpression; });
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL01WVk0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFnQztBQUM4QjtBQVc5RCxNQUFNLElBQUk7SUFLUixZQUFZLE1BQWtCO1FBQzVCLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZ0RBQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFD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QyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzVCO1lBRUQsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbEI7WUFFRCxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLElBQUksT0FBTyxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN6QyxLQUFLLEVBQUUsQ0FBQztZQUNSLFNBQVM7U0FDVjtRQUVELE1BQU0sSUFBSSxJQUFJLENBQUM7UUFDZixLQUFLLEVBQUUsQ0FBQztLQUNUO0lBRUQsT0FBTztRQUNMLFVBQVUsRUFBRSxNQUFNO1FBQ2xCLFlBQVk7S0FDYixDQUFDO0FBQ0osQ0FBQyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgV2F0Y2hlciBmcm9tICcuL1dhdGNoZXInO1xuaW1wb3J0IHsgZ2V0VmFsdWUsIHNldFZhbHVlLCBwYXJzZUV4cHJlc3Npb24gfSBmcm9tICcuL3V0aWxzJztcblxuaW50ZXJmYWNlIE1WVk1Db25maWcge1xuICBlbDogSFRNTEVsZW1lbnQ7XG4gIGRhdGE6IGFueTtcbiAgY3JlYXRlZD86ICgpID0+IHZvaWQ7XG4gIGRlc3Ryb3k/OiAoKSA9PiB2b2lkO1xuICBjb21wdXRlZDogYW55O1xuICBtZXRob2RzOiBhbnk7XG59XG5cbmNsYXNzIE1WVk0ge1xuICBlbDogSFRNTEVsZW1lbnQ7XG4gIHdhdGNoZXI6IFdhdGNoZXI7XG4gIHByaXZhdGUgY29uZmlnOiBNVlZNQ29uZmlnO1xuICBba2V5OiBzdHJpbmddOiBhbnk7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTVZWTUNvbmZpZykge1xuICAgIHRoaXMuZWwgPSBjb25maWcuZWw7XG4gICAgdGhpcy53YXRjaGVyID0gbmV3IFdhdGNoZXIodGhpcywgY29uZmlnLmRhdGEpO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgdGhpcy5pbml0TGlmZUN5Y2xlcygpO1xuICAgIHRoaXMuaW5pdE1ldGhvZHMoKTtcbiAgICB0aGlzLnRyYXZlcnNFTChjb25maWcuZWwpO1xuICAgIHRoaXMuaW5pdENvbXB1dGVkKCk7XG4gICAgdGhpcy5jcmVhdGVkKHRoaXMpO1xuICB9XG5cbiAgc2V0RGF0YShuZXdEYXRhOiBhbnkpIHtcbiAgICBpZiAoIW5ld0RhdGEpIHJldHVybjtcbiAgICBPYmplY3Qua2V5cyhuZXdEYXRhKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpc1trXSA9IG5ld0RhdGFba107XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGluaXRMaWZlQ3ljbGVzKCkge1xuICAgIHRoaXNbJ2NyZWF0ZWQnXSA9ICgpID0+IHtcbiAgICAgIHRoaXMuY29uZmlnLmNyZWF0ZWQgJiYgdGhpcy5jb25maWcuY3JlYXRlZC5jYWxsKHRoaXMpO1xuICAgIH07XG5cbiAgICB0aGlzWydkZXN0cm95J10gPSAoKSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZy5kZXN0cm95ICYmIHRoaXMuY29uZmlnLmRlc3Ryb3kuY2FsbCh0aGlzKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0Q29tcHV0ZWQoKSB7XG4gICAgY29uc3QgY29tcHV0ZWQgPSB0aGlzLmNvbmZpZy5jb21wdXRlZCB8fCB7fTtcblxuICAgIGNvbnN0IGNvbXB1dGVkS2V5cyA9IE9iamVjdC5rZXlzKGNvbXB1dGVkKTtcbiAgICB0aGlzLndhdGNoZXIuYWRkTGlzdGVuZXIoJycsIChuLCBvLCBrZXkpID0+IHtcbiAgICAgIGlmIChjb21wdXRlZEtleXMuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29tcHV0ZWRLZXlzLmZvckVhY2goY2tleSA9PiB7XG4gICAgICAgIHRoaXNbY2tleV0gPSBjb21wdXRlZFtja2V5XS5jYWxsKHRoaXMpO1xuICAgICAgICB0aGlzLndhdGNoZXIudHJpZ2dlcihja2V5LCB0aGlzW2NrZXldLCAnJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBjb21wdXRlZEtleXMuZm9yRWFjaChja2V5ID0+IHtcbiAgICAgIHRoaXNbY2tleV0gPSBjb21wdXRlZFtja2V5XS5jYWxsKHRoaXMpO1xuICAgICAgdGhpcy53YXRjaGVyLnRyaWdnZXIoY2tleSwgdGhpc1tja2V5XSwgJycpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0TWV0aG9kcygpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5tZXRob2RzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzW2tleV0gPSB0aGlzLmNvbmZpZy5tZXRob2RzW2tleV0uYmluZCh0aGlzKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdHJhdmVyc0VMKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMudHJhdmVyc0F0dHIoZWwpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgbm9kZTogYW55ID0gZWwuY2hpbGROb2Rlc1tpXTtcbiAgICAgIGNvbnN0IG5vZGVOYW1lID0gbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgY29uc3QgaXNGb3JtRWwgPVxuICAgICAgICBbJ2lucHV0JywgJ3RleHRBcmVhJywgJ2NoZWNrYm94JywgJ3NlbGVjdCcsICdyYWRpbyddLmluZGV4T2YoXG4gICAgICAgICAgbm9kZU5hbWVcbiAgICAgICAgKSA+PSAwO1xuXG4gICAgICAvLyB0ZXh0XG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyB8fCBpc0Zvcm1FbCkge1xuICAgICAgICBsZXQgbm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWUhO1xuXG4gICAgICAgIGxldCBzZXROb2RlVmFsdWUgPSAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAvLyBjaHJvbWUg5LiN5Lya6Kem5Y+R6YeN57uYXG4gICAgICAgICAgLy8gaWYgKG5vZGUubm9kZVZhbHVlICE9PSB2YWwpIHtcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHZhbDtcbiAgICAgICAgICAvLyB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGlzRm9ybUVsKSB7XG4gICAgICAgICAgbm9kZVZhbHVlID0gbm9kZS5hdHRyaWJ1dGVzWyc6dmFsdWUnXVxuICAgICAgICAgICAgPyBub2RlLmF0dHJpYnV0ZXNbJzp2YWx1ZSddLnZhbHVlXG4gICAgICAgICAgICA6ICcnO1xuICAgICAgICAgIHNldE5vZGVWYWx1ZSA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgbm9kZS52YWx1ZSA9IHZhbDtcbiAgICAgICAgICB9O1xuICAgICAgICAgIChub2RlIGFzIEhUTUxFbGVtZW50KS5yZW1vdmVBdHRyaWJ1dGUoJzp2YWx1ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wYXJzZVRlbXBsYXRlQW5kU2V0KFxuICAgICAgICAgIG5vZGVWYWx1ZSxcbiAgICAgICAgICBzZXROb2RlVmFsdWUsXG4gICAgICAgICAgaXNGb3JtRWwgPyBub2RlIDogdW5kZWZpbmVkXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgdGhpcy50cmF2ZXJzRUwobm9kZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmF2ZXJzQXR0cihub2RlOiBIVE1MRWxlbWVudCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgYXR0ciA9IG5vZGUuYXR0cmlidXRlc1tpXTtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGlmIChhdHRyLm5hbWUuc3RhcnRzV2l0aCgnQCcpKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGF0dHIubmFtZS5zdWJzdHIoMSk7XG4gICAgICAgIGNvbnN0IGV2ZW50RnVuY05hbWUgPSBhdHRyLnZhbHVlO1xuICAgICAgICBpZiAodGhpc1tldmVudEZ1bmNOYW1lXSkge1xuICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXNbZXZlbnRGdW5jTmFtZV0pO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQoYXR0ci52YWx1ZSwgKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCB2YWwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVGVtcGxhdGVBbmRTZXQoXG4gICAgdGVtcGxhdGU6IHN0cmluZyxcbiAgICBzZXROb2RlVmFsdWU6ICh2YWw6IHN0cmluZykgPT4gdm9pZCxcbiAgICBmb3JtTm9kZT86IGFueVxuICApIHtcbiAgICBjb25zdCB2YWx1ZVJlZ2V4cCA9IC97eyhbXn1dKyl9fS9nO1xuXG4gICAgbGV0IHJlc3VsdCA9IHZhbHVlUmVnZXhwLmV4ZWModGVtcGxhdGUpO1xuICAgIGxldCBhbGxTY29wZUtleXM6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGNhbENvbnRleHRzOiBBcnJheTx7XG4gICAgICBzdGFydEluZGV4OiBudW1iZXI7XG4gICAgICBlbmRJbmRleDogbnVtYmVyO1xuICAgICAgY2FsOiAoKSA9PiBzdHJpbmc7XG4gICAgfT4gPSBbXTtcblxuICAgIHdoaWxlIChyZXN1bHQpIHtcbiAgICAgIGNvbnN0IHsgaW5kZXggfSA9IHJlc3VsdDtcbiAgICAgIGxldCB0cGwgPSByZXN1bHRbMV07XG4gICAgICBsZXQgZnVsbFRwbCA9IHJlc3VsdFswXTtcbiAgICAgIGxldCBzY29wZUtleXM6IHN0cmluZ1tdID0gdHBsLm1hdGNoKFxuICAgICAgICAvW18tYS16QS16MTIzNDU2Nzg5Ll0rKD8hLitcXCgpL2dcbiAgICAgICkgYXMgYW55O1xuXG4gICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUV4cHJlc3Npb24odHBsKTtcbiAgICAgIHNjb3BlS2V5cyA9IHBhcnNlZC5kZXBlbmRlbmNpZXM7XG5cbiAgICAgIGlmIChmb3JtTm9kZSkge1xuICAgICAgICBjb25zdCBub2RlTmFtZSA9IGZvcm1Ob2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHN3aXRjaCAobm9kZU5hbWUpIHtcbiAgICAgICAgICBjYXNlICdpbnB1dCc6XG4gICAgICAgICAgY2FzZSAndGV4dGFyZWEnOiB7XG4gICAgICAgICAgICBmb3JtTm9kZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgc2V0VmFsdWUodGhpcywgc2NvcGVLZXlzWzBdLCBlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlICdzZWxlY3QnOiB7XG4gICAgICAgICAgICBzZXROb2RlVmFsdWUgPSAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgZm9ybU5vZGUudmFsdWUgPSB2YWw7XG4gICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBmb3JtTm9kZS5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBvcHRpb25zLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBvcHRpb25zW2ldO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnZhbHVlID09PSB2YWwudG9TdHJpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGl0ZW0uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3JtTm9kZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZTogYW55KSA9PiB7XG4gICAgICAgICAgICAgIHNldFZhbHVlKHRoaXMsIHNjb3BlS2V5c1swXSwgZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oJ3JldHVybiAnICsgcGFyc2VkLmV4cHJlc3Npb24pLmJpbmQodGhpcyk7XG5cbiAgICAgIGFsbFNjb3BlS2V5cyA9IFsuLi5hbGxTY29wZUtleXMsIC4uLnNjb3BlS2V5c107XG4gICAgICBjYWxDb250ZXh0cyA9IFtcbiAgICAgICAgLi4uY2FsQ29udGV4dHMsXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFydEluZGV4OiBpbmRleCxcbiAgICAgICAgICBlbmRJbmRleDogaW5kZXggKyBmdWxsVHBsLmxlbmd0aCxcbiAgICAgICAgICBjYWw6ICgpID0+IGZuLmFwcGx5KHRoaXMpLFxuICAgICAgICB9LFxuICAgICAgXTtcblxuICAgICAgaWYgKCFmb3JtTm9kZSkge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZVJlZ2V4cC5leGVjKHRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjYWxWYWx1ZSA9ICgpID0+IHtcbiAgICAgIGxldCBsYXN0ZW5kID0gMDtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjYWxDb250ZXh0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UobGFzdGVuZCwgY2FsQ29udGV4dHNbaV0uc3RhcnRJbmRleCk7XG4gICAgICAgIHZhbHVlICs9IGNhbENvbnRleHRzW2ldLmNhbCgpO1xuICAgICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShcbiAgICAgICAgICBjYWxDb250ZXh0c1tpXS5lbmRJbmRleCxcbiAgICAgICAgICBpIDwgbCAtIDEgPyBjYWxDb250ZXh0c1tpICsgMV0uc3RhcnRJbmRleCA6IHVuZGVmaW5lZFxuICAgICAgICApO1xuICAgICAgICBsYXN0ZW5kID0gY2FsQ29udGV4dHNbaV0uZW5kSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKFxuICAgICAgICBsYXN0ZW5kLFxuICAgICAgICBjYWxDb250ZXh0c1tjYWxDb250ZXh0cy5sZW5ndGggLSAxXS5zdGFydEluZGV4XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGFsbFNjb3BlS2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGNhbFZhbHVlKCk7XG4gICAgICAgIC8vIOmYsuatouihqOWNleWFg+e0oOWFieagh+WHuumUmVxuICAgICAgICBpZiAoZm9ybU5vZGUpIHtcbiAgICAgICAgICBpZiAoZm9ybU5vZGUudmFsdWUgPT09IHZhbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzZXROb2RlVmFsdWUoY2FsVmFsdWUoKSk7XG4gICAgICB9O1xuICAgICAgdGhpcy53YXRjaGVyLmFkZExpc3RlbmVyKGssIGxpc3RlbmVyKTtcbiAgICAgIGxpc3RlbmVyKCk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTVZWTTtcbiIsImltcG9ydCB7IGdldFZhbHVlLCBpc1BsYWluT2JqZWN0LCBtZXJnZURlc2NyaXB0b3IgfSBmcm9tICcuL3V0aWxzJztcblxudHlwZSBDYWxsYmFjayA9ICh2YWw6IGFueSwgb2xkVmFsdWU6IGFueSkgPT4gdm9pZDtcbnR5cGUgQ2FsbGJhY2tXaXRoUGF0aCA9ICh2YWw6IGFueSwgb2xkVmFsdWU6IGFueSwgcGF0aDogc3RyaW5nKSA9PiB2b2lkO1xuXG5jbGFzcyBUb2tlbjxUID0gYW55PiB7XG4gIHByaXZhdGUgX3ZhbHVlOiBUO1xuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogeyBvYmo6IGFueTsga2V5OiBzdHJpbmc7IHZhbHVlOiBUOyBjYjogQ2FsbGJhY2sgfSkge1xuICAgIGNvbnN0IHNjb3BlID0gdGhpcztcbiAgICBjb25zdCB7IGtleSwgdmFsdWUsIG9iaiwgY2IgfSA9IGNvbmZpZztcblxuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlU2V0dGVyKCkge1xuICAgICAgICByZXR1cm4gc2NvcGUuX3ZhbHVlO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gcmVhY3RpdmVHZXR0ZXIodmFsdWUpIHtcbiAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSBzY29wZS5fdmFsdWU7XG4gICAgICAgIHNjb3BlLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICBpZiAob2xkVmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgY2IodmFsdWUsIG9sZFZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBHTE9BQkxfS0VZID0gJ0dMT0FCTCc7XG5cbmNsYXNzIFdhdGNoZXIge1xuICBvd25lcjogYW55O1xuICBsaXN0ZW5lcnM6IHtcbiAgICBbcGF0aDogc3RyaW5nXTogQ2FsbGJhY2tXaXRoUGF0aFtdO1xuICB9ID0ge307XG4gIGNvbnN0cnVjdG9yKG93bmVyOiBhbnksIGRhdGE6IGFueSkge1xuICAgIG1lcmdlRGVzY3JpcHRvcihvd25lciwgdGhpcy50cmF2ZXJzZURhdGEoZGF0YSkpO1xuICAgIHRoaXMub3duZXIgPSBvd25lcjtcbiAgfVxuXG4gIHRyYXZlcnNlRGF0YShkYXRhOiBhbnksIHBhdGggPSAnJykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGRhdGEpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoID0gKHBhdGggPyBwYXRoICsgJy4nIDogJycpICsga2V5O1xuXG4gICAgICBuZXcgVG9rZW4oe1xuICAgICAgICBvYmo6IHJlc3VsdCxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogaXNQbGFpbk9iamVjdChkYXRhW2tleV0pXG4gICAgICAgICAgPyB0aGlzLnRyYXZlcnNlRGF0YShkYXRhW2tleV0sIGZ1bGxQYXRoKVxuICAgICAgICAgIDogZGF0YVtrZXldLFxuICAgICAgICBjYjogKG5ld1ZhbCwgb2xkVmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlKGZ1bGxQYXRoLCBuZXdWYWwsIG9sZFZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBoYW5kbGVWYWx1ZUNoYW5nZShmdWxsUGF0aDogc3RyaW5nLCBuZXdWYWx1ZTogYW55LCBvbGRWYWx1ZTogYW55KSB7XG4gICAgbGV0IHBhcmVudCA9IHRoaXMub3duZXI7XG4gICAgY29uc3QgcGF0aEFyciA9IGZ1bGxQYXRoLnNwbGl0KCcuJyk7XG4gICAgaWYgKHBhdGhBcnIubGVuZ3RoID49IDIpIHtcbiAgICAgIHBhcmVudCA9IG5ldyBGdW5jdGlvbihcbiAgICAgICAgJ2RhdGEnLFxuICAgICAgICBgcmV0dXJuIGRhdGEuJHtwYXRoQXJyLnNsaWNlKDAsIHBhdGhBcnIubGVuZ3RoIC0gMSkuam9pbignLicpfWBcbiAgICAgICkodGhpcy5vd25lcik7XG4gICAgfVxuXG4gICAgY29uc3Qga2V5OiBzdHJpbmcgPSBwYXRoQXJyLnBvcCgpITtcblxuICAgIGlmIChpc1BsYWluT2JqZWN0KG5ld1ZhbHVlKSkge1xuICAgICAgbmV3IFRva2VuKHtcbiAgICAgICAgb2JqOiBwYXJlbnQsXG4gICAgICAgIGtleSxcbiAgICAgICAgdmFsdWU6IHRoaXMudHJhdmVyc2VEYXRhKG5ld1ZhbHVlLCBmdWxsUGF0aCksXG4gICAgICAgIGNiOiAoX25ld1ZhbHVlLCBfb2xkVmFsdWUpID0+IHtcbiAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlKGZ1bGxQYXRoLCBfbmV3VmFsdWUsIF9vbGRWYWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLnRyaWdnZXIoZnVsbFBhdGgsIG5ld1ZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cblxuICBhZGRMaXN0ZW5lcihwYXRoOiBzdHJpbmcsIGNiOiBDYWxsYmFja1dpdGhQYXRoKSB7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBwYXRoID0gR0xPQUJMX0tFWTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubGlzdGVuZXJzW3BhdGhdKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyc1twYXRoXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdLnB1c2goY2IpO1xuICB9XG5cbiAgdHJpZ2dlcihwYXRoOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbcGF0aF0pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0uZm9yRWFjaChjYiA9PiBjYihuZXdWYWx1ZSwgb2xkVmFsdWUsIHBhdGgpKTtcblxuICAgIC8vIOaUueWPmOS6huWvueixoe+8jOmCo+S5iOWtkOe6p+S5n+W6lOivpeaUtuWIsOmAmuefpVxuICAgIE9iamVjdC5rZXlzKHRoaXMubGlzdGVuZXJzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoa2V5ICE9PSBwYXRoICYmIGtleS5zdGFydHNXaXRoKHBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGsgPSBrZXkucmVwbGFjZShwYXRoICsgJy4nLCAnJyk7XG4gICAgICAgIGNvbnN0IG9sZFYgPSBnZXRWYWx1ZShvbGRWYWx1ZSwgayk7XG4gICAgICAgIGNvbnN0IG5ld1YgPSBnZXRWYWx1ZShuZXdWYWx1ZSwgayk7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzW2tleV0uZm9yRWFjaChjYiA9PiBjYihuZXdWLCBvbGRWLCBrZXkpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMubGlzdGVuZXJzW0dMT0FCTF9LRVldLmZvckVhY2goY2IgPT4gY2IobmV3VmFsdWUsIG9sZFZhbHVlLCBwYXRoKSk7XG4gIH1cbn1cblxuLy8gY29uc3Qgb2JqID0ge1xuLy8gICBhOiB7XG4vLyAgICAgYjogMSxcbi8vICAgfSxcbi8vIH07XG5cbi8vIGNvbnN0IHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih7XG4vLyAgIGE6IDEwLFxuLy8gICBiOiB7XG4vLyAgICAgYzogMTIsXG4vLyAgIH0sXG4vLyB9KTtcblxuLy8gd2F0Y2hlci5hZGRMaXN0ZW5lcignYicsIChhLCBiKSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKCdiIGNoYW5nZWQnLCBhLCBiKTtcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLmFkZExpc3RlbmVyKCdiLmMnLCAoYSwgYikgPT4ge1xuLy8gICBjb25zb2xlLmxvZygnYi5jIGNoYW5nZWQnLCBhLCBiKTtcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLl9kYXRhLmIgPSB7IGM6IDE1IH07XG4vLyB3YXRjaGVyLl9kYXRhLmIuYyA9ICd3YWhhaGFoYSc7XG5cbmV4cG9ydCBkZWZhdWx0IFdhdGNoZXI7XG4iLCJpbXBvcnQgTVZWTSBmcm9tICcuL01WVk0nO1xuXG5jb25zdCBpbml0aWFsRGF0YSA9ICgpID0+ICh7XG4gIG5hbWU6ICdKb2huJyxcbiAgYWdlOiAxMCxcbiAgZ2VuZGVyOiAxLFxuICBjdXJyZW50VGltZTogbmV3IERhdGUoKSxcbiAgZXh0cmE6IHtcbiAgICBsaWtlOiAnZ2FtZScsXG4gIH0sXG4gIHNob3dJbmZvOiB0cnVlLFxuICBsaXN0OiBbeyBuYW1lOiAneXF6JyB9LCB7IG5hbWU6ICdzaGVuamluZ3dlaScgfV0sXG59KTtcblxuY29uc3QgbXZ2bSA9IG5ldyBNVlZNKHtcbiAgZWw6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSEsXG4gIGRhdGE6IGluaXRpYWxEYXRhKCksXG4gIGNyZWF0ZWQodGhpczogYW55KSB7XG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHRoaXMuY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIH0sIDEwMDApO1xuICB9LFxuICBkZXN0cm95KHRoaXM6IGFueSkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gIH0sXG4gIGNvbXB1dGVkOiB7XG4gICAgZ2VuZGVyVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdlbmRlciA9PSAxID8gJ+eUtycgOiAn5aWzJztcbiAgICB9LFxuICAgIGN1cnJlbnRUaW1lU3RyKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRpbWUudG9Mb2NhbGVTdHJpbmcoKTtcbiAgICB9LFxuICB9LFxuICBtZXRob2RzOiB7XG4gICAgY2hhbmdlR2VuZGVyKCkge1xuICAgICAgdGhpcy5nZW5kZXIgPSB0aGlzLmdlbmRlciA9PSAxID8gMCA6IDE7XG4gICAgfSxcblxuICAgIHRvZ2dsZVNob3dJbmZvKCkge1xuICAgICAgdGhpcy5zaG93SW5mbyA9ICF0aGlzLnNob3dJbmZvO1xuICAgIH0sXG5cbiAgICByZXNldCgpIHtcbiAgICAgIGNvbnN0IG5ld0RhdGEgPSBpbml0aWFsRGF0YSgpO1xuICAgICAgdGhpcy5zZXREYXRhKG5ld0RhdGEpO1xuICAgIH0sXG5cbiAgICBkZWxldGUoZTogYW55KSB7XG4gICAgICBjb25zb2xlLmxvZyhlLnRhcmdldC5kYXRhc2V0LmlkKTtcbiAgICB9LFxuICB9LFxufSk7XG5cbi8vIHNldFRpbWVvdXQoKCkgPT4ge1xuLy8gICBtdnZtLmRlc3Ryb3koKTtcbi8vIH0sIDMwMDApO1xuXG5leHBvcnQgZGVmYXVsdCBudWxsO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlKG9iajogYW55LCBwYXRoOiBzdHJpbmcsIGRlZmF1bHRWYWwgPSB1bmRlZmluZWQpIHtcbiAgbGV0IHZhbCA9IG9iajtcbiAgdHJ5IHtcbiAgICB2YWwgPSBuZXcgRnVuY3Rpb24oJ2RhdGEnLCBgcmV0dXJuIGRhdGEuJHtwYXRofWApKG9iaik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbDtcbiAgfVxuICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsIDogdmFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0VmFsdWUob2JqOiBhbnksIHBhdGg6IHN0cmluZywgdmFsOiBhbnkpIHtcbiAgdHJ5IHtcbiAgICBuZXcgRnVuY3Rpb24oJ2RhdGEnLCBgZGF0YS4ke3BhdGh9PSR7SlNPTi5zdHJpbmdpZnkodmFsKX1gKShvYmopO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iajogYW55KSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmouY29uc3RydWN0b3IgPT09IE9iamVjdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRGVzY3JpcHRvcihhOiBhbnksIGI6IGFueSkge1xuICBmb3IgKGxldCBrZXkgaW4gYikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgIGEsXG4gICAgICBrZXksXG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGIsIGtleSlcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nKSB7XG4gIGxldCBpbmRleCA9IDA7XG4gIGxldCBtYXggPSBleHByZXNzaW9uLmxlbmd0aDtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBsZXQgZGVwZW5kZW5jaWVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIHdoaWxlIChpbmRleCA8IG1heCkge1xuICAgIGxldCBjaGFyID0gZXhwcmVzc2lvbi5jaGFyQXQoaW5kZXgpO1xuXG4gICAgaWYgKC8nfFwiLy50ZXN0KGNoYXIpKSB7XG4gICAgICBjb25zdCBjID0gY2hhcjtcbiAgICAgIGxldCBzdHIgPSBcIidcIjtcbiAgICAgIGNoYXIgPSBleHByZXNzaW9uLmNoYXJBdCgrK2luZGV4KTtcbiAgICAgIHdoaWxlIChjaGFyICE9PSB1bmRlZmluZWQgJiYgY2hhciAhPT0gYykge1xuICAgICAgICBzdHIgKz0gY2hhcjtcbiAgICAgICAgY2hhciA9IGV4cHJlc3Npb24uY2hhckF0KCsraW5kZXgpO1xuICAgICAgfVxuICAgICAgcmVzdWx0ICs9IHN0cjtcbiAgICAgIHJlc3VsdCArPSBcIidcIjtcbiAgICAgIGluZGV4Kys7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBsZXQgVkFSSUFCTEVTID0gL1tBLVphLXpfXS87XG4gICAgaWYgKFZBUklBQkxFUy50ZXN0KGNoYXIpKSB7XG4gICAgICBsZXQgdmFsdWUgPSAnJztcblxuICAgICAgbGV0IHBhdGggPSAnJztcbiAgICAgIGxldCBwYXRoczogc3RyaW5nW10gPSBbXTtcbiAgICAgIHdoaWxlIChjaGFyICYmIC9bQS1aYS16XzAtOS4oKV0vLnRlc3QoY2hhcikpIHtcbiAgICAgICAgdmFsdWUgKz0gY2hhcjtcblxuICAgICAgICBpZiAoY2hhciA9PT0gJy4nKSB7XG4gICAgICAgICAgcGF0aHMucHVzaChwYXRoKTtcbiAgICAgICAgICBwYXRoID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGF0aCArPSBjaGFyO1xuICAgICAgICB9XG4gICAgICAgIGNoYXIgPSBleHByZXNzaW9uWysraW5kZXhdO1xuICAgICAgfVxuXG4gICAgICBpZiAoL15bQS1aYS16XzAtOV0rJC8udGVzdChwYXRoKSkge1xuICAgICAgICBwYXRocy5wdXNoKHBhdGgpO1xuICAgICAgfVxuXG4gICAgICBkZXBlbmRlbmNpZXMucHVzaChwYXRocy5qb2luKCcuJykpO1xuICAgICAgcmVzdWx0ICs9ICd0aGlzLicgKyB2YWx1ZSArIChjaGFyIHx8ICcnKTtcbiAgICAgIGluZGV4Kys7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZXN1bHQgKz0gY2hhcjtcbiAgICBpbmRleCsrO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBleHByZXNzaW9uOiByZXN1bHQsXG4gICAgZGVwZW5kZW5jaWVzLFxuICB9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==