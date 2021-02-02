import { integer } from './../utils';
import { Controller } from '../field';
import { CollectionMap } from '../migration';
import { ArrayOr } from '../utils';

export type SchemaStringField = {
  /** @ignore */
  type: 'string';
  /** Minimum length of this string, inclusive. */
  minLength?: integer;
  /** Maximum length of this string, inclusive. */
  maxLength?: integer;
  /** `isUnique`: value of this string field will be unique across collections. */
  properties?: ArrayOr<StringFieldProperties>;
};

type StringFieldProperties = 'isUnique';

export type StringField = SchemaStringField;

export const stringController: Controller<SchemaStringField, StringField> = {
  schema2Field,
  field2Schema,
};

function schema2Field(schemaField: SchemaStringField, _: CollectionMap): StringField {
  return schemaField;
}

function field2Schema(field: StringField): SchemaStringField {
  return field;
}
