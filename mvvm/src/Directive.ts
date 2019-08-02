import IOwner from './IOwner';

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

    this.$owner.$watcher.addListener(path, val => {
      if (this.config.update) {
        this.config.update.call(this, el, { value: val, expression: path });
      }
    });

    this.config.bind.call(this, el, {
      value: this.$owner.getValue(path),
      expression: path,
    });

    this.$scoped = this.config.scoped || false;
  }

  destroy() {
    if (this.config.unbind) {
      this.config.unbind.call(this, this.$el);
    }
  }
}

export const directiveConfigMap = new Map<string, DirectiveConfig>();

export const DIRECTIVE_PREFIX = 'x-';

export default Directive;
