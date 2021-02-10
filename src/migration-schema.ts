import * as fs from 'fs';
import { validate } from 'jsonschema';
import _, { isUndefined } from 'lodash';
import path from 'path';
import { compare as ascBySemver, SemVer } from 'semver';

import { getConfig } from './config';
import { Migration } from './migration';

export type MigrationInstance = {
  $schema?: string;
  migrations: Migration[];
};
export function getLatestMigrationSchema(): { schema: unknown; version: SemVer } {
  const schemaDir = path.join(__dirname, '..', '..', 'migration-schema');

  const latestVersion = _(fs.readdirSync(schemaDir))
    .map((fileName) => path.basename(fileName, '.json'))
    .map((version) => new SemVer(version))
    .sort(ascBySemver)
    .last();

  if (isUndefined(latestVersion)) {
    throw Error(`Migration schema file not found on directory: ${schemaDir}`);
  }

  const schemaFilePath = path.join(schemaDir, `v${latestVersion}.json`);
  const schema = JSON.parse(fs.readFileSync(schemaFilePath).toString());

  return { schema, version: latestVersion };
}

export function getMigrationInstances(): MigrationInstance[] {
  const { migrationDir } = getConfig();
  return fs
    .readdirSync(migrationDir)
    .map((fileName) => path.join(migrationDir, fileName))
    .map(toMigrationJson);
}

function toMigrationJson(filePath: string): MigrationInstance {
  const json = JSON.parse(fs.readFileSync(filePath).toString());

  const { schema } = getLatestMigrationSchema();
  const { valid, errors } = validate(json, schema);

  if (!valid) throw Error(`Migration file ${filePath} is invalid: ${errors}`);

  return json;
}
