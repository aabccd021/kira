import _ from 'lodash';

import { IntegerField, IntegerSchemaField } from '../field';
import { FieldProcessor } from './_util';

export const _integer: FieldProcessor<IntegerSchemaField, IntegerField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: IntegerSchemaField): IntegerField {
  const { min, max } = schemaField;
  if (!_.isUndefined(min) && !_.isUndefined(max) && max < min) {
    throw Error('max must be greater than min');
  }
  return schemaField;
}

function schemaOf(field: IntegerField): IntegerSchemaField {
  return field;
}
