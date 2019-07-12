import 'reflect-metadata';

const key = Symbol('key');

class C {
  @Reflect.metadata(key, 'aaa')
  method() {
    //
  }
}

Reflect.defineMetadata(key, 'bbb', C);
console.log(Reflect.getMetadata(key, C)); // bbb
console.log(C['[[Metadata]]']); // undefined

const c = new C();
console.log(Reflect.getMetadata(key, C, 'method')); // undefined
console.log(Reflect.getOwnMetadata(key, c, 'method')); // undefined，因为是存在原型上的。
console.log(Reflect.getMetadata(key, c, 'method')); // aaa

// 修改method的
Reflect.defineMetadata(key, 'eee', C.prototype, 'method');
console.log(Reflect.getMetadata(key, c, 'method')); // eee

// 如果修改
Reflect.defineMetadata(key, 'fff', c, 'method');
console.log(Reflect.getOwnMetadata(key, c, 'method')); // fff
// 对c自身已经声明了元数据，将不会去原型链上查找，也就是会覆盖原型链的值
console.log(Reflect.getMetadata(key, c, 'method')); // fff