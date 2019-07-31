import Watcher from './Watcher';
import { getValue, setValue, parseExpression } from './utils';

interface MVVMConfig {
  el: HTMLElement;
  data: any;
  created?: () => void;
  destroy?: () => void;
  computed: any;
  methods: any;
}

class MVVM {
  el: HTMLElement;
  watcher: Watcher;
  private config: MVVMConfig;
  [key: string]: any;
  constructor(config: MVVMConfig) {
    this.el = config.el;
    this.watcher = new Watcher(this, config.data);
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
      this.config.destroy && this.config.destroy.call(this);
    };
  }

  private initComputed() {
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
      const nodeName = node.nodeName.toLowerCase();
      const isFormEl =
        ['input', 'textArea', 'checkbox', 'select', 'radio'].indexOf(
          nodeName
        ) >= 0;

      // text
      if (node.nodeType === 3 || isFormEl) {
        let nodeValue = node.nodeValue!;

        let setNodeValue = (val: string) => {
          // chrome 不会触发重绘
          // if (node.nodeValue !== val) {
          node.nodeValue = val;
          // }
        };

        if (isFormEl) {
          nodeValue = node.attributes[':value']
            ? node.attributes[':value'].value
            : '';
          setNodeValue = (val: string) => {
            node.value = val;
          };
          (node as HTMLElement).removeAttribute(':value');
        }

        this.parseTemplateAndSet(
          nodeValue,
          setNodeValue,
          isFormEl ? node : undefined
        );
      } else if (node.nodeType === 1) {
        this.traversEL(node);
      }
    }
  }

  private traversAttr(node: HTMLElement) {
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
      } else {
        this.parseTemplateAndSet(attr.value, (val: string) => {
          node.setAttribute(attr.name, val);
        });
      }
    }
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
      this.watcher.addListener(k, listener);
      listener();
    });
  }
}

export default MVVM;
