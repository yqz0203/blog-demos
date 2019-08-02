import MVVM from './MVVM';
import { getValue } from './utils';

type ObjectDirectiveConfig = {
  bind(this: Directive, el: HTMLElement, binding: any): void;
  update?(this: Directive, el: HTMLElement, binding: any): void;
  unbind?(this: Directive, el: HTMLElement): void;
};

type FunctionDirectiveConfig = (el: HTMLElement, binding: any) => void;

export type DirectiveConfig = ObjectDirectiveConfig | FunctionDirectiveConfig;

class Directive {
  private config: ObjectDirectiveConfig;
  $el: HTMLElement;
  $owner: MVVM;
  [key: string]: any;
  constructor(
    owner: MVVM,
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
      value: getValue(this.$owner, path),
      expression: path,
    });
  }

  destroy() {
    if (this.config.unbind) {
      this.config.unbind.call(this, this.$el);
    }
  }
}

export const directiveMapping: { [key: string]: DirectiveConfig } = {};

export default Directive;
