"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function createEl(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
}
function mergeContext(context, parentContext) {
    for (var key in parentContext) {
        Object.defineProperty(context, key, 
        // @ts-ignore
        Object.getOwnPropertyDescriptor(parentContext, key));
    }
}
var Token = /** @class */ (function () {
    // @ts-ignore
    function Token(config) {
        this.cbs = [];
        var scope = this;
        var key = config.key, value = config.value, context = config.context;
        this._value = value;
        Object.defineProperty(context, key, {
            enumerable: true,
            get: function () {
                return scope._value;
            },
            set: function (value) {
                var oldValue = scope._value;
                scope._value = value;
                if (oldValue !== value) {
                    scope.cbs.forEach(function (cb) { return cb(value); });
                }
            },
        });
    }
    Token.prototype.addListener = function (cb) {
        this.cbs.push(cb);
    };
    return Token;
}());
var DomWatcher = /** @class */ (function () {
    function DomWatcher(context, el, tokens) {
        this.context = context;
        this.el = el;
        this.tokens = tokens;
        this.traversEL(this.el);
    }
    DomWatcher.prototype.traversEL = function (el) {
        var _this = this;
        var _loop_1 = function (i) {
            var node = el.childNodes[i];
            var nodeName = node.nodeName.toLowerCase();
            var isFormEl = ['input', 'textArea', 'checkbox', 'select', 'radio'].indexOf(nodeName) >= 0;
            // text
            if (node.nodeType === 3 || isFormEl) {
                var nodeValue = node.nodeValue;
                var setNodeValue = function (val) {
                    node.nodeValue = val;
                };
                if (isFormEl) {
                    nodeValue = node.attributes[':value']
                        ? node.attributes[':value'].value
                        : '';
                    setNodeValue = function (val) {
                        node.value = val;
                    };
                }
                this_1.parseTemplateAndSet(nodeValue, setNodeValue, node);
            }
            else if (node.nodeType === 1) {
                // 遇到了for
                if (node.attributes[':for']) {
                    var startArchor_1 = document.createComment('for start');
                    var endArchor_1 = document.createComment('for end');
                    node.replaceWith(endArchor_1);
                    endArchor_1.parentNode.insertBefore(startArchor_1, endArchor_1);
                    var valueRegexp = /{{([^}]+)}}/g;
                    var result = valueRegexp.exec(node.attributes[':for'].value);
                    if (result && result[1].trim()) {
                        this_1.context[result[1].trim()].forEach(function (item) {
                            var newEl = document.createElement(node.nodeName);
                            newEl.innerHTML = node.innerHTML;
                            new ArrayController(newEl, {
                                data: item,
                                key: (node.attributes[':for-key']
                                    ? node.attributes[':for-key'].value
                                    : 'item').trim(),
                                parentContext: _this.context,
                                startArchor: startArchor_1,
                                endArchor: endArchor_1,
                                tokens: _this.tokens,
                            });
                        });
                    }
                }
                else {
                    this_1.traversAttr(node);
                    this_1.traversEL(node);
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < el.childNodes.length; i++) {
            _loop_1(i);
        }
    };
    DomWatcher.prototype.traversAttr = function (node) {
        var _loop_2 = function (i, l) {
            var attr = node.attributes[i];
            // @ts-ignore
            if (attr.name.startsWith('@')) {
                var eventName = attr.name.substr(1);
                var eventFuncName = attr.value;
                if (this_2.context[eventFuncName]) {
                    node.addEventListener(eventName, this_2.context[eventFuncName]);
                }
            }
            else {
                this_2.parseTemplateAndSet(attr.value, function (val) {
                    node.setAttribute(attr.name, val);
                });
            }
        };
        var this_2 = this;
        for (var i = 0, l = node.attributes.length; i < l; i++) {
            _loop_2(i, l);
        }
    };
    DomWatcher.prototype.parseTemplateAndSet = function (template, setNodeValue, formNode) {
        var _this = this;
        var valueRegexp = /{{([^}]+)}}/g;
        var result = valueRegexp.exec(template);
        var allScopeKeys = [];
        var calContexts = [];
        var _loop_3 = function () {
            var index = result.index;
            var tpl = result[1];
            var fullTpl = result[0];
            var scopeKeys = tpl.match(/[_-a-zA-z123456789]+/g);
            if (formNode) {
                var nodeName = formNode.nodeName.toLowerCase();
                switch (nodeName) {
                    case 'input':
                    case 'textarea': {
                        formNode.addEventListener('input', function (e) {
                            // @ts-ignore
                            _this.context[scopeKeys[0]] = e.target.value;
                        });
                        break;
                    }
                    case 'select': {
                        setNodeValue = function (val) {
                            formNode.value = val;
                            var options = formNode.querySelectorAll('option');
                            for (var i = 0, l = options.length; i < l; i++) {
                                var item = options[i];
                                if (item.value === val.toString()) {
                                    item.selected = true;
                                }
                                else {
                                    item.selected = false;
                                }
                            }
                        };
                        formNode.addEventListener('change', function (e) {
                            // @ts-ignore
                            _this.context[scopeKeys[0]] = e.target.value;
                        });
                        break;
                    }
                }
                result = null;
            }
            // 过滤到已有的变量
            scopeKeys = scopeKeys.filter(function (k) { return _this.tokens[k] !== undefined; });
            var fn = new (Function.bind.apply(Function, [void 0].concat(scopeKeys, ['return ' + tpl])))().bind(this_3.context);
            allScopeKeys = allScopeKeys.concat(scopeKeys);
            calContexts = calContexts.concat([
                {
                    startIndex: index,
                    endIndex: index + fullTpl.length,
                    cal: function () {
                        return fn.apply(_this.context, scopeKeys.map(function (i) { return _this.context[i]; }));
                    },
                },
            ]);
            if (!formNode) {
                result = valueRegexp.exec(template);
            }
        };
        var this_3 = this;
        while (result) {
            _loop_3();
        }
        var calValue = function () {
            var lastend = 0;
            var value = '';
            for (var i = 0, l = calContexts.length; i < l; i++) {
                value += template.slice(lastend, calContexts[i].startIndex);
                value += calContexts[i].cal();
                value += template.slice(calContexts[i].endIndex, i < l - 1 ? calContexts[i + 1].startIndex : undefined);
                lastend = calContexts[i].endIndex;
            }
            value += template.slice(lastend, calContexts[calContexts.length - 1].startIndex);
            return value;
        };
        allScopeKeys.forEach(function (k) {
            var listener = function () {
                setNodeValue(calValue());
            };
            _this.tokens[k].addListener(listener);
            listener();
        });
    };
    return DomWatcher;
}());
var Controller = /** @class */ (function () {
    function Controller(el, config) {
        this.tokens = {};
        this.keys = Object.keys(config.data);
        this.data = config.data;
        this.config = __assign({ computed: {}, methods: {} }, config);
        this.el = el;
        this.initContext();
        this.domWatcher = new DomWatcher(this.context, el, this.tokens);
        this.context.inited && this.context.inited();
    }
    Controller.prototype.initContext = function () {
        var _this = this;
        // @ts-ignore
        this.context = __assign({}, this.config.context, { inited: this.config.inited });
        this.keys.forEach(function (key) {
            _this.tokens[key] = new Token({
                context: _this.context,
                key: key,
                // @ts-ignore
                value: _this.data[key],
            });
        });
        Object.keys(this.config.computed).forEach(function (key) {
            var value = _this.config.computed[key].call(_this.context);
            _this.tokens[key] = new Token({
                context: _this.context,
                key: key,
                // @ts-ignore
                value: value,
            });
            _this.keys.forEach(function (vKey) {
                _this.tokens[vKey].addListener(function () {
                    // @ts-ignore
                    _this.context[key] = _this.config.computed[key].call(_this.context);
                });
            });
        });
        Object.keys(this.config.methods).forEach(function (key) {
            // @ts-ignore
            _this.context[key] = _this.config.methods[key].bind(_this.context);
        });
    };
    Controller.prototype.destroy = function () {
        this.config.destroy && this.config.destroy();
        this.tokens = {};
    };
    return Controller;
}());
var ArrayController = /** @class */ (function () {
    function ArrayController(el, config) {
        this.tokens = {};
        var data = config.data, key = config.key, parentContext = config.parentContext, tokens = config.tokens, startArchor = config.startArchor, endArchor = config.endArchor;
        var context = {};
        this.tokens['item'] = new Token({
            context: context,
            key: key,
            // @ts-ignore
            value: data,
        });
        mergeContext(context, parentContext);
        new DomWatcher(context, el, __assign({}, this.tokens));
        startArchor.parentNode.insertBefore(el, endArchor);
    }
    return ArrayController;
}());
var root = document.getElementById('scope-1');
var initialData = {
    name: 'John',
    age: 10,
    gender: 1,
    currentTime: new Date(),
    list: [{ name: 'yqz' }, { name: 'shenjingwei' }],
};
new Controller(root, {
    data: initialData,
    inited: function () {
        var _this = this;
        this.interval = setInterval(function () {
            _this.currentTime = new Date();
        }, 1000);
    },
    destroy: function () {
        clearInterval(this.interval);
    },
    computed: {
        genderText: function () {
            return this.gender == 1 ? '男' : '女';
        },
        currentTimeDateStr: function () {
            return this.currentTime.toLocaleTimeString();
        },
    },
    methods: {
        submit: function () {
            this.gender = this.gender == 1 ? 0 : 1;
        },
        reset: function () {
            var _this = this;
            this.name = 'john';
            Object.keys(initialData).forEach(function (k) {
                // @ts-ignore
                _this[k] = initialData[k];
            });
        },
        delete: function (e) {
            console.log(e.target.dataset.id);
        },
    },
});
//# sourceMappingURL=index.js.map