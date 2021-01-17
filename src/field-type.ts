/**
 * Kira fields.
 * Property `type` of a field is required, and must be a camelCase of it's name.
 */
export type Field =
  | BooleanField
  | DateField
  | DateTimeField
  | FloatField
  | IntField
  | ListField
  | MapField
  | ReferenceField
  | StringField;

export type BooleanField = {
  type: 'boolean';
};

export type DateField = {
  type: 'date';
};

export type DateTimeField = {
  type: 'dateTime';
};

export type FloatField = {
  type: 'float';
};

export type IntField = {
  type: 'int';
};

/**
 * @member keyDataType data type of list elements. List can contain elements of multiple data types if this property is
 * not specified.
 */
export type ListField = {
  type: 'list';
  keyDataType?: string; //TODO: Use string literal
};

/**
 * Map field
 * @member keyDataType data type of map keys. List can contain elements of multiple data types if this property is not
 * specified.
 * @member valueDataType data type of map values. List can contain elements of multiple data types if this property is
 * not specified.
 */
export type MapField = {
  type: 'map';
  keyDataType?: string; //TODO: Use string literal
  valueDataType?: string; //TODO: Use string literal
};

export type ReferenceField = {
  type: 'reference';
};

export type StringField = {
  type: 'string';
};
