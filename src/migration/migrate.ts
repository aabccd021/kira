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

export function migrate(): CollectionMap {
  const projectDir = 'example';
  const migrationInstances = getMigrationInstances({ projectDir });
  const migrations = migrationInstances.flatMap(({ migrations }) => migrations);

  const initialCollectionMap = {};
  const collectionMap = migrations.reduce(toSchema, initialCollectionMap);

  const appSchema = collectionMap2Schema(collectionMap);
  const appSchemaPath = path.join(projectDir, 'schema.json');
  fs.writeFileSync(appSchemaPath, stringify(appSchema, { space: 2 }));

  return collectionMap;
}

function collectionMap2Schema(collectionMap: CollectionMap): SchemaCollectionMap {
  const schemaCollectionPairs = mapValues(collectionMap, (collection) => {
    const schemaFields = mapValues(collection.fields, field2Schema);
    const schemaCollection: SchemaCollection = { ...collection, fields: schemaFields };

    return schemaCollection;
  });

  return schemaCollectionPairs;
}

function toSchema(collectionMap: CollectionMap, migration: Migration): CollectionMap {
  if (migration.type === 'createCollection') return onCreateCollection(collectionMap, migration);
  if (migration.type === 'createField') return onCreateField(collectionMap, migration);
  assertNever(migration);
}

type MigrationFile = { fileName: string; json: unknown };

function getMigrationFiles({ projectDir }: { projectDir: string }): MigrationFile[] {
  const migrationDir = path.join(projectDir, 'migrations');

  const migrationJSONs = fs.readdirSync(migrationDir).map((fileName) => {
    const filePath = path.join(migrationDir, fileName);
    const file = fs.readFileSync(filePath);
    const json = JSON.parse(file.toString());

    return { fileName, json };
  });

  return migrationJSONs;
}

function getMigrationInstances({ projectDir }: { projectDir: string }): MigrationInstance[] {
  const migrationFiles = getMigrationFiles({ projectDir });
  const { schema: migrationSchema } = getLatestMigrationSchema();

  const migrationInstances = migrationFiles.map(({ fileName, json }) => {
    const { valid, errors } = validate(json, migrationSchema);
    if (!valid) throw Error(`Migration file ${fileName} is invalid: ${errors}`);

    return json as MigrationInstance;
  });

  return migrationInstances;
}

migrate();
