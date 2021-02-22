import { isUndefined } from 'lodash';

import { IntegerField, IntegerSchemaField } from '../field';
import { FieldProcessor } from './_util';

export const _integer: FieldProcessor<IntegerField, IntegerSchemaField> = {
  fieldOf,
  schemaOf,
  dependencyOf: () => [],
};

function fieldOf(schemaField: IntegerSchemaField): IntegerField {
  const { validation } = schemaField;
  const minValue = validation?.min?.value;
  const maxValue = validation?.max?.value;
  if (!isUndefined(minValue) && !isUndefined(maxValue) && maxValue < minValue) {
    throw Error('max must be greater than min');
  }
  return schemaField;
}

function schemaOf(field: IntegerField): IntegerSchemaField {
  return field;
}
