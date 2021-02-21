import { isUndefined } from 'lodash';

import { StringField, StringFieldMigration } from '../field';
import { FieldProcessor } from './_util';

export const _string: FieldProcessor<StringField, StringFieldMigration> = {
  fieldOf,
  schemaOf,
  dependency: [],
};

function fieldOf(schemaField: StringFieldMigration): StringField {
  const { validation } = schemaField;
  const minLengthValue = validation?.minLength?.value;
  const maxLengthValue = validation?.maxLength?.value;
  if (!isUndefined(minLengthValue)) {
    if (minLengthValue === 0) throw Error('minLength 0 does not need to be specified');
    if (minLengthValue < 0) {
      throw Error(`minLength must be greater than 0, given ${minLengthValue}`);
    }
  }
  if (!isUndefined(maxLengthValue) && maxLengthValue <= 0) {
    throw Error(`max must be greater than 0, given ${maxLengthValue}`);
  }
  if (
    !isUndefined(minLengthValue) &&
    !isUndefined(maxLengthValue) &&
    maxLengthValue < minLengthValue
  ) {
    throw Error(`maxLength must be greater than minLength`);
  }
  return schemaField;
}

function schemaOf(field: StringField): StringFieldMigration {
  return field;
}
