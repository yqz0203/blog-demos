import { getValue, isPlainObject, mergeDescriptor } from './utils';

type Callback = (val: any, oldValue: any) => void;
type CallbackWithPath = (val: any, oldValue: any, path: string) => void;

class Token<T = any> {
  private _value: T;
  // @ts-ignore
  constructor(config: { obj: any; key: string; value: T; cb: Callback }) {
    const scope = this;
    const { key, value, obj, cb } = config;

    this._value = value;

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveSetter() {
        return scope._value;
      },
      set: function reactiveGetter(value) {
        const oldValue = scope._value;
        scope._value = value;
        if (oldValue !== value) {
          cb(value, oldValue);
        }
      },
    });
  }
}

const GLOABL_KEY = 'GLOABL';

class Watcher {
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

    this.listeners[GLOABL_KEY].forEach(cb => cb(newValue, oldValue, path));
  }
}

// const obj = {
//   a: {
//     b: 1,
//   },
// };

// const watcher = new Watcher({
//   a: 10,
//   b: {
//     c: 12,
//   },
// });

// watcher.addListener('b', (a, b) => {
//   console.log('b changed', a, b);
// });

// watcher.addListener('b.c', (a, b) => {
//   console.log('b.c changed', a, b);
// });

// watcher._data.b = { c: 15 };
// watcher._data.b.c = 'wahahaha';

export default Watcher;
