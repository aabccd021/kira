import { isUndefined } from 'lodash';

import { IntegerField, IntegerFieldMigration } from '../field';
import { FieldProcessor } from './_util';

export const _integer: FieldProcessor<IntegerField, IntegerFieldMigration> = {
  fieldOf,
  schemaOf,
  dependency: [],
};

function fieldOf(schemaField: IntegerFieldMigration): IntegerField {
  const { validation } = schemaField;
  const minValue = validation?.min?.value;
  const maxValue = validation?.max?.value;
  if (!isUndefined(minValue) && !isUndefined(maxValue) && maxValue < minValue) {
    throw Error('max must be greater than min');
  }
  return schemaField;
}

function schemaOf(field: IntegerField): IntegerFieldMigration {
  return field;
}
