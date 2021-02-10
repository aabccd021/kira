import { isUndefined } from 'lodash';

import { ArrayOr } from '../utils';
import { integer } from './../utils';
import { FieldController } from '.';

export type SchemaStringField = {
  /** @ignore */
  type: 'string';
  /**
   * Minimum length of this string, inclusive.
   * @minimum 1
   */
  minLength?: integer;
  /**
   * Maximum length of this string, inclusive.
   * @minimum 1
   */
  maxLength?: integer;
  /** `isUnique`: value of this string field will be unique across collections. */
  properties?: ArrayOr<StringFieldProperties>;
};

type StringFieldProperties = 'isUnique';

export type StringField = SchemaStringField;

export const _string: FieldController<SchemaStringField, StringField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: SchemaStringField): StringField {
  const { minLength, maxLength } = schemaField;
  if (!isUndefined(minLength)) {
    if (minLength === 0) throw Error('minLength 0 does not need to be specified');
    if (minLength < 0) throw Error(`minLength must be greater than 0, given ${minLength}`);
  }
  if (!isUndefined(maxLength) && maxLength <= 0) {
    throw Error(`max must be greater than 0, given ${maxLength}`);
  }
  if (!isUndefined(minLength) && !isUndefined(maxLength) && maxLength < minLength) {
    throw Error(`maxLength must be greater than minLength`);
  }
  return schemaField;
}

function schemaOf(field: StringField): SchemaStringField {
  return field;
}
