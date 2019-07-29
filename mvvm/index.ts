function createEl(html: string) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstChild!;
}

function mergeContext(context: any, parentContext: any) {
  for (let key in parentContext) {
    Object.defineProperty(
      context,
      key,
      // @ts-ignore
      Object.getOwnPropertyDescriptor(parentContext, key)
    );
  }
}

class Token<T = any> {
  private _value: T;
  private cbs: Array<(value: T) => void> = [];
  // @ts-ignore
  constructor(config: { context: any; key: string; value: T }) {
    const scope = this;
    const { key, value, context } = config;

    this._value = value;
    Object.defineProperty(context, key, {
      enumerable: true,
      get() {
        return scope._value;
      },
      set(value) {
        const oldValue = scope._value;
        scope._value = value;
        if (oldValue !== value) {
          scope.cbs.forEach(cb => cb(value));
        }
      },
    });
  }

  addListener(cb: (value: T) => void) {
    this.cbs.push(cb);
  }
}

interface ControllerConfig<T extends object> {
  data: T;
  inited?: () => void;
  destroy?: () => void;
  computed?: any;
  methods?: any;
  context?: any;
}

type Context<T extends ControllerConfig<{}>> = T['data'] & {
  inited: T['inited'];
} & { [K in keyof T['computed']]: T['computed'][K] } &
  { [K in keyof T['methods']]: T['methods'][K] };

class DomWatcher {
  context: any;
  el: HTMLElement;
  tokens: { [key: string]: Token };

  constructor(context: any, el: any, tokens: { [key: string]: Token }) {
    this.context = context;
    this.el = el;
    this.tokens = tokens;
    this.traversEL(this.el);
  }

  traversEL(el: HTMLElement) {
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
        // 遇到了for
        if (node.attributes[':for']) {
          const startArchor = document.createComment('for start');
          const endArchor = document.createComment('for end');
          node.replaceWith(endArchor);
          endArchor.parentNode!.insertBefore(startArchor, endArchor);

          const valueRegexp = /{{([^}]+)}}/g;
          let result = valueRegexp.exec(node.attributes[':for'].value);
          if (result && result[1].trim()) {
            this.context[result[1].trim()].forEach((item: any) => {
              const newEl = document.createElement(node.nodeName);
              newEl.innerHTML = node.innerHTML;
              new ArrayController(newEl, {
                data: item,
                key: (node.attributes[':for-key']
                  ? node.attributes[':for-key'].value
                  : 'item').trim(),
                parentContext: this.context,
                startArchor,
                endArchor,
                tokens: this.tokens,
              });
            });
          }
        } else {
          this.traversAttr(node);
          this.traversEL(node);
        }
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
        if (this.context[eventFuncName]) {
          node.addEventListener(eventName, this.context[eventFuncName]);
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
      let scopeKeys: string[] = tpl.match(/[_-a-zA-z123456789]+/g) as any;

      if (formNode) {
        const nodeName = formNode.nodeName.toLowerCase();
        switch (nodeName) {
          case 'input':
          case 'textarea': {
            formNode.addEventListener('input', (e: any) => {
              // @ts-ignore
              this.context[scopeKeys[0]] = e.target.value;
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
              // @ts-ignore
              this.context[scopeKeys[0]] = e.target.value;
            });
            break;
          }
        }
        result = null;
      }

      // 过滤到已有的变量
      scopeKeys = scopeKeys.filter(k => this.tokens[k] !== undefined);

      const fn = new Function(...scopeKeys, 'return ' + tpl).bind(this.context);

      allScopeKeys = [...allScopeKeys, ...scopeKeys];
      calContexts = [
        ...calContexts,
        {
          startIndex: index,
          endIndex: index + fullTpl.length,
          cal: () =>
            fn.apply(this.context, scopeKeys.map(i => this.context[i])),
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
      this.tokens[k].addListener(listener);
      listener();
    });
  }
}

class Controller<T extends object> {
  private keys: string[];
  private data: T;
  private tokens: { [key: string]: Token } = {};
  private context!: Context<ControllerConfig<T>>;
  private config: ControllerConfig<T>;
  private domWatcher: DomWatcher;

  el: HTMLElement;
  constructor(el: HTMLElement, config: ControllerConfig<T>) {
    this.keys = Object.keys(config.data);
    this.data = config.data;
    this.config = { computed: {}, methods: {}, ...config };
    this.el = el;
    this.initContext();
    this.domWatcher = new DomWatcher(this.context, el, this.tokens);
    this.context.inited && this.context.inited();
  }

  initContext() {
    // @ts-ignore
    this.context = {
      ...this.config.context,
      inited: this.config.inited,
    };

    this.keys.forEach(key => {
      this.tokens[key] = new Token({
        context: this.context,
        key,
        // @ts-ignore
        value: this.data[key],
      });
    });

    Object.keys(this.config.computed).forEach(key => {
      const value = this.config.computed[key].call(this.context);
      this.tokens[key] = new Token({
        context: this.context,
        key,
        // @ts-ignore
        value,
      });
      this.keys.forEach(vKey => {
        this.tokens[vKey].addListener(() => {
          // @ts-ignore
          this.context[key] = this.config.computed[key].call(this.context);
        });
      });
    });

    Object.keys(this.config.methods).forEach(key => {
      // @ts-ignore
      this.context[key] = this.config.methods[key].bind(this.context);
    });
  }

  destroy() {
    this.config.destroy && this.config.destroy();
    this.tokens = {};
  }
}

class ArrayController {
  parentContet: any;
  tokens: { [key: string]: Token } = {};
  constructor(
    el: HTMLElement,
    config: {
      key: string;
      parentContext: any;
      data: any;
      startArchor: Comment;
      endArchor: Comment;
      tokens: { [key: string]: Token };
    }
  ) {
    const { data, key, parentContext, tokens, startArchor, endArchor } = config;

    const context = {};

    this.tokens['item'] = new Token({
      context: context,
      key,
      // @ts-ignore
      value: data,
    });

    mergeContext(context, parentContext);

    new DomWatcher(context, el, {
      ...this.tokens,
    });

    startArchor.parentNode!.insertBefore(el, endArchor);
  }
}

const root = document.getElementById('scope-1')!;

const initialData = {
  name: 'John',
  age: 10,
  gender: 1,
  currentTime: new Date(),
  list: [{ name: 'yqz' }, { name: 'shenjingwei' }],
};

new Controller(root, {
  data: initialData,
  inited(this: any) {
    this.interval = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },
  destroy(this: any) {
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
    submit() {
      this.gender = this.gender == 1 ? 0 : 1;
    },

    reset() {
      this.name = 'john';
      Object.keys(initialData).forEach(k => {
        // @ts-ignore
        this[k] = initialData[k];
      });
    },

    delete(e: any) {
      console.log(e.target.dataset.id);
    },
  },
});
