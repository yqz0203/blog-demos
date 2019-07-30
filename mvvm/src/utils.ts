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

