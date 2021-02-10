import { FieldController } from '.';

export type SchemaServerTimestampField = {
  type: 'serverTimestamp';
};

export type ServerTimestampField = SchemaServerTimestampField;

export const _serverTimestamp: FieldController<SchemaServerTimestampField, ServerTimestampField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: SchemaServerTimestampField): ServerTimestampField {
  return schemaField;
}

function schemaOf(field: ServerTimestampField): SchemaServerTimestampField {
  return field;
}
