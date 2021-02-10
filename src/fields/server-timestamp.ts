import { FieldController } from '.';
import { CollectionMap } from '../migration';

export type SchemaServerTimestampField = {
  type: 'serverTimestamp';
};

export type ServerTimestampField = SchemaServerTimestampField;

export const serverTimestampController: FieldController<
  SchemaServerTimestampField,
  ServerTimestampField
> = {
  schema2Field,
  field2Schema,
};

function schema2Field(
  schemaField: SchemaServerTimestampField,
  _: CollectionMap
): ServerTimestampField {
  return schemaField;
}

function field2Schema(field: ServerTimestampField): SchemaServerTimestampField {
  return field;
}
