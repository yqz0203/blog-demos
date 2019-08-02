import Watcher from './Watcher';
import { setValue, getValue } from './utils';
import { DirectiveConfig, directiveConfigMap } from './Directive';
import Compiler from './Complier';
import IOwner from './IOwner';
import ChildScope from './ChildScope';

interface MVVMConfig {
  el: HTMLElement;
  data: any;
  created?: () => void;
  destroy?: () => void;
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

    this.initLifeCycles();
    this.initMethods();
    this.$complier.init();
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

  getValue(path: string) {
    return getValue(this, path);
  }

  getEvent(name: string) {
    return this[name];
  }

  private initLifeCycles() {
    this['created'] = () => {
      this.config.created && this.config.created.call(this);
    };

    this['destroy'] = () => {
      this.$complier.destroy();
      this.$watcher.removeAllListeners();
      this.config.destroy && this.config.destroy.call(this);
    };
  }

  private initComputed() {
    const computed = this.config.computed || {};

    const computedKeys = Object.keys(computed);
    this.$watcher.addListener('', (n, o, key) => {
      if (computedKeys.indexOf(key) >= 0) {
        return;
      }
      computedKeys.forEach(ckey => {
        this[ckey] = computed[ckey].call(this);
        this.$watcher.trigger(ckey, this[ckey], '');
      });
    });
    computedKeys.forEach(ckey => {
      this[ckey] = computed[ckey].call(this);
      this.$watcher.trigger(ckey, this[ckey], '');
    });
  }

  private initMethods() {
    Object.keys(this.config.methods).forEach(key => {
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
      setValue(this.$owner, binding.expression, val);
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

    const nEl = document.createElement('div');
    nEl.innerHTML = html;
    this.el = nEl.firstChild;
    this.cEl = document.createComment('-- if block --');
    el.replaceWith(this.el);

    this.childScope = new ChildScope(this.el, this.$owner);

    this.onHide = function() {
      this.childScope.destroy();
      this.el.replaceWith(this.cEl);
    };

    this.onShow = function() {
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
