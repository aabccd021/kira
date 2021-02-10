import { integer } from './../utils';
import { FieldController } from '../field';
import { ArrayOr } from '../utils';
import { isNil } from 'lodash';

export type SchemaStringField = {
  /** @ignore */
  readonly type: 'string';
  /**
   * Minimum length of this string, inclusive.
   * @minimum 1
   */
  readonly minLength?: integer;
  /**
   * Maximum length of this string, inclusive.
   * @minimum 1
   */
  readonly maxLength?: integer;
  /** `isUnique`: value of this string field will be unique across collections. */
  readonly properties?: ArrayOr<StringFieldProperties>;
};

type StringFieldProperties = 'isUnique';

export type StringField = SchemaStringField;

export const stringController: FieldController<SchemaStringField, StringField> = {
  schema2Field,
  field2Schema,
};

function schema2Field(schemaField: SchemaStringField): StringField {
  const { minLength, maxLength } = schemaField;
  if (!isNil(minLength)) {
    if (minLength === 0) throw Error('minLength 0 does not need to be specified');
    if (minLength < 0) throw Error(`minLength must be greater than 0, given ${minLength}`);
  }
  if (!isNil(maxLength) && maxLength <= 0) {
    throw Error(`max must be greater than 0, given ${maxLength}`);
  }
  if (!isNil(minLength) && !isNil(maxLength) && maxLength < minLength) {
    throw Error(`maxLength must be greater than minLength`);
  }
  return schemaField;
}

function field2Schema(field: StringField): SchemaStringField {
  return field;
}
