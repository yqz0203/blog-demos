import Directive, { directiveConfigMap, DIRECTIVE_PREFIX } from './Directive';
import { parseExpression, toRealValue, toArray } from './utils';
import IOwner from './IOwner';

class Compiler {
  owner: IOwner;
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
    if (this.traversAttr(el) === false) {
      return;
    }

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
    const attributes = toArray(node.attributes);

    let scopedAttr: any;

    attributes.some(item => {
      const config = directiveConfigMap.get(item.name);

      // if的优先级是最高的
      if (item.name === DIRECTIVE_PREFIX + 'if') {
        scopedAttr = item;
      }

      if (!scopedAttr && typeof config === 'object' && config.scoped) {
        scopedAttr = item;
      }
    });

    if (scopedAttr) {
      const directive = this.initDirective(node, scopedAttr);

      if (directive && directive.$scoped) {
        return false;
      }
    }

    attributes.forEach(attr => {
      if (!attr) return;

      if (attr.name.startsWith(DIRECTIVE_PREFIX)) {
        this.initDirective(node, attr);
      } else if (attr.name.startsWith(':')) {
        node.removeAttribute(attr.name);
        const attrName = attr.name.substr(1);

        this.parseTemplateAndSet('{{' + attr.value + '}}', (val: string) => {
          // @ts-ignore
          node[attrName] = toRealValue(val);
        });
      }
      // @ts-ignore
      else if (attr.name.startsWith('@')) {
        node.removeAttribute(attr.name);
        const eventName = attr.name.substr(1);
        const eventFuncName = attr.value;
        const cb = this.owner.getEvent(eventFuncName);
        if (cb) {
          node.addEventListener(eventName, cb);
        }
      } else {
        let cb = (val: string) => {
          node.setAttribute(attr.name, val);
        };

        this.parseTemplateAndSet(attr.value, cb);
      }
    });

    return true;
  }

  private initDirective(node: any, attr: Attr) {
    node.removeAttribute(attr.name);
    const directiveName = attr.name.replace(
      new RegExp('^' + DIRECTIVE_PREFIX),
      ''
    );
    const dd = directiveConfigMap.get(directiveName);

    if (!dd) {
      console.warn('未知的指令：', directiveName);
    } else {
      const directive = new Directive(this.owner, node, attr.value, dd);
      this.directives.push(directive);

      return directive;
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

      const parsed = parseExpression(tpl, 'this.owner');
      let scopeKeys = parsed.dependencies;

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

      result = valueRegexp.exec(template);
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
      this.owner.$watcher.addListener(k, listener);
      listener();
    });
  }
}

export default Compiler;
