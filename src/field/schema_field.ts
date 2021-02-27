import { FieldType, Validation } from './_util';

export type SchemaField = (
  | CountSchemaField
  | IntegerSchemaField
  | ReferenceSchemaField
  | ServerTimestampSchemaField
  | StringSchemaField
  | SumSchemaField
) & { fieldType: FieldType };

export type SumSchemaField = {
  fieldType: 'sum';
  /**
   * Name of collection of document of summed field, the collection must have reference to
   * collection of this document.
   */
  referenceCollectionName: string;
  /**
   * Name of {@link ReferenceField} of document of summed field, only field of document that
   * reference this document will be summed.
   */
  referenceFieldName: string;
  /** Name of field to be summed. The field must be {@link numberField}. */
  sumFieldName: string;
};

export type CountSchemaField = {
  fieldType: 'count';
  /**
   * Name of collection of counted document, the collection must have reference to collection of
   * this document.
   */
  referenceCollectionName: string;
  /**
   * Name of {@link ReferenceField} of counted document, only document that reference document of
   * this field will be counted.
   */
  referenceFieldName: string;
};

export type ReferenceSchemaField = {
  fieldType: 'reference';
  /** Name of collection of referenced document. */
  referenceCollectionName: string;
  /** Name of fields to be synced. */
  referenceSyncedFieldNames: string[];
};

export type ServerTimestampSchemaField = {
  fieldType: 'serverTimestamp';
};

export type StringSchemaField = {
  fieldType: 'string';
  /** `isUnique`: value of this string field will be unique across collections. */
  properties?: 'isUnique'[];
  validation?: {
    /** Minimum length of this string, inclusive. */
    minLength?: Validation<number>;
    /** Maximum length of this string, inclusive. */
    maxLength?: Validation<number>;
  };
};

export type IntegerSchemaField = {
  fieldType: 'integer';
  validation?: {
    /** Minimum value of this number, inclusive. */
    min?: Validation<number>;
    /** Maximum value of this number, inclusive. */
    max?: Validation<number>;
  };
};
