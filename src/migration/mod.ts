import assertNever from 'assert-never';

import { CollectionMap } from '../field_processor/_util';
import { CreateCollection, createCollection } from './create_collection';
import { CreateField, createField } from './create_field';

export function migrate(collectionMap: CollectionMap, migration: Migration): CollectionMap {
  if (migration.type === 'createCollection') return createCollection(collectionMap, migration);
  if (migration.type === 'createField') return createField(collectionMap, migration);
  assertNever(migration);
}

export type Migration = CreateCollection | CreateField;
