export type ArrayOr<T> = T | T[];
export type integer = number;

export function onKey<T, K extends keyof T>(key: K): (value: T) => T[K] {
  return (value) => value[key];
}
