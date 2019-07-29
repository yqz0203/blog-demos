"use strict";
var Token = /** @class */ (function () {
    // @ts-ignore
    function Token(config) {
        this.cbs = [];
        var scope = this;
        var key = config.key, value = config.value, context = config.context;
        this._value = value;
        Object.defineProperty(context, key, {
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
var Controller = /** @class */ (function () {
    function Controller(el, config) {
        this.tokens = {};
        this.keys = Object.keys(config.data);
        this.data = config.data;
        this.config = config;
        this.el = el;
        this.initContext();
        this.traversEL(el);
        this.context.inited();
    }
    Controller.prototype.initContext = function () {
        var _this = this;
        // @ts-ignore
        this.context = {
            inited: this.config.inited,
        };
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
    Controller.prototype.traversEL = function (el) {
        var _this = this;
        var _loop_1 = function (i) {
            var node = el.childNodes[i];
            var nodeName = node.nodeName.toLowerCase();
            var isFormEl = ['input', 'textArea', 'checkbox', 'select', 'radio'].indexOf(nodeName) >= 0;
            // text
            if (node.nodeType === 3 || isFormEl) {
                var valueRegexp = /{{([^}]+)}}/g;
                var nodeValue_1 = node.nodeValue;
                var setNodeValue_1 = function (val) {
                    node.nodeValue = val;
                };
                if (isFormEl) {
                    nodeValue_1 = node.attributes[':value']
                        ? node.attributes[':value'].value
                        : '';
                    setNodeValue_1 = function (val) {
                        node.value = val;
                    };
                }
                var result = valueRegexp.exec(nodeValue_1);
                var _loop_2 = function () {
                    var index = result.index;
                    var tpl = result[1];
                    var fullTpl = result[0];
                    var scopeKeys = tpl.match(/[_-a-zA-z123456789]+/g);
                    // 表单元素只执行一次
                    if (isFormEl) {
                        result = null;
                    }
                    switch (nodeName) {
                        case 'input':
                        case 'textarea': {
                            node.addEventListener('input', function (e) {
                                // @ts-ignore
                                _this.context[scopeKeys[0]] = e.target.value;
                            });
                            break;
                        }
                        case 'select': {
                            setNodeValue_1 = function (val) {
                                node.value = val;
                                var options = node.querySelectorAll('option');
                                for (var i_1 = 0, l = options.length; i_1 < l; i_1++) {
                                    var item = options[i_1];
                                    if (item.value === val.toString()) {
                                        item.selected = true;
                                    }
                                    else {
                                        item.selected = false;
                                    }
                                }
                            };
                            node.addEventListener('change', function (e) {
                                // @ts-ignore
                                _this.context[scopeKeys[0]] = e.target.value;
                            });
                            break;
                        }
                    }
                    // 过滤到已有的变量
                    scopeKeys = scopeKeys.filter(function (k) { return _this.tokens[k] !== undefined; });
                    var fn = new (Function.bind.apply(Function, [void 0].concat(scopeKeys, ['return ' + tpl])))().bind(this_1.context);
                    scopeKeys.forEach(function (k) {
                        var listener = function () {
                            setNodeValue_1(nodeValue_1.slice(0, index) +
                                // @ts-ignore
                                fn.apply(_this.context, scopeKeys.map(function (i) { return _this.context[i]; })) +
                                nodeValue_1.slice(index + tpl.length + fullTpl.length));
                        };
                        _this.tokens[k].addListener(listener);
                        listener();
                    });
                    result = valueRegexp.exec(nodeValue_1);
                };
                while (result) {
                    _loop_2();
                }
            }
            else if (node.nodeType === 1) {
                this_1.traversEL(node);
                for (var i_2 = 0, l = node.attributes.length; i_2 < l; i_2++) {
                    var attr = node.attributes[i_2];
                    if (attr.name.startsWith('@')) {
                        var eventName = attr.name.substr(1);
                        var eventFuncName = attr.value;
                        if (this_1.context[eventFuncName]) {
                            node.addEventListener(eventName, this_1.context[eventFuncName]);
                        }
                    }
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < el.childNodes.length; i++) {
            _loop_1(i);
        }
    };
    Controller.prototype.destroy = function () {
        this.config.destroy();
        this.tokens = {};
    };
    return Controller;
}());
var root = document.getElementById('scope-1');
var initialData = {
    name: 'John',
    age: 10,
    gender: 1,
    currentTime: new Date(),
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
    },
});
