import Directive, { directiveMapping } from './Directive';
import { parseExpression, toRealValue } from './utils';

class Compiler {
  owner: any;
  directives: Directive[] = [];

  constructor(owner: any) {
    this.owner = owner;
  }

  init() {
    this.traversEL(this.owner.$el);
  }

  destroy() {
    this.directives.forEach(d => d.destroy());
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
        const dd = directiveMapping[directiveName];

        if (!dd) {
          console.warn('未知的指令：', directiveName);
        } else {
          this.directives.push(new Directive(this.owner, node, attr.value, dd));
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
        if (this.owner[eventFuncName]) {
          node.addEventListener(eventName, this.owner[eventFuncName]);
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

      const parsed = parseExpression(tpl, 'this.owner');
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
      this.owner.$watcher.addListener(k, listener);
      listener();
    });
  }
}

export default Compiler;
