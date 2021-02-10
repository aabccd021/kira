import { isNil } from 'lodash';
import { FieldController } from '.';
import { integer } from '../utils';

export type SchemaIntegerField = {
  /** @ignore */
  type: 'integer';
  /** Minimum value of this integer, inclusive. */
  min?: integer;
  /** Maximum value of this integer, inclusive. */
  max?: integer;
};

export type IntegerField = SchemaIntegerField;

export const integerController: FieldController<SchemaIntegerField, IntegerField> = {
  schema2Field,
  field2Schema,
};

function schema2Field(schemaField: SchemaIntegerField): IntegerField {
  const { min, max } = schemaField;
  if (!isNil(min) && !isNil(max) && max < min) throw Error('max must be greater than min');
  return schemaField;
}

function field2Schema(field: IntegerField): SchemaIntegerField {
  return field;
}
