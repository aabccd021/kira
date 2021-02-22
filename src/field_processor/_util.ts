import { Field, SchemaField } from '../field';

export type FieldProcessor<F extends Field, S extends SchemaField> = {
  fieldOf: (schema: S, collections: Collections) => F;
  schemaOf: (field: F) => S;
  dependencyOf: (schema: S) => FieldId[];
};

export type Collections = { [name: string]: Collection };
export type Collection = { fields: Fields };
export type Fields = { [name: string]: Field };

export type SchemaCollections = { [name: string]: SchemaCollection };
export type SchemaCollection = { fields: SchemaFields };
export type SchemaFields = { [name: string]: SchemaField };

export type FieldId = {
  collectionName: string;
  fieldName: string;
};
