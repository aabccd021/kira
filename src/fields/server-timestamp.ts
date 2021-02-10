import { FieldController } from '../field';
import { CollectionMap } from '../migration/migration';

export type SchemaServerTimestampField = {
  readonly type: 'serverTimestamp';
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
