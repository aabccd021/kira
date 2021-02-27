import { chain, curry, find, forEach, isEmpty, isEqual, isUndefined } from 'lodash';

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
    .thru(_assertNoCircularDependency)
    .thru(sort(_byDependency))
    .reduce(_processField, {})
    .value();
  console.log(collections);
}

export type SchemaFieldEntry = {
  id: FieldId;
  schemaField: SchemaField;
};

/**
 * With Id
 */
function __withId(a: FieldId, b: SchemaFieldEntry): boolean {
  return isEqual(a, b.id);
}

const _withId = curry(__withId);

/**
 * Assert dependency
 */
function _assertDepHasNoCircularDependency(
  entries: SchemaFieldEntry[],
  idTraces: FieldId[],
  depId: FieldId
): void {
  console.log('y', idTraces);
  const depEntry: SchemaFieldEntry | undefined = find(entries, _withId(depId));
  if (isUndefined(depEntry)) throw Error();
  _assertFieldNoCircularDependency(entries, idTraces, depEntry);
}

const assertDepHasNoCircularDependency = curry(_assertDepHasNoCircularDependency);

function _assertFieldNoCircularDependency(
  entries: SchemaFieldEntry[],
  _idTraces: FieldId[],
  entry: SchemaFieldEntry
): void {
  const idTraces = _idTraces ?? [];
  const { id, schemaField } = entry;
  const dependencyIds = dependencyIdsOf(schemaField);
  if (find(idTraces, id)) {
    throw Error(`Circular dependency detected: ${JSON.stringify(idTraces, undefined, 2)}`);
  }
  const newIdTraces = [...idTraces, id];
  forEach(dependencyIds, assertDepHasNoCircularDependency(entries)(newIdTraces));
}

const assertFieldNoCircularDependency = curry(_assertFieldNoCircularDependency);

export function _assertNoCircularDependency(
  schemaFieldEntries: SchemaFieldEntry[]
): SchemaFieldEntry[] {
  forEach(schemaFieldEntries, assertFieldNoCircularDependency(schemaFieldEntries)([]));
  return schemaFieldEntries;
}

/**
 *
 */
function toFieldEntry(
  collectionName: string,
  collectionPairs: [string, SchemaField]
): SchemaFieldEntry {
  const [fieldName, schemaField] = collectionPairs;
  const id: FieldId = { collectionName, fieldName };
  return { id, schemaField };
}

const toFieldEntryWith = curry(toFieldEntry);

export function _toFieldEntries(collectionPair: [string, SchemaCollection]): SchemaFieldEntry[] {
  const [collectionName, schemaCollection] = collectionPair;
  return chain(schemaCollection.fields).toPairs().map(toFieldEntryWith(collectionName)).value();
}

/**
 * Compare by dependency
 */
export function _byDependency(a: SchemaFieldEntry, b: SchemaFieldEntry): number {
  const aDependencyIds = dependencyIdsOf(a.schemaField);
  const bDependencyIds = dependencyIdsOf(b.schemaField);
  if (find(aDependencyIds, b.id)) return 1;
  if (find(bDependencyIds, a.id)) return -1;
  if (isEmpty(aDependencyIds) && !isEmpty(bDependencyIds)) return 1;
  if (isEmpty(bDependencyIds) && !isEmpty(aDependencyIds)) return -1;
  return 0;
}

/**
 * Process Field
 */
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
