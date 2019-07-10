const logger = (type: string) => (
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any>
) => {
  const value = descriptor.value;
  descriptor.value = function() {
    console.log(
      `${type} -> start ${propertyKey}  with:`,
      Array.prototype.slice.apply(arguments)
    );
    const result = value.apply(target, arguments);
    console.log(`${type} -> end ${propertyKey} return:`, result);
  };
};

class User {
  @logger('User')
  eat(food: string) {
    // ...
    return food === 'fish' ? 'bad' : 'good';
  }

  @logger('User')
  sleep() {
    // ...
  }
}

const user = new User();

user.eat('fish');
user.eat('meat');
user.sleep();

const f = () => {
  console.log('f()');
  return (target: Object) => {
    console.log('fd()');
  };
};

const g = () => {
  console.log('g()');
  return (target: Object) => {
    console.log('gd()');
  };
};

@f()
@g()
class Foo {}
