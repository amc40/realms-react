export function objectToArrOfEntries<K extends string, V>(object: {
  [key in K]?: V;
}): [K, V][] {
  const result: [K, V][] = [];
  for (const _entry of Object.keys(object)) {
    const key = _entry as K;
    const value = object[key];
    console.log("key", key, "value", value);
    if (value != null) {
      result.push([key, value!]);
    }
    console.log("result", result);
  }
  return result;
}
