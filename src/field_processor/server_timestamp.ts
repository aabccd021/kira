import { ServerTimestampField, ServerTimestampSchemaField } from '../field';
import { FieldProcessor } from './_util';

function fieldOf(schemaField: ServerTimestampSchemaField): ServerTimestampField {
  return schemaField;
}

function schemaOf(field: ServerTimestampField): ServerTimestampSchemaField {
  return field;
}

export const _serverTimestamp: FieldProcessor<ServerTimestampSchemaField, ServerTimestampField> = {
  fieldOf,
  schemaOf,
};
