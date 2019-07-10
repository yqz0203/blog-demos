import 'reflect-metadata';

function Type(type: any) {
  return Reflect.metadata('design:type', type);
}

// 验证类型
const validate: any = (target, propertyKey, descriptor) => {
  const set = descriptor.set;
  descriptor.set = function(value) {
    let type = Reflect.getMetadata('design:type', target, propertyKey);
    if (!(value instanceof type)) {
      throw new TypeError('Invalid type.');
    }
    set(value);
  };
};

class C {
  @validate
  @Type(String)
  get name(): any {
    return 'text';
  }
}

const c = new C();

// @ts-ignore
// 这里只是做演示，实际ts会报错的
c.name = 10; // throw TypeError('Invalid type.')
