import { Field, SchemaField } from '../field';

export type FieldProcessor<S extends SchemaField = SchemaField, F extends Field = Field> = {
  readonly fieldOf: (schema: S, collectionMap: CollectionMap) => F;
  readonly schemaOf: (field: F) => S;
};

export type CollectionMap = { readonly [name: string]: Collection };
export type Collection = { readonly fields: FieldMap };
export type FieldMap = { readonly [name: string]: Field };

export type SchemaCollectionMap = { readonly [name: string]: SchemaCollection };
export type SchemaCollection = { readonly fields: SchemaFieldMap };
export type SchemaFieldMap = { readonly [name: string]: SchemaField };
