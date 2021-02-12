import _ from 'lodash';

import { Collection, CollectionMap } from '../field_processor/_util';

export type CreateCollection = {
  readonly type: 'createCollection';
  readonly collectionName: string;
};

export function createCollection(
  collectionMap: CollectionMap,
  migration: CreateCollection
): CollectionMap {
  const { collectionName: newCollectionName } = migration;

  const collection = collectionMap[newCollectionName];
  if (!_.isUndefined(collection)) throw Error(`Collection ${newCollectionName} already exists`);

  const newCollection: Collection = { fields: {} };
  return { ...collectionMap, [newCollectionName]: newCollection };
}
