import 'reflect-metadata';

const classDecorator = () => <T extends { new (...args: any[]): {} }>(
  target: T
) => {
  const properties = Reflect.getOwnMetadata('design:type', target);
  const parameters = Reflect.getOwnMetadata('design:paramtypes', target);
  const returntype = Reflect.getOwnMetadata('design:returntype', target);

  console.log('\nclass metadata');

  console.log(properties);
  console.log(parameters);
  console.log(returntype);

  return class extends target {
    job: string = 'it';
  };
};

const funcDecorator = () => (
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any>
) => {
  const properties = Reflect.getOwnMetadata('design:type', target, propertyKey);
  const parameters = Reflect.getOwnMetadata(
    'design:paramtypes',
    target,
    propertyKey
  );
  const returntype = Reflect.getOwnMetadata(
    'design:returntype',
    target,
    propertyKey
  );

  console.log('\nfunc metadata');

  console.log(properties);
  console.log(parameters);
  console.log(returntype);
};

const propertyDecorator = () => (target: any, propertyKey: string) => {
  const properties = Reflect.getOwnMetadata('design:type', target, propertyKey);
  const parameters = Reflect.getOwnMetadata(
    'design:paramtypes',
    target,
    propertyKey
  );
  const returntype = Reflect.getOwnMetadata(
    'design:returntype',
    target,
    propertyKey
  );

  console.log('\nproperty metadata');

  console.log(properties);
  console.log(parameters);
  console.log(returntype);
};

const parameterDecorator = () => (
  target: Object,
  propertyKey: string,
  paramIndex: number
) => {
  const properties = Reflect.getOwnMetadata('design:type', target, propertyKey);
  const parameters = Reflect.getOwnMetadata(
    'design:paramtypes',
    target,
    propertyKey
  );
  const returntype = Reflect.getOwnMetadata(
    'design:returntype',
    target,
    propertyKey
  );

  console.log('\nparameter metadata');

  console.log(properties);
  console.log(parameters[paramIndex]);
  console.log(returntype);
};

class Props {
  name: string;
}

@classDecorator()
class People {
  constructor(name: string) {
    this.name = name;
  }

  @funcDecorator()
  getName(@parameterDecorator() props: Props): string {
    return props.name + this.name;
  }

  @propertyDecorator()
  name: string;
}
