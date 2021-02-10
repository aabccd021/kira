import { isNil } from 'lodash';
import { Field, schema2Field, SchemaField } from '../field';

export type MigrationInstance = {
  $schema?: string;
  migrations: Migration[];
};

export type Migration = CreateCollection | CreateField;

export type CollectionMap = { [name: string]: Collection };
export type SchemaCollectionMap = { [name: string]: SchemaCollection };
export type FieldMap = { [name: string]: Field };
export type SchemaFieldMap = { [name: string]: SchemaField };

/**
 * Kira Collection
 */
export type Collection = {
  fields: FieldMap;
};
export type SchemaCollection = {
  fields: SchemaFieldMap;
};

export type CreateCollection = {
  type: 'createCollection';
  collectionName: string;
};

export function onCreateCollection(
  collectionMap: CollectionMap,
  migration: CreateCollection
): CollectionMap {
  const { collectionName: newCollectionName } = migration;

  const collection = collectionMap[newCollectionName];
  if (!isNil(collection)) throw Error(`Collection ${newCollectionName} already exists`);

  const newCollection: Collection = { fields: {} };
  return { ...collectionMap, [newCollectionName]: newCollection };
}

export type CreateField = {
  type: 'createField';
  collectionName: string;
  fieldName: string;
  field: SchemaField;
};

export function onCreateField(collectionMap: CollectionMap, migration: CreateField): CollectionMap {
  const { collectionName, fieldName, field: schemaField } = migration;

  const collection = collectionMap[collectionName];
  if (isNil(collection)) throw Error(`Collection ${collectionName} does not exist`);

  const { fields } = collection;
  if (!isNil(fields[fieldName])) {
    throw Error(`Field ${fieldName} already exists on collection ${collectionName}`);
  }

  const field = schema2Field(schemaField, collectionMap);
  const newFields: FieldMap = { ...fields, [fieldName]: field };
  const newCollection: Collection = { ...collection, fields: newFields };
  return { ...collectionMap, [collectionName]: newCollection };
}
