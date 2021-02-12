import _ from 'lodash';

import { SchemaField } from '../field';
import { Collection, CollectionMap, FieldMap } from '../field_processor/_util';
import { toField } from '../field_processor/mod';

export type CreateField = {
  readonly type: 'createField';
  readonly collectionName: string;
  readonly fieldName: string;
  readonly field: SchemaField;
};

export function createField(collectionMap: CollectionMap, migration: CreateField): CollectionMap {
  const { collectionName, fieldName, field: schemaField } = migration;

  const collection = collectionMap[collectionName];
  if (_.isUndefined(collection)) throw Error(`Collection ${collectionName} does not exist`);

  const { fields } = collection;
  if (!_.isUndefined(fields[fieldName])) {
    throw Error(`Field ${fieldName} already exists on collection ${collectionName}`);
  }

  const field = toField(schemaField, collectionMap);
  const newFields: FieldMap = { ...fields, [fieldName]: field };
  const newCollection: Collection = { ...collection, fields: newFields };
  return { ...collectionMap, [collectionName]: newCollection };
}
