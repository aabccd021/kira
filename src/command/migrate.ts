import { chain, curry, find } from 'lodash';

import { Field, SchemaField } from '../field';
import {
  Collection,
  Collections,
  FieldId,
  Fields,
  SchemaCollection,
} from '../field_processor/_util';
import { dependencyIdsOf, fieldOf } from '../field_processor/mod';
import { loadSchemaOnPath } from '../schema';
import { sort } from '../util';

export async function migrate(): Promise<void> {
  const schemaPath = './../example/schema';
  const schema = await loadSchemaOnPath(schemaPath);
  const collections = chain(schema.collections)
    .toPairs()
    .flatMap(_toFieldEntries)
    .thru(sort(_byDependency))
    .reduce(_processField, {})
    .value();
  console.log(collections);
}

export type SchemaFieldEntry = {
  id: FieldId;
  schemaField: SchemaField;
};

function _toFieldEntry(
  collectionName: string,
  collectionPairs: [string, SchemaField]
): SchemaFieldEntry {
  const [fieldName, schemaField] = collectionPairs;
  const id: FieldId = { collectionName, fieldName };
  return { id, schemaField };
}

const toFieldEntryWith = curry(_toFieldEntry);

export function _toFieldEntries(collectionPair: [string, SchemaCollection]): SchemaFieldEntry[] {
  const [collectionName, schemaCollection] = collectionPair;
  return chain(schemaCollection.fields).toPairs().map(toFieldEntryWith(collectionName)).value();
}

export function _byDependency(a: SchemaFieldEntry, b: SchemaFieldEntry): number {
  const aDependencyIds = dependencyIdsOf(a.schemaField);
  const bDependencyIds = dependencyIdsOf(b.schemaField);
  if (find(aDependencyIds, b.id)) return 1;
  if (find(bDependencyIds, a.id)) return -1;
  return 0;
}

export function _processField(
  collections: Collections,
  schemaFieldEntry: SchemaFieldEntry
): Collections {
  const { id, schemaField } = schemaFieldEntry;
  const { collectionName, fieldName } = id;

  const collection = collections[collectionName];
  const newField: Field = fieldOf(schemaField, collections);
  const newFields: Fields = { ...collection?.fields, [fieldName]: newField };
  const newCollection: Collection = { ...collection, fields: newFields };
  return { ...collections, [collectionName]: newCollection };
}
