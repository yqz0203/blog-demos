import Watcher from './Watcher';
import { setValue, getValue } from './utils';
import { DirectiveConfig, directiveConfigMap } from './Directive';
import Compiler from './Compiler';
import { IOwner } from './typing';
import ChildScope from './ChildScope';

interface MVVMConfig {
  el: HTMLElement;
  data: any;
  created?: () => void;
  destroyed?: () => void;
  watch?: { [key: string]: (newValue: any, oldValue: any) => void };
  computed: any;
  methods: any;
}

class MVVM implements IOwner {
  static directive = function(name: string, config: DirectiveConfig) {
    directiveConfigMap.set(name, config);
  };

  $el: HTMLElement;
  $watcher: Watcher;
  $complier: Compiler;
  [key: string]: any;

  private config: MVVMConfig;
  constructor(config: MVVMConfig) {
    this.$el = config.el;
    this.$watcher = new Watcher(this, config.data);
    this.$complier = new Compiler(this);
    this.config = config;

    this.initMethods();
    this.initComputed();
    this.initWatch();
    this.$complier.init();
    this.config.created && this.config.created.call(this);
  }

  setData(newData: any) {
    if (!newData) return;
    Object.keys(newData).forEach(k => {
      // @ts-ignore
      this[k] = newData[k];
    });
  }

  getValue(path: string) {
    return getValue(this, path);
  }

  getEvent(name: string) {
    return this[name] ? this[name].bind(this) : '';
  }

  destroy() {
    this.$complier.destroy();
    this.$watcher.removeAllListeners();
    this.config.destroyed && this.config.destroyed.call(this);
  }

  private initComputed() {
    const computed = this.config.computed || {};
    const computedKeys = Object.keys(computed);

    computedKeys.forEach(ckey => {
      if (typeof computed[ckey] === 'function') {
        const cb = () => {
          this[ckey] = computed[ckey].call(this);
          this.$watcher.trigger(ckey, this[ckey], '');
        };
        this.$watcher.addListener('', cb);
      } else if (Array.isArray(computed[ckey])) {
        const value = [...computed[ckey]];
        const fn = value.pop();
        value.forEach(path => {
          const cb = () => {
            this[ckey] = fn.call(this);
            this.$watcher.trigger(ckey, this[ckey], '');
          };
          this.$watcher.addListener(path, cb);
          cb();
        });
      }
    });
  }

  private initWatch() {
    const watch = this.config.watch || {};
    const watchKeys = Object.keys(watch);
    watchKeys.forEach(key => {
      this.$watcher.addListener(key, (n, o, key) => {
        watch[key].call(this, n, o);
      });
    });
  }

  private initMethods() {
    Object.keys(this.config.methods || {}).forEach(key => {
      // @ts-ignore
      this[key] = this.config.methods[key].bind(this);
    });
  }
}

// 内置指令
MVVM.directive('model', {
  bind(el: any, binding) {
    this.callback = (e: any) => {
      const val = e.target.value;
      this.$owner.setData({ [binding.expression]: val });
    };
    el.addEventListener('input', this.callback);
    el.value = binding.value;
  },
  update(el: any, binding) {
    if (el.value === binding.value) return;
    el.value = binding.value;
  },
  unbind(el) {
    el.removeEventListener('input', this.callback);
  },
});

MVVM.directive('show', (el, binding) => {
  el.style.display = binding.value ? '' : 'none';
});

MVVM.directive('if', {
  scoped: true,
  bind(el: HTMLElement, binding) {
    const html = el.outerHTML;
    this.cEl = document.createComment('-- if block --');
    this.el = el;
    this.onHide = function() {
      this.childScope && this.childScope.destroy();
      this.el.replaceWith(this.cEl);
    };

    this.onShow = function() {
      let nEl: any = document.createElement('div');
      nEl.innerHTML = html;
      nEl = nEl.firstChild;

      this.el.replaceWith(nEl);
      this.el = nEl;
      this.childScope = new ChildScope(this.el, this.$owner);
      this.cEl.replaceWith(this.el);
    };

    if (binding.value === false) {
      this.onHide();
    } else {
      this.onShow();
    }
  },
  update(el: any, binding) {
    if (binding.value === false) {
      this.onHide();
    } else {
      this.onShow();
    }
  },
  unbind(el) {
    this.onHide();
  },
});

export default MVVM;
