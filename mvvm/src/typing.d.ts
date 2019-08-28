import Watcher from './Watcher';
import Compiler from './Compiler';

export interface IOwner {
  $el: HTMLElement;
  $watcher: Watcher;
  $complier: Compiler;
  [key: string]: any;
  setData(newData: any): void;
  getValue(path: string): any;
  getEvent(name: string): (e: Event, ...args: any[]) => void;
}

export interface IDestroy {
  destroy(): void;
}
