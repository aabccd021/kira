/**
 * util
 */
type integer = number;

/**
 * Schema Field
 */
export type SchemaField =
  | CountSchemaField
  | IntegerSchemaField
  | ReferenceSchemaField
  | ServerTimestampSchemaField
  | StringSchemaField
  | SumSchemaField;

/**
 * Field
 */
export type Field =
  | CountField
  | IntegerField
  | ReferenceField
  | ServerTimestampField
  | StringField
  | SumField;

/**
 * Sum Field
 * Sum value of certain field of document which refers to this document
 */
export type SumSchemaField = {
  /** @ignore */
  readonly type: 'sum';
  /**
   * Name of collection of document of summed field, the collection must have reference to
   * collection of this document.
   */
  readonly referenceCollectionName: string;
  /**
   * Name of {@link ReferenceField} of document of summed field, only field of document that
   * reference this document will be summed.
   */
  readonly referenceFieldName: string;
  /**
   * Name of field to be summed. The field must be {@link IntegerField}.
   */
  readonly sumFieldName: string;
};

export type SumField = SumSchemaField & {
  readonly referenceField: ReferenceField;
  readonly sumField: IntegerField;
};

/**
 * Count
 */
export type CountSchemaField = {
  /** @ignore */
  readonly type: 'count';
  /**
   * Name of collection of counted document, the collection must have reference to collection of
   * this document.
   */
  readonly referenceCollectionName: string;
  /**
   * Name of {@link ReferenceField} of counted document, only document that reference document of
   * this field will be counted.
   */
  readonly referenceFieldName: string;
};

export type CountField = CountSchemaField & {
  readonly referenceField: ReferenceField;
};

/**
 * Reference
 */
export type ReferenceSchemaField = {
  /** @ignore */
  readonly type: 'reference';
  /**
   * Name of collection of referenced document.
   */
  readonly referenceCollectionName: string;
  /**
   * Name of fields to be synced.
   */
  readonly referenceSyncedFields: ReadonlyArray<string>;
};

export type ReferenceField = Omit<ReferenceSchemaField, 'referenceSyncedFields'> & {
  readonly referenceSyncedFields: { readonly [fieldName: string]: Exclude<Field, ReferenceField> };
};

/**
 * Server Timestamp
 */
export type ServerTimestampField = ServerTimestampSchemaField;

export type ServerTimestampSchemaField = {
  readonly type: 'serverTimestamp';
};

/**
 * String
 */
export type StringSchemaField = {
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
  readonly properties?: ReadonlyArray<'isUnique'>;
};

export type StringField = StringSchemaField;

/**
 * Integer
 */
export type IntegerSchemaField = {
  /** @ignore */
  readonly type: 'integer';
  /** Minimum value of this integer, inclusive. */
  readonly min?: integer;
  /** Maximum value of this integer, inclusive. */
  readonly max?: integer;
};

export type IntegerField = IntegerSchemaField;
