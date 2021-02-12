import _ from 'lodash';

import { StringField, StringSchemaField } from '../field';
import { FieldProcessor } from './_util';

export const _string: FieldProcessor<StringSchemaField, StringField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: StringSchemaField): StringField {
  const { minLength, maxLength } = schemaField;
  if (!_.isUndefined(minLength)) {
    if (minLength === 0) throw Error('minLength 0 does not need to be specified');
    if (minLength < 0) throw Error(`minLength must be greater than 0, given ${minLength}`);
  }
  if (!_.isUndefined(maxLength) && maxLength <= 0) {
    throw Error(`max must be greater than 0, given ${maxLength}`);
  }
  if (!_.isUndefined(minLength) && !_.isUndefined(maxLength) && maxLength < minLength) {
    throw Error(`maxLength must be greater than minLength`);
  }
  return schemaField;
}

function schemaOf(field: StringField): StringSchemaField {
  return field;
}
