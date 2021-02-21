/**
 * util
 */
type integer = number;
type Validation<T> = {
  value: T;
  errorMessage?: string;
};

/**
 * Field Type
 */
export type FieldType = 'count' | 'integer' | 'reference' | 'serverTimestamp' | 'string' | 'sum';

/**
 * Schema Field
 */
export type SchemaField = (
  | CountFieldMigration
  | IntegerFieldMigration
  | ReferenceFieldMigration
  | ServerTimestampFieldMigration
  | StringFieldMigration
  | SumFieldMigration
) & { fieldType: FieldType };

/**
 * Field
 */
export type Field = (
  | CountField
  | IntegerField
  | ReferenceField
  | ServerTimestampField
  | StringField
  | SumField
) & { fieldType: FieldType };

/**
 * Sum Field
 * Sum value of certain field of document which refers to this document
 */
export type SumFieldMigration = {
  /** @ignore */
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
  /** Name of field to be summed. The field must be {@link IntegerField}. */
  sumFieldName: string;
};
export type SumField = SumFieldMigration & {
  referenceField: ReferenceField;
  sumField: IntegerField;
};

/**
 * Count
 */
export type CountFieldMigration = {
  /** @ignore */
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
export type CountField = CountFieldMigration & {
  referenceField: ReferenceField;
};

/**
 * Reference
 */
export type ReferenceFieldMigration = {
  /** @ignore */
  fieldType: 'reference';
  /** Name of collection of referenced document. */
  referenceCollectionName: string;
  /** Name of fields to be synced. */
  referenceSyncedFields: Array<string>;
};
export type ReferenceField = Omit<ReferenceFieldMigration, 'referenceSyncedFields'> & {
  referenceSyncedFields: { [fieldName: string]: Exclude<Field, ReferenceField> };
};

/**
 * Server Timestamp
 */
export type ServerTimestampField = ServerTimestampFieldMigration;
export type ServerTimestampFieldMigration = {
  fieldType: 'serverTimestamp';
};

/**
 * String
 */
export type StringFieldMigration = {
  /** @ignore */
  fieldType: 'string';
  /** `isUnique`: value of this string field will be unique across collections. */
  properties?: ReadonlyArray<'isUnique'>;
  validation?: {
    /** Minimum length of this string, inclusive. */
    minLength?: Validation<integer>;
    /** Maximum length of this string, inclusive. */
    maxLength?: Validation<integer>;
  };
};
export type StringField = StringFieldMigration;

/**
 * Integer
 */
export type IntegerFieldMigration = {
  /** @ignore */
  fieldType: 'integer';
  validation?: {
    /** Minimum value of this integer, inclusive. */
    min?: Validation<integer>;
    /** Maximum value of this integer, inclusive. */
    max?: Validation<integer>;
  };
};
export type IntegerField = IntegerFieldMigration;
