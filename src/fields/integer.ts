import _ from 'lodash';

import { integer } from '../utils';
import { FieldController } from '.';

export type SchemaIntegerField = {
  /** @ignore */
  type: 'integer';
  /** Minimum value of this integer, inclusive. */
  min?: integer;
  /** Maximum value of this integer, inclusive. */
  max?: integer;
};

export type IntegerField = SchemaIntegerField;

export const _integer: FieldController<SchemaIntegerField, IntegerField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: SchemaIntegerField): IntegerField {
  const { min, max } = schemaField;
  if (!_.isUndefined(min) && !_.isUndefined(max) && max < min) {
    throw Error('max must be greater than min');
  }
  return schemaField;
}

function schemaOf(field: IntegerField): SchemaIntegerField {
  return field;
}
