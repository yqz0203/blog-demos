import Watcher from './Watcher';
import Compiler from './Compiler';

export default interface IOwner {
  $el: HTMLElement;
  $watcher: Watcher;
  $complier: Compiler;
  [key: string]: any;
  setData(newData: any): void;
  getValue(path: string): any;
  getEvent(name: string): EventHandlerNonNull;
}
