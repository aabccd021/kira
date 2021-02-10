import { CollectionMap } from '../migration';
import { countController as count, CountField, SchemaCountField } from './count';
import { integerController as integer, IntegerField, SchemaIntegerField } from './integer';
import {
  referenceController as reference,
  ReferenceField,
  SchemaReferenceField,
} from './reference';
import {
  SchemaServerTimestampField,
  serverTimestampController as serverTimestamp,
  ServerTimestampField,
} from './server-timestamp';
import { SchemaStringField, stringController as string, StringField } from './string';
import { SchemaSumField, sumController as sum, SumField } from './sum';
import assertNever from 'assert-never';

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
  schema2Field: (schema: S, collectionMap: CollectionMap) => F;
  field2Schema: (field: F) => S;
};

export function schema2Field(field: SchemaField, collectionMap: CollectionMap): Field {
  if (field.type === 'count') return count.schema2Field(field, collectionMap);
  if (field.type === 'integer') return integer.schema2Field(field, collectionMap);
  if (field.type === 'reference') return reference.schema2Field(field, collectionMap);
  if (field.type === 'serverTimestamp') return serverTimestamp.schema2Field(field, collectionMap);
  if (field.type === 'string') return string.schema2Field(field, collectionMap);
  if (field.type === 'sum') return sum.schema2Field(field, collectionMap);
  assertNever(field);
}

export function field2Schema(field: Field): SchemaField {
  if (field.type === 'count') return count.field2Schema(field);
  if (field.type === 'integer') return integer.field2Schema(field);
  if (field.type === 'reference') return reference.field2Schema(field);
  if (field.type === 'serverTimestamp') return serverTimestamp.field2Schema(field);
  if (field.type === 'string') return string.field2Schema(field);
  if (field.type === 'sum') return sum.field2Schema(field);
  assertNever(field);
}
