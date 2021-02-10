import * as fs from 'fs';
import stringify from 'json-stable-stringify';
import { chain, mapValues } from 'lodash';

import { getConfig } from '../config';
import { toSchema } from '../fields';
import { Collection, migrate, SchemaCollection } from '../migration';
import { getMigrationInstances } from '../migration-schema';
import { onKey } from '../utils';

export function handleMigrate(): void {
  const { appSchemaPath } = getConfig();
  const migrationInstances = getMigrationInstances();

  const appSchema = chain(migrationInstances)
    .flatMap(onKey('migrations'))
    .reduce(migrate, {})
    .mapValues(toSchemaCollection)
    .value();

  fs.writeFileSync(appSchemaPath, stringify(appSchema, { space: 2 }));
}

function toSchemaCollection(collection: Collection): SchemaCollection {
  const fields = mapValues(collection.fields, toSchema);
  return { ...collection, fields };
}
