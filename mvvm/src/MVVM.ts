import Watcher from './Watcher';
import { setValue } from './utils';
import { DirectiveConfig, directiveMapping } from './Directive';
import Compiler from './Complier';

interface MVVMConfig {
  el: HTMLElement;
  data: any;
  created?: () => void;
  destroy?: () => void;
  computed: any;
  methods: any;
}

class MVVM {
  static directive = function(name: string, config: DirectiveConfig) {
    directiveMapping[name] = config;
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
    el.value = binding.value;
  },
  unbind(el) {
    el.removeEventListener('input', this.callback);
  },
});

MVVM.directive('show', (el, binding) => {
  el.style.display = binding.value ? '' : 'none';
});

export default MVVM;
