import * as fs from 'fs';
import { mapValues } from 'lodash';
import stringify from 'json-stable-stringify';
import { field2Schema } from '../fields';
import { CollectionMap, SchemaCollection, SchemaCollectionMap } from '../migration';
import { getConfig } from '../config';
import { getMigrationInstances } from '../migration-schema';

export function migrate(): CollectionMap {
  const { appSchemaPath } = getConfig();
  const migrationInstances = getMigrationInstances();
  const migrations = migrationInstances.flatMap(({ migrations }) => migrations);

  const emptyCollectionMap: CollectionMap = {};
  const collectionMap = migrations.reduce(migrate, emptyCollectionMap);

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
