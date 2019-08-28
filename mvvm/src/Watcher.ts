import { getValue, isPlainObject, mergeDescriptor } from './utils';
import { IDestroy } from './typing';

type Callback = (val: any, oldValue: any) => void;
type CallbackWithPath = (val: any, oldValue: any, path: string) => void;

class Token {
  private value: any;

  constructor(config: { obj: any; key: string; value: any; cb: Callback }) {
    const scope = this;
    const { key, value, obj, cb } = config;

    this.value = value;

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveSetter() {
        return scope.value;
      },
      set: function reactiveGetter(value) {
        const oldValue = scope.value;
        scope.value = value;
        if (oldValue !== value) {
          cb(value, oldValue);
        }
      },
    });
  }
}

const GLOABL_KEY = 'GLOABL';

class Watcher implements IDestroy {
  owner: any;
  listeners: {
    [path: string]: CallbackWithPath[];
  } = {};
  constructor(owner: any, data: any) {
    mergeDescriptor(owner, this.traverseData(data));
    this.owner = owner;
  }

  traverseData(data: any, path = '') {
    const result = {};
    Object.keys(data).forEach(key => {
      const fullPath = (path ? path + '.' : '') + key;

      new Token({
        obj: result,
        key,
        value: isPlainObject(data[key])
          ? this.traverseData(data[key], fullPath)
          : data[key],
        cb: (newVal, oldValue) => {
          this.handleValueChange(fullPath, newVal, oldValue);
        },
      });
    });
    return result;
  }

  handleValueChange(fullPath: string, newValue: any, oldValue: any) {
    let parent = this.owner;
    const pathArr = fullPath.split('.');
    if (pathArr.length >= 2) {
      parent = new Function(
        'data',
        `return data.${pathArr.slice(0, pathArr.length - 1).join('.')}`
      )(this.owner);
    }

    const key: string = pathArr.pop()!;

    if (isPlainObject(newValue)) {
      new Token({
        obj: parent,
        key,
        value: this.traverseData(newValue, fullPath),
        cb: (_newValue, _oldValue) => {
          this.handleValueChange(fullPath, _newValue, _oldValue);
        },
      });
    }

    this.trigger(fullPath, newValue, oldValue);
  }

  addListener(path: string, cb: CallbackWithPath) {
    if (!path) {
      path = GLOABL_KEY;
    }

    if (!this.listeners[path]) {
      this.listeners[path] = [];
    }

    this.listeners[path].push(cb);
  }

  removeListener(path: string, cb?: CallbackWithPath) {
    if (!path) {
      path = GLOABL_KEY;
    }

    if (!cb) {
      delete this.listeners[path];
    } else {
      (this.listeners[path] || []).filter(item => item === cb);
    }
  }

  removeAllListeners() {
    this.listeners = {};
  }

  destroy() {
    this.removeAllListeners();
  }

  trigger(path: string, newValue: any, oldValue: any) {
    if (!path) {
      path = GLOABL_KEY;
    }

    if (!this.listeners[path]) {
      this.listeners[path] = [];
    }

    this.listeners[path].forEach(cb => cb(newValue, oldValue, path));

    // 改变了对象，那么子级也应该收到通知
    Object.keys(this.listeners).forEach(key => {
      if (key !== path && key.startsWith(path)) {
        const k = key.replace(path + '.', '');
        const oldV = getValue(oldValue, k);
        const newV = getValue(newValue, k);
        this.listeners[key].forEach(cb => cb(newV, oldV, key));
      }
    });

    (this.listeners[GLOABL_KEY] || []).forEach(cb =>
      cb(newValue, oldValue, path)
    );
  }
}

// const owner: any = {};

// const watcher = new Watcher(owner, {
//   a: 10,
//   b: {
//     c: 12,
//   },
// });

// watcher.addListener('b', (p1, p2) => {
//   console.log('b changed', p1, p2);
// });

// watcher.addListener('b.c', (p1, p2) => {
//   console.log('b.c changed', p1, p2);
// });

// owner.b = { c: 15 };
// owner.b.c = 'wahahaha';

export default Watcher;
