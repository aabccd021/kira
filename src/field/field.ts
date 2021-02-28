import { FieldType, Validation } from './_util';

export type Field = (
  | CountField
  | IntegerField
  | ReferenceField
  | ServerTimestampField
  | StringField
  | SumField
) & { fieldType: FieldType };

export type SumField = {
  fieldType: 'sum';
  referenceCollectionName: string;
  referenceFieldName: string;
  referenceField: ReferenceField;
  sumFieldName: string;
  sumField: IntegerField;
};

export type CountField = {
  fieldType: 'count';
  referenceCollectionName: string;
  referenceFieldName: string;
  referenceField: ReferenceField;
};

/**
 * Reference
 */
export type ReferenceField = {
  fieldType: 'reference';
  referenceCollectionName: string;
  referenceSyncedFields: ReferenceSyncedFields;
};

export type ReferenceSyncedField = Exclude<Field, ReferenceField>;
export type ReferenceSyncedFields = { fieldName: string; field: ReferenceSyncedField }[];

/**
 * Server Timestamp
 */
export type ServerTimestampField = {
  fieldType: 'serverTimestamp';
};

export type StringField = {
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

export type IntegerField = {
  fieldType: 'integer';
  validation?: {
    /** Minimum value of this integer, inclusive. */
    min?: Validation<number>;
    /** Maximum value of this integer, inclusive. */
    max?: Validation<number>;
  };
};