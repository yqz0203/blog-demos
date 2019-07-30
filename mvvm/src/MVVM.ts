import Watcher from './Watcher';
import { getValue, setValue } from './utils';

function mergeDescriptor(a: any, b: any) {
  for (let key in b) {
    Object.defineProperty(
      a,
      key,
      // @ts-ignore
      Object.getOwnPropertyDescriptor(b, key)
    );
  }
}

interface MVVMConfig {
  el: HTMLElement;
  data: any;
  created?: (() => void) | undefined;
  destroy?: (() => void) | undefined;
  computed: any;
  methods: any;
}

class MVVM {
  el: HTMLElement;
  watcher: Watcher;
  config: MVVMConfig;
  [key: string]: any;
  constructor(config: MVVMConfig) {
    this.el = config.el;
    this.watcher = new Watcher(config.data);
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

  traversEL(el: HTMLElement) {
    this.traversAttr(el);
    for (let i = 0; i < el.childNodes.length; i++) {
      const node: any = el.childNodes[i];
      const nodeName = node.nodeName.toLowerCase();
      const isFormEl =
        ['input', 'textArea', 'checkbox', 'select', 'radio'].indexOf(
          nodeName
        ) >= 0;

      // text
      if (node.nodeType === 3 || isFormEl) {
        let nodeValue = node.nodeValue!;

        let setNodeValue = (val: string) => {
          node.nodeValue = val;
        };

        if (isFormEl) {
          nodeValue = node.attributes[':value']
            ? node.attributes[':value'].value
            : '';
          setNodeValue = (val: string) => {
            node.value = val;
          };
        }

        this.parseTemplateAndSet(nodeValue, setNodeValue, node);
      } else if (node.nodeType === 1) {
        this.traversEL(node);
      }
    }
  }

  traversAttr(node: HTMLElement) {
    for (let i = 0, l = node.attributes.length; i < l; i++) {
      const attr = node.attributes[i];
      // @ts-ignore
      if (attr.name.startsWith('@')) {
        const eventName = attr.name.substr(1);
        const eventFuncName = attr.value;
        if (this[eventFuncName]) {
          node.addEventListener(eventName, this[eventFuncName]);
        }
      } else {
        this.parseTemplateAndSet(attr.value, (val: string) => {
          node.setAttribute(attr.name, val);
        });
      }
    }
  }

  parseTemplateAndSet(
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
      let scopeKeys: string[] = tpl.match(/[_-a-zA-z123456789.]+/g) as any;
      if (formNode) {
        const nodeName = formNode.nodeName.toLowerCase();
        switch (nodeName) {
          case 'input':
          case 'textarea': {
            formNode.addEventListener('input', (e: any) => {
              setValue(this, scopeKeys[0], e.target.value);
            });
            break;
          }
          case 'select': {
            setNodeValue = (val: string) => {
              formNode.value = val;
              const options = formNode.querySelectorAll('option');
              for (let i = 0, l = options.length; i < l; i++) {
                const item = options[i];
                if (item.value === val.toString()) {
                  item.selected = true;
                } else {
                  item.selected = false;
                }
              }
            };
            formNode.addEventListener('change', (e: any) => {
              setValue(this, scopeKeys[0], e.target.value);
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
        setNodeValue(calValue());
      };
      this.watcher.addListener(k, listener);
      listener();
    });
  }
}

export default MVVM;