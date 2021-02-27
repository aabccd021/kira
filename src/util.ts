import { Field } from './field/field';
import { SchemaField } from './field/schema_field';

export function onKey<T, K extends keyof T>(key: K): (value: T) => T[K] {
  return (value) => value[key];
}

export function sort<T>(comparator: (a: T, b: T) => number): (ts: T[]) => T[] {
  return function _compare(ts: T[]): T[] {
    return [...ts].sort(comparator);
  };
}

export type Collections = { [name: string]: Collection };
export type Collection = { fields: Fields };
export type Fields = { [name: string]: Field };

export type SchemaCollections = { [name: string]: SchemaCollection };
export type SchemaCollection = { fields: SchemaFields };
export type SchemaFields = { [name: string]: SchemaField };

export type FieldId = [string, string];
