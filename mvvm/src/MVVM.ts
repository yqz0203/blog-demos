import Watcher from './Watcher';
import { getValue, toRealValue, setValue, parseExpression } from './utils';
import Directive, { DirectiveConfig } from './Directive';

interface MVVMConfig {
  el: HTMLElement;
  data: any;
  created?: () => void;
  destroy?: () => void;
  computed: any;
  methods: any;
}

class MVVM {
  static directiveDefinitions: { [key: string]: DirectiveConfig } = {};
  static directive = function(name: string, config: DirectiveConfig) {
    MVVM.directiveDefinitions[name] = config;
  };

  $el: HTMLElement;
  $watcher: Watcher;
  private config: MVVMConfig;
  [key: string]: any;
  private directives: Directive[] = [];
  constructor(config: MVVMConfig) {
    this.$el = config.el;
    this.$watcher = new Watcher(this, config.data);
    this.config = config;

    this.initLifeCycles();
    this.initMethods();
    this.traversEL(config.el);
    this.initComputed();
    this.created(this);
  }

  setData(newData: any) {
    if (!newData) return;
    Object.keys(newData).forEach(k => {
      // @ts-ignore
      this[k] = newData[k];
    });
  }

  private initLifeCycles() {
    this['created'] = () => {
      this.config.created && this.config.created.call(this);
    };

    this['destroy'] = () => {
      this.directives.forEach(d => d.destroy());
      this.$watcher.removeAllListeners();
      this.config.destroy && this.config.destroy.call(this);
    };
  }

  private initComputed() {
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

  private initMethods() {
    Object.keys(this.config.methods).forEach(key => {
      // @ts-ignore
      this[key] = this.config.methods[key].bind(this);
    });
  }

  private traversEL(el: HTMLElement) {
    this.traversAttr(el);
    for (let i = 0; i < el.childNodes.length; i++) {
      const node: any = el.childNodes[i];

      // text
      if (node.nodeType === 3) {
        let nodeValue = node.nodeValue!;

        let setNodeValue = (val: string) => {
          // chrome 不会触发重绘
          // if (node.nodeValue !== val) {
          node.nodeValue = val;
          // }
        };

        this.parseTemplateAndSet(nodeValue, setNodeValue);
      } else if (node.nodeType === 1) {
        this.traversEL(node);
      }
    }
  }

  private traversAttr(node: HTMLElement) {
    const shouldRemoveAttrs: string[] = [];

    for (let i = 0, l = node.attributes.length; i < l; i++) {
      const attr = node.attributes[i];

      if (!attr) return;

      if (attr.name.startsWith('x-')) {
        const directiveName = attr.name.replace(/^x-/, '');
        const dd = MVVM.directiveDefinitions[directiveName];

        if (!dd) {
          console.warn('未知的指令：', directiveName);
        } else {
          this.directives.push(new Directive(this, node, attr.value, dd));
        }

        shouldRemoveAttrs.push(attr.name);
      }
      if (attr.name.startsWith(':')) {
        const attrName = attr.name.substr(1);
        this.parseTemplateAndSet('{{' + attr.value + '}}', (val: string) => {
          // @ts-ignore
          node[attrName] = toRealValue(val);
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
      } else {
        let cb = (val: string) => {
          node.setAttribute(attr.name, val);
        };

        this.parseTemplateAndSet(attr.value, cb);
      }
    }

    shouldRemoveAttrs.forEach(name => node.removeAttribute(name));
  }

  private parseTemplateAndSet(
    template: string,
    setNodeValue: (val: string) => void,
    formNode?: any
  ) {
    const valueRegexp = /{{([^}]+)}}/g;

    let result = valueRegexp.exec(template);
    let allScopeKeys: string[] = [];
    let calContexts: Array<{
      startIndex: number;
      endIndex: number;
      cal: () => string;
    }> = [];

    while (result) {
      const { index } = result;
      let tpl = result[1];
      let fullTpl = result[0];
      let scopeKeys: string[] = tpl.match(
        /[_-a-zA-z123456789.]+(?!.+\()/g
      ) as any;

      const parsed = parseExpression(tpl);
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
        value += template.slice(
          calContexts[i].endIndex,
          i < l - 1 ? calContexts[i + 1].startIndex : undefined
        );
        lastend = calContexts[i].endIndex;
      }

      value += template.slice(
        lastend,
        calContexts[calContexts.length - 1].startIndex
      );

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

// 内置指令
MVVM.directive('model', {
  bind(el: any, binding) {
    this.callback = (e: any) => {
      const val = e.target.value;
      setValue(this.$owner, binding.expression, val);
    };
    el.addEventListener('input', this.callback);
    el.value = binding.value;
  },
  update(el: any, binding) {
    el.value = binding.value;
  },
  unbind(el) {
    el.removeEventListener('input', this.callback);
  },
});

MVVM.directive('show', (el, binding) => {
  el.style.display = binding.value ? '' : 'none';
});

export default MVVM;
