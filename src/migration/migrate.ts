import * as fs from 'fs';
import path from 'path';
import { validate } from 'jsonschema';
import { mapValues } from 'lodash';
import stringify from 'json-stable-stringify';
import { assertNever } from 'assert-never';
import { field2Schema } from '../field';
import {
  CollectionMap,
  Migration,
  MigrationInstance,
  onCreateCollection,
  onCreateField,
  SchemaCollection,
  SchemaCollectionMap,
} from './migration';
import { getLatestMigrationSchema } from './util';
import { getConfig } from '../config';

export function migrate(): CollectionMap {
  const { appSchemaPath } = getConfig();
  const migrationInstances = getMigrationInstances();
  const migrations = migrationInstances.flatMap(({ migrations }) => migrations);

  const initialCollectionMap = {};
  const collectionMap = migrations.reduce(toSchema, initialCollectionMap);

  const appSchema = collectionMap2Schema(collectionMap);
  fs.writeFileSync(appSchemaPath, stringify(appSchema, { space: 2 }));

  return collectionMap;
}

function collectionMap2Schema(collectionMap: CollectionMap): SchemaCollectionMap {
  const schemaCollectionPairs = mapValues(collectionMap, (collection) => {
    const fields = mapValues(collection.fields, field2Schema);
    const schemaCollection: SchemaCollection = { ...collection, fields };

    return schemaCollection;
  });

  return schemaCollectionPairs;
}

function toSchema(collectionMap: CollectionMap, migration: Migration): CollectionMap {
  if (migration.type === 'createCollection') return onCreateCollection(collectionMap, migration);
  if (migration.type === 'createField') return onCreateField(collectionMap, migration);
  assertNever(migration);
}

type MigrationFile = { readonly fileName: string; readonly json: unknown };

function getMigrationFiles(): readonly MigrationFile[] {
  const { migrationDir } = getConfig();

  const migrationJSONs = fs.readdirSync(migrationDir).map((fileName) => {
    const filePath = path.join(migrationDir, fileName);
    const file = fs.readFileSync(filePath);
    const json = JSON.parse(file.toString());

    return { fileName, json };
  });

  return migrationJSONs;
}

function getMigrationInstances(): readonly MigrationInstance[] {
  const migrationFiles = getMigrationFiles();
  const { schema: migrationSchema } = getLatestMigrationSchema();

  const migrationInstances = migrationFiles.map(({ fileName, json }) => {
    const { valid, errors } = validate(json, migrationSchema);
    if (!valid) throw Error(`Migration file ${fileName} is invalid: ${errors}`);

    return json as MigrationInstance;
  });

  return migrationInstances;
}
