import assertNever from 'assert-never';

import { Field, SchemaField } from '../field';
import { CollectionMap } from './_util';
import { _count } from './count';
import { _integer } from './integer';
import { _reference } from './reference';
import { _serverTimestamp } from './server_timestamp';
import { _string } from './string';
import { _sum } from './sum';

/**
 * Kira fields.
 *
 * Property `type` of a field is required, and must be a camelCase of it's name.
 *
 */
export function toField(field: SchemaField, collectionMap: CollectionMap): Field {
  if (field.type === 'count') return _count.fieldOf(field, collectionMap);
  if (field.type === 'integer') return _integer.fieldOf(field, collectionMap);
  if (field.type === 'reference') return _reference.fieldOf(field, collectionMap);
  if (field.type === 'serverTimestamp') return _serverTimestamp.fieldOf(field, collectionMap);
  if (field.type === 'string') return _string.fieldOf(field, collectionMap);
  if (field.type === 'sum') return _sum.fieldOf(field, collectionMap);
  assertNever(field);
}

export function toSchema(field: Field): SchemaField {
  if (field.type === 'count') return _count.schemaOf(field);
  if (field.type === 'integer') return _integer.schemaOf(field);
  if (field.type === 'reference') return _reference.schemaOf(field);
  if (field.type === 'serverTimestamp') return _serverTimestamp.schemaOf(field);
  if (field.type === 'string') return _string.schemaOf(field);
  if (field.type === 'sum') return _sum.schemaOf(field);
  assertNever(field);
}
