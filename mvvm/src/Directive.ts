import IOwner from './IOwner';
import { parseExpression } from './utils';

type ObjectDirectiveConfig = {
  scoped?: boolean;
  bind(this: Directive, el: HTMLElement, binding: any): void;
  update?(this: Directive, el: HTMLElement, binding: any): void;
  unbind?(this: Directive, el: HTMLElement): void;
};

type FunctionDirectiveConfig = (el: HTMLElement, binding: any) => void;

export type DirectiveConfig = ObjectDirectiveConfig | FunctionDirectiveConfig;

class Directive {
  private config: ObjectDirectiveConfig;
  private listener: () => void;
  private removeListeners: () => void;
  $el: HTMLElement;
  $owner: IOwner;
  $scoped: boolean;
  [key: string]: any;
  constructor(
    owner: IOwner,
    el: HTMLElement,
    path: string,
    config: DirectiveConfig
  ) {
    this.$el = el;
    this.$owner = owner;

    if (typeof config === 'function') {
      this.config = {
        bind: config,
        update: config,
      };
    } else {
      this.config = config;
    }

    const { expression, dependencies } = parseExpression(path, 'this.$owner');
    const fn = new Function('return ' + expression).bind(this);

    this.listener = () => {
      const value = fn();
      if (this.config.update) {
        this.config.update.call(this, el, { value, expression: path });
      }
    };

    dependencies.forEach(dp => {
      this.$owner.$watcher.addListener(dp, this.listener);
    });

    this.removeListeners = () => {
      dependencies.forEach(dp =>
        this.$owner.$watcher.removeListener(dp, this.listener)
      );
    };

    this.config.bind.call(this, el, {
      value: fn(),
      expression: path,
    });

    this.$scoped = this.config.scoped || false;
  }

  destroy() {
    if (this.config.unbind) {
      this.config.unbind.call(this, this.$el);
    }
    this.removeListeners();
  }
}

export const directiveConfigMap = new Map<string, DirectiveConfig>();

export const DIRECTIVE_PREFIX = 'x-';

export default Directive;
