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


function mergeDescriptor(a, b) {
    for (let key in b) {
        Object.defineProperty(a, key, 
        // @ts-ignore
        Object.getOwnPropertyDescriptor(b, key));
    }
}
class MVVM {
    constructor(config) {
        this.el = config.el;
        this.watcher = new _Watcher__WEBPACK_IMPORTED_MODULE_0__["default"](config.data);
        this.config = config;
        mergeDescriptor(this, this.watcher._data);
        this.initMethods();
        this.traversEL(config.el);
        this.initComputed();
        if (config.created) {
            config.created.call(this);
        }
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
                    node.nodeValue = val;
                };
                if (isFormEl) {
                    nodeValue = node.attributes[':value']
                        ? node.attributes[':value'].value
                        : '';
                    setNodeValue = (val) => {
                        node.value = val;
                    };
                }
                this.parseTemplateAndSet(nodeValue, setNodeValue, node);
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
            let scopeKeys = tpl.match(/[_-a-zA-z123456789.]+/g);
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
            // 过滤到已有的变量
            // scopeKeys = scopeKeys.filter(k => this.tokens[k] !== undefined);
            const fn = new Function('return this.' + tpl).bind(this);
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
    constructor(data) {
        this.listeners = {};
        this._data = this.traverseData(data);
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
        let parent = this._data;
        const pathArr = fullPath.split('.');
        if (pathArr.length >= 2) {
            parent = new Function('data', `return data.${pathArr.slice(0, pathArr.length - 1).join('.')}`)(this._data);
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
                this.listeners[key].forEach(cb => cb(newV, oldV, path));
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

const initialData = {
    name: 'John',
    age: 10,
    gender: 1,
    currentTime: new Date(),
    extra: {
        like: 'game',
    },
    list: [{ name: 'yqz' }, { name: 'shenjingwei' }],
};
new _MVVM__WEBPACK_IMPORTED_MODULE_0__["default"]({
    el: document.getElementById('app'),
    data: initialData,
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
        currentTimeDateStr() {
            return this.currentTime.toLocaleTimeString();
        },
    },
    methods: {
        changeGender() {
            this.gender = this.gender == 1 ? 0 : 1;
        },
        reset() {
            this.name = 'john';
            Object.keys(initialData).forEach(k => {
                // @ts-ignore
                this[k] = initialData[k];
            });
        },
        delete(e) {
            console.log(e.target.dataset.id);
        },
    },
});
/* harmony default export */ __webpack_exports__["default"] = (null);


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: getValue, setValue, isPlainObject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getValue", function() { return getValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setValue", function() { return setValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPlainObject", function() { return isPlainObject; });
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL01WVk0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFnQztBQUNhO0FBRTdDLFNBQVMsZUFBZSxDQUFDLENBQU0sRUFBRSxDQUFNO0lBQ3JDLEtBQUssSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO1FBQ2pCLE1BQU0sQ0FBQyxjQUFjLENBQ25CLENBQUMsRUFDRCxHQUFHO1FBQ0gsYUFBYTtRQUNiLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQ3hDLENBQUM7S0FDSDtBQUNI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LENBQUMsQ0FBQztBQUVZLG1FQUFJLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUNuRHBCO0FBQUE7QUFBQTtBQUFBO0FBQU8sU0FBUyxRQUFRLENBQUMsR0FBUSxFQUFFLElBQVksRUFBRSxVQUFVLEdBQUcsU0FBUztJQUNyRSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDZCxJQUFJO1FBQ0YsR0FBRyxHQUFHLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRSxlQUFlLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDeEQ7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxHQUFHLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztBQUM5QyxDQUFDO0FBRU0sU0FBUyxRQUFRLENBQUMsR0FBUSxFQUFFLElBQVksRUFBRSxHQUFRO0lBQ3ZELElBQUk7UUFDRixJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbEU7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU87S0FDUjtBQUNILENBQUM7QUFHTSxTQUFTLGFBQWEsQ0FBQyxHQUFRO0lBQ3BDLE9BQU8sT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDO0FBQy9ELENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi9XYXRjaGVyJztcbmltcG9ydCB7IGdldFZhbHVlLCBzZXRWYWx1ZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBtZXJnZURlc2NyaXB0b3IoYTogYW55LCBiOiBhbnkpIHtcbiAgZm9yIChsZXQga2V5IGluIGIpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXG4gICAgICBhLFxuICAgICAga2V5LFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihiLCBrZXkpXG4gICAgKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgTVZWTUNvbmZpZyB7XG4gIGVsOiBIVE1MRWxlbWVudDtcbiAgZGF0YTogYW55O1xuICBjcmVhdGVkPzogKCgpID0+IHZvaWQpIHwgdW5kZWZpbmVkO1xuICBkZXN0cm95PzogKCgpID0+IHZvaWQpIHwgdW5kZWZpbmVkO1xuICBjb21wdXRlZDogYW55O1xuICBtZXRob2RzOiBhbnk7XG59XG5cbmNsYXNzIE1WVk0ge1xuICBlbDogSFRNTEVsZW1lbnQ7XG4gIHdhdGNoZXI6IFdhdGNoZXI7XG4gIGNvbmZpZzogTVZWTUNvbmZpZztcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IE1WVk1Db25maWcpIHtcbiAgICB0aGlzLmVsID0gY29uZmlnLmVsO1xuICAgIHRoaXMud2F0Y2hlciA9IG5ldyBXYXRjaGVyKGNvbmZpZy5kYXRhKTtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIG1lcmdlRGVzY3JpcHRvcih0aGlzLCB0aGlzLndhdGNoZXIuX2RhdGEpO1xuICAgIHRoaXMuaW5pdE1ldGhvZHMoKTtcbiAgICB0aGlzLnRyYXZlcnNFTChjb25maWcuZWwpO1xuICAgIHRoaXMuaW5pdENvbXB1dGVkKCk7XG5cbiAgICBpZiAoY29uZmlnLmNyZWF0ZWQpIHtcbiAgICAgIGNvbmZpZy5jcmVhdGVkLmNhbGwodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgaW5pdENvbXB1dGVkKCkge1xuICAgIGNvbnN0IGNvbXB1dGVkID0gdGhpcy5jb25maWcuY29tcHV0ZWQgfHwge307XG5cbiAgICBjb25zdCBjb21wdXRlZEtleXMgPSBPYmplY3Qua2V5cyhjb21wdXRlZCk7XG4gICAgdGhpcy53YXRjaGVyLmFkZExpc3RlbmVyKCcnLCAobiwgbywga2V5KSA9PiB7XG4gICAgICBpZiAoY29tcHV0ZWRLZXlzLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbXB1dGVkS2V5cy5mb3JFYWNoKGNrZXkgPT4ge1xuICAgICAgICB0aGlzW2NrZXldID0gY29tcHV0ZWRbY2tleV0uY2FsbCh0aGlzKTtcbiAgICAgICAgdGhpcy53YXRjaGVyLnRyaWdnZXIoY2tleSwgdGhpc1tja2V5XSwgJycpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgY29tcHV0ZWRLZXlzLmZvckVhY2goY2tleSA9PiB7XG4gICAgICB0aGlzW2NrZXldID0gY29tcHV0ZWRbY2tleV0uY2FsbCh0aGlzKTtcbiAgICAgIHRoaXMud2F0Y2hlci50cmlnZ2VyKGNrZXksIHRoaXNbY2tleV0sICcnKTtcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRNZXRob2RzKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLm1ldGhvZHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXNba2V5XSA9IHRoaXMuY29uZmlnLm1ldGhvZHNba2V5XS5iaW5kKHRoaXMpO1xuICAgIH0pO1xuICB9XG5cbiAgdHJhdmVyc0VMKGVsOiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMudHJhdmVyc0F0dHIoZWwpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWwuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgbm9kZTogYW55ID0gZWwuY2hpbGROb2Rlc1tpXTtcbiAgICAgIGNvbnN0IG5vZGVOYW1lID0gbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgY29uc3QgaXNGb3JtRWwgPVxuICAgICAgICBbJ2lucHV0JywgJ3RleHRBcmVhJywgJ2NoZWNrYm94JywgJ3NlbGVjdCcsICdyYWRpbyddLmluZGV4T2YoXG4gICAgICAgICAgbm9kZU5hbWVcbiAgICAgICAgKSA+PSAwO1xuXG4gICAgICAvLyB0ZXh0XG4gICAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMyB8fCBpc0Zvcm1FbCkge1xuICAgICAgICBsZXQgbm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWUhO1xuXG4gICAgICAgIGxldCBzZXROb2RlVmFsdWUgPSAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBub2RlLm5vZGVWYWx1ZSA9IHZhbDtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoaXNGb3JtRWwpIHtcbiAgICAgICAgICBub2RlVmFsdWUgPSBub2RlLmF0dHJpYnV0ZXNbJzp2YWx1ZSddXG4gICAgICAgICAgICA/IG5vZGUuYXR0cmlidXRlc1snOnZhbHVlJ10udmFsdWVcbiAgICAgICAgICAgIDogJyc7XG4gICAgICAgICAgc2V0Tm9kZVZhbHVlID0gKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBub2RlLnZhbHVlID0gdmFsO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBhcnNlVGVtcGxhdGVBbmRTZXQobm9kZVZhbHVlLCBzZXROb2RlVmFsdWUsIG5vZGUpO1xuICAgICAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgIHRoaXMudHJhdmVyc0VMKG5vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRyYXZlcnNBdHRyKG5vZGU6IEhUTUxFbGVtZW50KSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBub2RlLmF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyID0gbm9kZS5hdHRyaWJ1dGVzW2ldO1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgaWYgKGF0dHIubmFtZS5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYXR0ci5uYW1lLnN1YnN0cigxKTtcbiAgICAgICAgY29uc3QgZXZlbnRGdW5jTmFtZSA9IGF0dHIudmFsdWU7XG4gICAgICAgIGlmICh0aGlzW2V2ZW50RnVuY05hbWVdKSB7XG4gICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpc1tldmVudEZ1bmNOYW1lXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFyc2VUZW1wbGF0ZUFuZFNldChhdHRyLnZhbHVlLCAodmFsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIHZhbCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHBhcnNlVGVtcGxhdGVBbmRTZXQoXG4gICAgdGVtcGxhdGU6IHN0cmluZyxcbiAgICBzZXROb2RlVmFsdWU6ICh2YWw6IHN0cmluZykgPT4gdm9pZCxcbiAgICBmb3JtTm9kZT86IGFueVxuICApIHtcbiAgICBjb25zdCB2YWx1ZVJlZ2V4cCA9IC97eyhbXn1dKyl9fS9nO1xuXG4gICAgbGV0IHJlc3VsdCA9IHZhbHVlUmVnZXhwLmV4ZWModGVtcGxhdGUpO1xuICAgIGxldCBhbGxTY29wZUtleXM6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IGNhbENvbnRleHRzOiBBcnJheTx7XG4gICAgICBzdGFydEluZGV4OiBudW1iZXI7XG4gICAgICBlbmRJbmRleDogbnVtYmVyO1xuICAgICAgY2FsOiAoKSA9PiBzdHJpbmc7XG4gICAgfT4gPSBbXTtcblxuICAgIHdoaWxlIChyZXN1bHQpIHtcbiAgICAgIGNvbnN0IHsgaW5kZXggfSA9IHJlc3VsdDtcbiAgICAgIGxldCB0cGwgPSByZXN1bHRbMV07XG4gICAgICBsZXQgZnVsbFRwbCA9IHJlc3VsdFswXTtcbiAgICAgIGxldCBzY29wZUtleXM6IHN0cmluZ1tdID0gdHBsLm1hdGNoKC9bXy1hLXpBLXoxMjM0NTY3ODkuXSsvZykgYXMgYW55O1xuICAgICAgaWYgKGZvcm1Ob2RlKSB7XG4gICAgICAgIGNvbnN0IG5vZGVOYW1lID0gZm9ybU5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgc3dpdGNoIChub2RlTmFtZSkge1xuICAgICAgICAgIGNhc2UgJ2lucHV0JzpcbiAgICAgICAgICBjYXNlICd0ZXh0YXJlYSc6IHtcbiAgICAgICAgICAgIGZvcm1Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGU6IGFueSkgPT4ge1xuICAgICAgICAgICAgICBzZXRWYWx1ZSh0aGlzLCBzY29wZUtleXNbMF0sIGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6IHtcbiAgICAgICAgICAgIHNldE5vZGVWYWx1ZSA9ICh2YWw6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICBmb3JtTm9kZS52YWx1ZSA9IHZhbDtcbiAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGZvcm1Ob2RlLnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGlvbicpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IG9wdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbC50b1N0cmluZygpKSB7XG4gICAgICAgICAgICAgICAgICBpdGVtLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZvcm1Ob2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgc2V0VmFsdWUodGhpcywgc2NvcGVLZXlzWzBdLCBlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyDov4fmu6TliLDlt7LmnInnmoTlj5jph49cbiAgICAgIC8vIHNjb3BlS2V5cyA9IHNjb3BlS2V5cy5maWx0ZXIoayA9PiB0aGlzLnRva2Vuc1trXSAhPT0gdW5kZWZpbmVkKTtcblxuICAgICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzLicgKyB0cGwpLmJpbmQodGhpcyk7XG5cbiAgICAgIGFsbFNjb3BlS2V5cyA9IFsuLi5hbGxTY29wZUtleXMsIC4uLnNjb3BlS2V5c107XG4gICAgICBjYWxDb250ZXh0cyA9IFtcbiAgICAgICAgLi4uY2FsQ29udGV4dHMsXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFydEluZGV4OiBpbmRleCxcbiAgICAgICAgICBlbmRJbmRleDogaW5kZXggKyBmdWxsVHBsLmxlbmd0aCxcbiAgICAgICAgICBjYWw6ICgpID0+IGZuLmFwcGx5KHRoaXMpLFxuICAgICAgICB9LFxuICAgICAgXTtcblxuICAgICAgaWYgKCFmb3JtTm9kZSkge1xuICAgICAgICByZXN1bHQgPSB2YWx1ZVJlZ2V4cC5leGVjKHRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjYWxWYWx1ZSA9ICgpID0+IHtcbiAgICAgIGxldCBsYXN0ZW5kID0gMDtcbiAgICAgIGxldCB2YWx1ZSA9ICcnO1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjYWxDb250ZXh0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFsdWUgKz0gdGVtcGxhdGUuc2xpY2UobGFzdGVuZCwgY2FsQ29udGV4dHNbaV0uc3RhcnRJbmRleCk7XG4gICAgICAgIHZhbHVlICs9IGNhbENvbnRleHRzW2ldLmNhbCgpO1xuICAgICAgICB2YWx1ZSArPSB0ZW1wbGF0ZS5zbGljZShcbiAgICAgICAgICBjYWxDb250ZXh0c1tpXS5lbmRJbmRleCxcbiAgICAgICAgICBpIDwgbCAtIDEgPyBjYWxDb250ZXh0c1tpICsgMV0uc3RhcnRJbmRleCA6IHVuZGVmaW5lZFxuICAgICAgICApO1xuICAgICAgICBsYXN0ZW5kID0gY2FsQ29udGV4dHNbaV0uZW5kSW5kZXg7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlICs9IHRlbXBsYXRlLnNsaWNlKFxuICAgICAgICBsYXN0ZW5kLFxuICAgICAgICBjYWxDb250ZXh0c1tjYWxDb250ZXh0cy5sZW5ndGggLSAxXS5zdGFydEluZGV4XG4gICAgICApO1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIGFsbFNjb3BlS2V5cy5mb3JFYWNoKGsgPT4ge1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgIHNldE5vZGVWYWx1ZShjYWxWYWx1ZSgpKTtcbiAgICAgIH07XG4gICAgICB0aGlzLndhdGNoZXIuYWRkTGlzdGVuZXIoaywgbGlzdGVuZXIpO1xuICAgICAgbGlzdGVuZXIoKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNVlZNOyIsImltcG9ydCB7IGdldFZhbHVlLCBpc1BsYWluT2JqZWN0IH0gZnJvbSAnLi91dGlscyc7XG5cbnR5cGUgQ2FsbGJhY2sgPSAodmFsOiBhbnksIG9sZFZhbHVlOiBhbnkpID0+IHZvaWQ7XG50eXBlIENhbGxiYWNrV2l0aFBhdGggPSAodmFsOiBhbnksIG9sZFZhbHVlOiBhbnksIHBhdGg6IHN0cmluZykgPT4gdm9pZDtcblxuY2xhc3MgVG9rZW48VCA9IGFueT4ge1xuICBwcml2YXRlIF92YWx1ZTogVDtcbiAgLy8gQHRzLWlnbm9yZVxuICBjb25zdHJ1Y3Rvcihjb25maWc6IHsgb2JqOiBhbnk7IGtleTogc3RyaW5nOyB2YWx1ZTogVDsgY2I6IENhbGxiYWNrIH0pIHtcbiAgICBjb25zdCBzY29wZSA9IHRoaXM7XG4gICAgY29uc3QgeyBrZXksIHZhbHVlLCBvYmosIGNiIH0gPSBjb25maWc7XG5cbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiByZWFjdGl2ZVNldHRlcigpIHtcbiAgICAgICAgcmV0dXJuIHNjb3BlLl92YWx1ZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHJlYWN0aXZlR2V0dGVyKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gc2NvcGUuX3ZhbHVlO1xuICAgICAgICBzY29wZS5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICAgIGNiKHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgR0xPQUJMX0tFWSA9ICdHTE9BQkwnO1xuXG5jbGFzcyBXYXRjaGVyIHtcbiAgX2RhdGE6IHsgW2tleTogc3RyaW5nXTogYW55IH07XG4gIGxpc3RlbmVyczoge1xuICAgIFtwYXRoOiBzdHJpbmddOiBDYWxsYmFja1dpdGhQYXRoW107XG4gIH0gPSB7fTtcbiAgY29uc3RydWN0b3IoZGF0YTogYW55KSB7XG4gICAgdGhpcy5fZGF0YSA9IHRoaXMudHJhdmVyc2VEYXRhKGRhdGEpO1xuICB9XG5cbiAgdHJhdmVyc2VEYXRhKGRhdGE6IGFueSwgcGF0aCA9ICcnKSB7XG4gICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgZnVsbFBhdGggPSAocGF0aCA/IHBhdGggKyAnLicgOiAnJykgKyBrZXk7XG5cbiAgICAgIG5ldyBUb2tlbih7XG4gICAgICAgIG9iajogcmVzdWx0LFxuICAgICAgICBrZXksXG4gICAgICAgIHZhbHVlOiBpc1BsYWluT2JqZWN0KGRhdGFba2V5XSlcbiAgICAgICAgICA/IHRoaXMudHJhdmVyc2VEYXRhKGRhdGFba2V5XSwgZnVsbFBhdGgpXG4gICAgICAgICAgOiBkYXRhW2tleV0sXG4gICAgICAgIGNiOiAobmV3VmFsLCBvbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGgsIG5ld1ZhbCwgb2xkVmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGhhbmRsZVZhbHVlQ2hhbmdlKGZ1bGxQYXRoOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnksIG9sZFZhbHVlOiBhbnkpIHtcbiAgICBsZXQgcGFyZW50ID0gdGhpcy5fZGF0YTtcbiAgICBjb25zdCBwYXRoQXJyID0gZnVsbFBhdGguc3BsaXQoJy4nKTtcbiAgICBpZiAocGF0aEFyci5sZW5ndGggPj0gMikge1xuICAgICAgcGFyZW50ID0gbmV3IEZ1bmN0aW9uKFxuICAgICAgICAnZGF0YScsXG4gICAgICAgIGByZXR1cm4gZGF0YS4ke3BhdGhBcnIuc2xpY2UoMCwgcGF0aEFyci5sZW5ndGggLSAxKS5qb2luKCcuJyl9YFxuICAgICAgKSh0aGlzLl9kYXRhKTtcbiAgICB9XG5cbiAgICBjb25zdCBrZXk6IHN0cmluZyA9IHBhdGhBcnIucG9wKCkhO1xuXG4gICAgaWYgKGlzUGxhaW5PYmplY3QobmV3VmFsdWUpKSB7XG4gICAgICBuZXcgVG9rZW4oe1xuICAgICAgICBvYmo6IHBhcmVudCxcbiAgICAgICAga2V5LFxuICAgICAgICB2YWx1ZTogdGhpcy50cmF2ZXJzZURhdGEobmV3VmFsdWUsIGZ1bGxQYXRoKSxcbiAgICAgICAgY2I6IChfbmV3VmFsdWUsIF9vbGRWYWx1ZSkgPT4ge1xuICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2UoZnVsbFBhdGgsIF9uZXdWYWx1ZSwgX29sZFZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcihmdWxsUGF0aCwgbmV3VmFsdWUsIG9sZFZhbHVlKTtcbiAgfVxuXG4gIGFkZExpc3RlbmVyKHBhdGg6IHN0cmluZywgY2I6IENhbGxiYWNrV2l0aFBhdGgpIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHBhdGggPSBHTE9BQkxfS0VZO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5saXN0ZW5lcnNbcGF0aF0pIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzW3BhdGhdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0ucHVzaChjYik7XG4gIH1cblxuICB0cmlnZ2VyKHBhdGg6IHN0cmluZywgbmV3VmFsdWU6IGFueSwgb2xkVmFsdWU6IGFueSkge1xuICAgIGlmICghcGF0aCkge1xuICAgICAgcGF0aCA9IEdMT0FCTF9LRVk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmxpc3RlbmVyc1twYXRoXSkge1xuICAgICAgdGhpcy5saXN0ZW5lcnNbcGF0aF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyc1twYXRoXS5mb3JFYWNoKGNiID0+IGNiKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgcGF0aCkpO1xuXG4gICAgLy8g5pS55Y+Y5LqG5a+56LGh77yM6YKj5LmI5a2Q57qn5Lmf5bqU6K+l5pS25Yiw6YCa55+lXG4gICAgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChrZXkgIT09IHBhdGggJiYga2V5LnN0YXJ0c1dpdGgocGF0aCkpIHtcbiAgICAgICAgY29uc3QgayA9IGtleS5yZXBsYWNlKHBhdGggKyAnLicsICcnKTtcbiAgICAgICAgY29uc3Qgb2xkViA9IGdldFZhbHVlKG9sZFZhbHVlLCBrKTtcbiAgICAgICAgY29uc3QgbmV3ViA9IGdldFZhbHVlKG5ld1ZhbHVlLCBrKTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNba2V5XS5mb3JFYWNoKGNiID0+IGNiKG5ld1YsIG9sZFYsIHBhdGgpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMubGlzdGVuZXJzW0dMT0FCTF9LRVldLmZvckVhY2goY2IgPT4gY2IobmV3VmFsdWUsIG9sZFZhbHVlLCBwYXRoKSk7XG4gIH1cbn1cblxuLy8gY29uc3Qgb2JqID0ge1xuLy8gICBhOiB7XG4vLyAgICAgYjogMSxcbi8vICAgfSxcbi8vIH07XG5cbi8vIGNvbnN0IHdhdGNoZXIgPSBuZXcgV2F0Y2hlcih7XG4vLyAgIGE6IDEwLFxuLy8gICBiOiB7XG4vLyAgICAgYzogMTIsXG4vLyAgIH0sXG4vLyB9KTtcblxuLy8gd2F0Y2hlci5hZGRMaXN0ZW5lcignYicsIChhLCBiKSA9PiB7XG4vLyAgIGNvbnNvbGUubG9nKCdiIGNoYW5nZWQnLCBhLCBiKTtcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLmFkZExpc3RlbmVyKCdiLmMnLCAoYSwgYikgPT4ge1xuLy8gICBjb25zb2xlLmxvZygnYi5jIGNoYW5nZWQnLCBhLCBiKTtcbi8vIH0pO1xuXG4vLyB3YXRjaGVyLl9kYXRhLmIgPSB7IGM6IDE1IH07XG4vLyB3YXRjaGVyLl9kYXRhLmIuYyA9ICd3YWhhaGFoYSc7XG5cbmV4cG9ydCBkZWZhdWx0IFdhdGNoZXI7XG4iLCJpbXBvcnQgTVZWTSBmcm9tICcuL01WVk0nO1xuXG5jb25zdCBpbml0aWFsRGF0YSA9IHtcbiAgbmFtZTogJ0pvaG4nLFxuICBhZ2U6IDEwLFxuICBnZW5kZXI6IDEsXG4gIGN1cnJlbnRUaW1lOiBuZXcgRGF0ZSgpLFxuICBleHRyYToge1xuICAgIGxpa2U6ICdnYW1lJyxcbiAgfSxcbiAgbGlzdDogW3sgbmFtZTogJ3lxeicgfSwgeyBuYW1lOiAnc2hlbmppbmd3ZWknIH1dLFxufTtcblxubmV3IE1WVk0oe1xuICBlbDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpISxcbiAgZGF0YTogaW5pdGlhbERhdGEsXG4gIGNyZWF0ZWQodGhpczogYW55KSB7XG4gICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHRoaXMuY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIH0sIDEwMDApO1xuICB9LFxuICBkZXN0cm95KHRoaXM6IGFueSkge1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gIH0sXG4gIGNvbXB1dGVkOiB7XG4gICAgZ2VuZGVyVGV4dCgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdlbmRlciA9PSAxID8gJ+eUtycgOiAn5aWzJztcbiAgICB9LFxuICAgIGN1cnJlbnRUaW1lRGF0ZVN0cigpIHtcbiAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRUaW1lLnRvTG9jYWxlVGltZVN0cmluZygpO1xuICAgIH0sXG4gIH0sXG4gIG1ldGhvZHM6IHtcbiAgICBjaGFuZ2VHZW5kZXIoKSB7XG4gICAgICB0aGlzLmdlbmRlciA9IHRoaXMuZ2VuZGVyID09IDEgPyAwIDogMTtcbiAgICB9LFxuXG4gICAgcmVzZXQoKSB7XG4gICAgICB0aGlzLm5hbWUgPSAnam9obic7XG4gICAgICBPYmplY3Qua2V5cyhpbml0aWFsRGF0YSkuZm9yRWFjaChrID0+IHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzW2tdID0gaW5pdGlhbERhdGFba107XG4gICAgICB9KTtcbiAgICB9LFxuXG4gICAgZGVsZXRlKGU6IGFueSkge1xuICAgICAgY29uc29sZS5sb2coZS50YXJnZXQuZGF0YXNldC5pZCk7XG4gICAgfSxcbiAgfSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBudWxsO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlKG9iajogYW55LCBwYXRoOiBzdHJpbmcsIGRlZmF1bHRWYWwgPSB1bmRlZmluZWQpIHtcbiAgbGV0IHZhbCA9IG9iajtcbiAgdHJ5IHtcbiAgICB2YWwgPSBuZXcgRnVuY3Rpb24oJ2RhdGEnLCBgcmV0dXJuIGRhdGEuJHtwYXRofWApKG9iaik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbDtcbiAgfVxuICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsIDogdmFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0VmFsdWUob2JqOiBhbnksIHBhdGg6IHN0cmluZywgdmFsOiBhbnkpIHtcbiAgdHJ5IHtcbiAgICBuZXcgRnVuY3Rpb24oJ2RhdGEnLCBgZGF0YS4ke3BhdGh9PSR7SlNPTi5zdHJpbmdpZnkodmFsKX1gKShvYmopO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGxhaW5PYmplY3Qob2JqOiBhbnkpIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xufVxuXG4iXSwic291cmNlUm9vdCI6IiJ9