import { isNil, some } from 'lodash';
import pluralize from 'pluralize';
import { Field, schema2Field, SchemaField } from '../field';

export type MigrationInstance = {
  readonly $schema?: string;
  readonly migrations: readonly Migration[];
};

export type Migration = CreateCollection | CreateField;

export type CollectionMap = { readonly [name: string]: Collection };
export type SchemaCollectionMap = { readonly [name: string]: SchemaCollection };
export type FieldMap = { readonly [name: string]: Field };
export type SchemaFieldMap = { readonly [name: string]: SchemaField };

/**
 * Kira Collection
 */

export type Collection = {
  readonly singularName: string;
  readonly fields: FieldMap;
};
export type SchemaCollection = {
  readonly singularName: string;
  readonly fields: SchemaFieldMap;
};

export type CreateCollection = {
  readonly type: 'createCollection';
  /**
   * @minLength 1
   */
  readonly collectionName: string;
  /**
   * @minLength 1
   */
  readonly singularName?: string;
};

export function onCreateCollection(
  collectionMap: CollectionMap,
  migration: CreateCollection
): CollectionMap {
  const { collectionName, singularName } = migration;

  const collection = collectionMap[collectionName];
  if (!isNil(collection)) throw Error(`Collection ${collectionName} already exists`);

  const newSingularName = singularName ?? pluralize.singular(collectionName);
  const duplicateSingularNameFound = some(
    collectionMap,
    ({ singularName }) => singularName === newSingularName
  );
  if (duplicateSingularNameFound) throw Error(`Duplicate singular name found: ${newSingularName}`);

  const newCollection: Collection = { fields: {}, singularName: newSingularName };
  return { ...collectionMap, [collectionName]: newCollection };
}

export type CreateField = {
  readonly type: 'createField';
  /**
   * @minLength 1
   */
  readonly collectionName: string;
  /**
   * @minLength 1
   */
  readonly fieldName: string;
  readonly field: SchemaField;
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
