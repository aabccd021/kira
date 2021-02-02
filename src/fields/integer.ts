import { Controller } from '../field';
import { CollectionMap } from '../migration';
import { integer } from '../utils';

export type SchemaIntegerField = {
  /** @ignore */
  type: 'integer';
  /** Minimum value of this integer, inclusive. */
  min?: integer;
  /** Maximum value of this integer, inclusive. */
  max?: integer;
  /** This document will be deleted if this integer equals this value. */
  deleteDocWhen?: integer;
};

export type IntegerField = SchemaIntegerField;

export const integerController: Controller<SchemaIntegerField, IntegerField> = {
  schema2Field,
  field2Schema,
};

function schema2Field(schemaField: SchemaIntegerField, _: CollectionMap): IntegerField {
  return schemaField;
}

function field2Schema(field: IntegerField): SchemaIntegerField {
  return field;
}
