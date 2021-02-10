import assertNever from 'assert-never';
import { Field, SchemaField } from '../fields';
import { CreateCollection, createCollection } from './create-collection';
import { CreateField, createField } from './create-field';

export function migrate(collectionMap: CollectionMap, migration: Migration): CollectionMap {
  if (migration.type === 'createCollection') return createCollection(collectionMap, migration);
  if (migration.type === 'createField') return createField(collectionMap, migration);
  assertNever(migration);
}

export type Migration = CreateCollection | CreateField;

export type CollectionMap = { [name: string]: Collection };
export type FieldMap = { [name: string]: Field };
export type Collection = { fields: FieldMap };

export type SchemaCollectionMap = { [name: string]: SchemaCollection };
export type SchemaFieldMap = { [name: string]: SchemaField };
export type SchemaCollection = { fields: SchemaFieldMap };
