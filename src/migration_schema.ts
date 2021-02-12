import * as fs from 'fs';
import { validate } from 'jsonschema';
import _ from 'lodash';
import path from 'path';
import { compare as ascBySemver, SemVer } from 'semver';

import { getConfig } from './config';
import { Migration } from './migration/mod';

export type MigrationInstance = {
  readonly $schema?: string;
  readonly migrations: readonly Migration[];
};
export function getLatestMigrationSchema(): { readonly schema: unknown; readonly version: SemVer } {
  const schemaDir = path.join(__dirname, '..', '..', 'migration-schema');

  const latestVersion = _(schemaDir)
    .thru((dir) => fs.readdirSync(dir))
    .map((fileName) => path.basename(fileName, '.json'))
    .map((version) => new SemVer(version))
    .sort(ascBySemver)
    .last();

  if (_.isUndefined(latestVersion)) {
    throw Error(`Migration schema file not found on directory: ${schemaDir}`);
  }

  const schemaFilePath = path.join(schemaDir, `v${latestVersion}.json`);
  const schema = JSON.parse(fs.readFileSync(schemaFilePath).toString());

  return { schema, version: latestVersion };
}

export function getMigrationInstances(): readonly MigrationInstance[] {
  const { migrationDir } = getConfig();
  return _(migrationDir)
    .thru((dir) => fs.readdirSync(dir))
    .map((fileName) => path.join(migrationDir, fileName))
    .map(toMigrationJson)
    .value();
}

function toMigrationJson(filePath: string): MigrationInstance {
  const json = JSON.parse(fs.readFileSync(filePath).toString());

  const { schema } = getLatestMigrationSchema();
  const { valid, errors } = validate(json, schema);

  if (!valid) throw Error(`Migration file ${filePath} is invalid: ${errors}`);

  return json;
}
