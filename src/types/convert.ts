const simpleTypes: Function[] = [String, Boolean, Number, Date, Array, Promise];

export function convertToType(target: any, data?: object): object|undefined {
  // skip converting undefined and null
  if (data == null) {
    return;
  }
  // skip simple types
  if (simpleTypes.includes(data.constructor)) {
    return data;
  }

  return Object.assign(Object.create(target.prototype), data);
}
