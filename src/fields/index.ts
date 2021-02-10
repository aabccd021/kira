import assertNever from 'assert-never';

import { CollectionMap } from '../migration';
import { _count, CountField, SchemaCountField } from './count';
import { _integer, IntegerField, SchemaIntegerField } from './integer';
import { _reference, ReferenceField, SchemaReferenceField } from './reference';
import {
  _serverTimestamp,
  SchemaServerTimestampField,
  ServerTimestampField,
} from './server-timestamp';
import { _string, SchemaStringField, StringField } from './string';
import { _sum, SchemaSumField, SumField } from './sum';

/**
 * Kira fields.
 *
 * Property `type` of a field is required, and must be a camelCase of it's name.
 *
 */
export type SchemaField =
  | SchemaCountField
  | SchemaIntegerField
  | SchemaReferenceField
  | SchemaServerTimestampField
  | SchemaStringField
  | SchemaSumField;

export type Field =
  | CountField
  | IntegerField
  | ReferenceField
  | ServerTimestampField
  | StringField
  | SumField;

export type FieldController<S extends SchemaField = SchemaField, F extends Field = Field> = {
  fieldOf: (schema: S, collectionMap: CollectionMap) => F;
  schemaOf: (field: F) => S;
};

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
