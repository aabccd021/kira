import { isNil } from 'lodash';
import { Collection, CollectionMap, FieldMap } from '.';
import { SchemaField, schema2Field } from '../fields';

export type CreateField = {
  type: 'createField';
  collectionName: string;
  fieldName: string;
  field: SchemaField;
};

export function createField(collectionMap: CollectionMap, migration: CreateField): CollectionMap {
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
