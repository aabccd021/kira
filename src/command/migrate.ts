import * as fs from 'fs';
import stringify from 'json-stable-stringify';
import _ from 'lodash';

import { getConfig } from '../config';
import { Collection, SchemaCollection } from '../field_processor/_util';
import { toSchema } from '../field_processor/mod';
import { migrate } from '../migration/mod';
import { getMigrationInstances } from '../migration_schema';
import { onKey } from '../utils';

export function handleMigrateCommand(): void {
  const { appSchemaPath } = getConfig();
  const migrationInstances = getMigrationInstances();

  const appSchema = _.chain(migrationInstances)
    .flatMap(onKey('migrations'))
    .reduce(migrate, {})
    .mapValues(toSchemaCollection)
    .value();

  fs.writeFileSync(appSchemaPath, stringify(appSchema, { space: 2 }));
}

function toSchemaCollection(collection: Collection): SchemaCollection {
  const fields = _.mapValues(collection.fields, toSchema);
  return { ...collection, fields };
}
