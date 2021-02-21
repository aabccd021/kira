import stringify from 'json-stable-stringify';
import { curry, find, isUndefined, keys, map, reduce } from 'lodash';

import {
  Collection,
  Collections,
  FieldId,
  SchemaCollection,
  SchemaCollections,
} from '../field_processor/_util';
import { getDependencies, toField } from '../field_processor/mod';

export async function handleMigrateCommand(): Promise<void> {
  const schemaPath = './../../example/schema';
  const schemaFile: { default: unknown } = await import(schemaPath);
  const schema = schemaFile.default;

  if (!isSchema(schema)) throw Error(`${schemaPath} is not a valid schema`);

  const emptyAccumulator: Accumulator = { validatedFieldIds: [], collections: {} };
  const collections = reduce(
    keys(schema.collections),
    curry(processCollection)(schema.collections),
    emptyAccumulator
  );

  console.log(stringify(collections, { space: 2 }));
}

/**
 * To Collection
 */
function processCollection(
  schemaCollections: SchemaCollections,
  accumulator: Accumulator,
  collectionName: string
): Accumulator {
  const fieldNames = keys(schemaCollections[collectionName]?.fields);
  const fieldIds: FieldId[] = map(fieldNames, (fieldName) => ({ fieldName, collectionName }));
  return reduce(fieldIds, curry(processField)(schemaCollections), accumulator);
}

/**
 * To Field
 */
function processField(
  schemaCollections: SchemaCollections,
  accumulator: Accumulator,
  fieldId: FieldId
): Accumulator {
  const { validatedFieldIds, collections } = accumulator;
  if (find(validatedFieldIds, fieldId)) return accumulator;

  const { collectionName, fieldName } = fieldId;

  const schemaCollection = schemaCollections[collectionName];
  if (isUndefined(schemaCollection)) throw Error(`${collectionName} not found`);

  const schemaField = schemaCollection.fields[fieldName];
  if (isUndefined(schemaField)) throw Error(`${collectionName}.${fieldName} not found`);

  const { fieldType } = schemaField;

  const dependency = getDependencies(fieldType);
  const dependencyAccumulator = reduce(
    dependency,
    curry(processField)(schemaCollections),
    accumulator
  );

  const collection = collections[collectionName];
  const fields = collection?.fields;
  const newField = toField(schemaField, dependencyAccumulator.collections);
  const newFields = { ...fields, [fieldName]: newField };
  const newCollection: Collection = { ...collection, fields: newFields };
  const newCollections: Collections = { ...collections, [collectionName]: newCollection };
  const newValidatedFieldIds: FieldId[] = [...dependencyAccumulator.validatedFieldIds, fieldId];

  return {
    validatedFieldIds: newValidatedFieldIds,
    collections: newCollections,
  };
}

type Accumulator = {
  validatedFieldIds: FieldId[];
  collections: Collections;
};

/**
 * Schema
 */
const version = '0.1.0';

export type KiraSchema = {
  version: typeof version;
  collections: { [collectionName: string]: SchemaCollection };
};

function isSchema(rawSchema: unknown): rawSchema is KiraSchema {
  return (rawSchema as KiraSchema).version === version;
}
