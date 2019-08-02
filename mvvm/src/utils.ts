export function getValue(obj: any, path: string, defaultVal = undefined) {
  let val = obj;
  try {
    val = new Function('data', `return data.${path}`)(obj);
  } catch (e) {
    return defaultVal;
  }
  return val === undefined ? defaultVal : val;
}

export function setValue(obj: any, path: string, val: any) {
  try {
    new Function('data', `data.${path}=${JSON.stringify(val)}`)(obj);
  } catch (e) {
    return;
  }
}

export function isPlainObject(obj: any) {
  return typeof obj === 'object' && obj.constructor === Object;
}

export function mergeDescriptor(a: any, b: any) {
  for (let key in b) {
    Object.defineProperty(
      a,
      key,
      // @ts-ignore
      Object.getOwnPropertyDescriptor(b, key)
    );
  }
}

export function parseExpression(
  expression: string,
  scopeName: string = 'this'
) {
  let index = 0;
  let max = expression.length;
  let result = '';
  let dependencies: string[] = [];

  while (index < max) {
    let char = expression.charAt(index);

    if (/'|"/.test(char)) {
      const c = char;
      let str = "'";
      char = expression.charAt(++index);
      while (char !== undefined && char !== c) {
        str += char;
        char = expression.charAt(++index);
      }
      result += str;
      result += "'";
      index++;
      continue;
    }

    let VARIABLES = /[A-Za-z_]/;
    if (VARIABLES.test(char)) {
      let value = '';

      let path = '';
      let paths: string[] = [];
      while (char && /[A-Za-z_0-9.()]/.test(char)) {
        value += char;

        if (char === '.') {
          paths.push(path);
          path = '';
        } else {
          path += char;
        }
        char = expression[++index];
      }

      if (/^[A-Za-z_0-9]+$/.test(path)) {
        paths.push(path);
      }

      dependencies.push(paths.join('.'));
      result += scopeName + '.getValue("' + value + (char || '') + '")';
      index++;
      continue;
    }

    result += char;
    index++;
  }

  return {
    expression: result,
    dependencies,
  };
}

export function toRealValue(value: any) {
  if (!value) return value;

  if (/^[0-9]?(\.[0-9]+)?$/.test(value)) {
    return Number(value);
  } else if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else if (value === 'null') {
    return null;
  } else if (value === 'undefined') {
    return undefined;
  }

  return value;
}

export function toArray<T = any>(value: ArrayLike<T>): Array<T> {
  return Array.prototype.slice.call(value);
}
