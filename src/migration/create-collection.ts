import { isUndefined } from 'lodash';

import { Collection, CollectionMap } from '.';

export type CreateCollection = {
  type: 'createCollection';
  collectionName: string;
};

export function createCollection(
  collectionMap: CollectionMap,
  migration: CreateCollection
): CollectionMap {
  const { collectionName: newCollectionName } = migration;

  const collection = collectionMap[newCollectionName];
  if (!isUndefined(collection)) throw Error(`Collection ${newCollectionName} already exists`);

  const newCollection: Collection = { fields: {} };
  return { ...collectionMap, [newCollectionName]: newCollection };
}
