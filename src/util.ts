export function onKey<T, K extends keyof T>(key: K): (value: T) => T[K] {
  return (value) => value[key];
}

export function sort<T>(comparator: (a: T, b: T) => number): (ts: T[]) => T[] {
  return function _compare(ts: T[]): T[] {
    return [...ts].sort(comparator);
  };
}
