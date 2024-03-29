import { IOwner, IDestroy } from './typing';
import Watcher from './Watcher';
import Compiler from './Compiler';
import { getValue } from './utils';

export default class ChildScope implements IOwner, IDestroy {
  [key: string]: any;
  $parent: IOwner;
  $watcher: Watcher;
  $el: any;
  $complier: Compiler;
  $parentListener = (n: any, o: any, p: string) => {
    this.$watcher.trigger(p, n, o);
  };

  constructor(el: any, parent: IOwner, data: any = {}) {
    this.$parent = parent;
    this.$el = el;
    this.$watcher = new Watcher(this, data);
    this.$complier = new Compiler(this);
    this.$complier.init();

    this.$parent.$watcher.addListener('', this.$parentListener);
  }

  getValue(path: string) {
    const val = getValue(this, path);

    if (val === undefined) {
      return this.$parent.getValue(path);
    }

    return val;
  }

  setData(newData: any) {
    this.$parent.setData(newData);
  }

  getEvent(name: string) {
    return this.$parent.getEvent(name);
  }

  destroy() {
    this.$complier.destroy();
    this.$watcher.removeAllListeners();
    this.$parent.$watcher.removeListener('', this.$parentListener);
  }
}
