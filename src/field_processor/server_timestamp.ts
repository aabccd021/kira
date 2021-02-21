import { ServerTimestampField, ServerTimestampFieldMigration } from '../field';
import { FieldProcessor } from './_util';

function fieldOf(schemaField: ServerTimestampFieldMigration): ServerTimestampField {
  return schemaField;
}

function schemaOf(field: ServerTimestampField): ServerTimestampFieldMigration {
  return field;
}

export const _serverTimestamp: FieldProcessor<
  ServerTimestampField,
  ServerTimestampFieldMigration
> = {
  fieldOf,
  schemaOf,
  dependency: [],
};
