class Token<T = any> {
  private _value: T;
  private cbs: Array<(value: T) => void> = [];
  // @ts-ignore
  constructor(config: { context: any; key: string; value: T }) {
    const scope = this;
    const { key, value, context } = config;

    this._value = value;
    Object.defineProperty(context, key, {
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
  inited(): void;
  destroy(): void;
  computed: any;
  methods: any;
}

type Context<T extends ControllerConfig<{}>> = T['data'] & {
  inited: T['inited'];
} & { [K in keyof T['computed']]: T['computed'][K] } &
  { [K in keyof T['methods']]: T['methods'][K] };

class Controller<T extends object> {
  private keys: string[];
  private data: T;
  private tokens: { [key: string]: Token } = {};
  private context!: Context<ControllerConfig<T>>;
  private config: ControllerConfig<T>;
  
  el: HTMLElement;
  constructor(el: HTMLElement, config: ControllerConfig<T>) {
    this.keys = Object.keys(config.data);
    this.data = config.data;
    this.config = config;
    this.el = el;
    this.initContext();
    this.traversEL(el);
    this.context.inited();
  }

  initContext() {
    // @ts-ignore
    this.context = {
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
        const valueRegexp = /{{([^}]+)}}/g;
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

        let result = valueRegexp.exec(nodeValue);

        while (result) {
          const { index } = result;
          let tpl = result[1];
          let fullTpl = result[0];
          let scopeKeys: string[] = tpl.match(/[_-a-zA-z123456789]+/g) as any;

          // 表单元素只执行一次
          if (isFormEl) {
            result = null;
          }

          switch (nodeName) {
            case 'input':
            case 'textarea': {
              node.addEventListener('input', (e: any) => {
                // @ts-ignore
                this.context[scopeKeys[0]] = e.target.value;
              });
              break;
            }
            case 'select': {
              setNodeValue = (val: string) => {
                node.value = val;
                const options = node.querySelectorAll('option');
                for (let i = 0, l = options.length; i < l; i++) {
                  const item = options[i];
                  if (item.value === val.toString()) {
                    item.selected = true;
                  } else {
                    item.selected = false;
                  }
                }
              };
              node.addEventListener('change', (e: any) => {
                // @ts-ignore
                this.context[scopeKeys[0]] = e.target.value;
              });
              break;
            }
          }

          // 过滤到已有的变量
          scopeKeys = scopeKeys.filter(k => this.tokens[k] !== undefined);

          const fn = new Function(...scopeKeys, 'return ' + tpl).bind(
            this.context
          );

          scopeKeys.forEach(k => {
            const listener = () => {
              setNodeValue(
                nodeValue.slice(0, index) +
                  // @ts-ignore
                  fn.apply(this.context, scopeKeys.map(i => this.context[i])) +
                  nodeValue.slice(index + tpl.length + fullTpl.length)
              );
            };
            this.tokens[k].addListener(listener);
            listener();
          });

          result = valueRegexp.exec(nodeValue);
        }
      } else if (node.nodeType === 1) {
        this.traversEL(node);

        for (let i = 0, l = node.attributes.length; i < l; i++) {
          const attr = node.attributes[i];
          if (attr.name.startsWith('@')) {
            const eventName = attr.name.substr(1);
            const eventFuncName = attr.value;
            if (this.context[eventFuncName]) {
              node.addEventListener(eventName, this.context[eventFuncName]);
            }
          }
        }
      }
    }
  }

  destroy() {
    this.config.destroy();
    this.tokens = {};
  }
}

const root = document.getElementById('scope-1')!;

const initialData = {
  name: 'John',
  age: 10,
  gender: 1,
  currentTime: new Date(),
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
  },
});
