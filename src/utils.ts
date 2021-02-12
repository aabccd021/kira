export type ArrayOr<T> = T | readonly T[];

export function onKey<T, K extends keyof T>(key: K): (value: T) => T[K] {
  return (value) => value[key];
}
