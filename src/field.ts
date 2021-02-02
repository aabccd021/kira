import { CollectionMap } from './migration';
import { countController, CountField, SchemaCountField } from './fields/count';
import { integerController, IntegerField, SchemaIntegerField } from './fields/integer';
import { referenceController, ReferenceField, SchemaReferenceField } from './fields/reference';
import {
  SchemaServerTimestampField,
  serverTimestampController,
  ServerTimestampField,
} from './fields/server-timestamp';
import { SchemaStringField, stringController, StringField } from './fields/string';
import { SchemaSumField, sumController, SumField } from './fields/sum';
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

export type Controller<S extends SchemaField, F extends Field> = {
  schema2Field: (schema: S, collectionMap: CollectionMap) => F;
  field2Schema: (field: F) => S;
};

export function schema2Field(schemaField: SchemaField, collectionMap: CollectionMap): Field {
  if (schemaField.type === 'count') return countController.schema2Field(schemaField, collectionMap);
  if (schemaField.type === 'integer')
    return integerController.schema2Field(schemaField, collectionMap);
  if (schemaField.type === 'reference')
    return referenceController.schema2Field(schemaField, collectionMap);
  if (schemaField.type === 'serverTimestamp')
    return serverTimestampController.schema2Field(schemaField, collectionMap);
  if (schemaField.type === 'string')
    return stringController.schema2Field(schemaField, collectionMap);
  if (schemaField.type === 'sum') return sumController.schema2Field(schemaField, collectionMap);
  assertNever(schemaField);
}

export function field2Schema(schemaField: Field): SchemaField {
  if (schemaField.type === 'count') return countController.field2Schema(schemaField);
  if (schemaField.type === 'integer') return integerController.field2Schema(schemaField);
  if (schemaField.type === 'reference') return referenceController.field2Schema(schemaField);
  if (schemaField.type === 'serverTimestamp')
    return serverTimestampController.field2Schema(schemaField);
  if (schemaField.type === 'string') return stringController.field2Schema(schemaField);
  if (schemaField.type === 'sum') return sumController.field2Schema(schemaField);
  assertNever(schemaField);
}
