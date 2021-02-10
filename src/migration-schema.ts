import * as fs from 'fs';
import path from 'path';
import { Migration } from './migration';
import { SemVer, sort as semverSort } from 'semver';
import { getConfig } from './config';
import { isNil, last } from 'lodash';
import { validate } from 'jsonschema';

export type MigrationInstance = {
  $schema?: string;
  migrations: Migration[];
};
export function getLatestMigrationSchema(): { schema: unknown; version: SemVer } {
  const schemaDir = path.join(__dirname, '..', '..', 'migration-schema');
  const fileNames = fs.readdirSync(schemaDir);

  const versions = fileNames
    .map((fileName) => path.basename(fileName, '.json'))
    .map((version) => new SemVer(version));
  const sortedVersions = semverSort(versions);
  const latestVersion = last(sortedVersions);

  if (isNil(latestVersion)) {
    throw Error(`Migration schema file not found on directory: ${schemaDir}`);
  }

  const schemaFilePath = path.join(schemaDir, `v${latestVersion}.json`);
  const schema = JSON.parse(fs.readFileSync(schemaFilePath).toString());

  return { schema, version: latestVersion };
}

export function getMigrationInstances(): MigrationInstance[] {
  const { migrationDir } = getConfig();
  const migrationJSONs = fs
    .readdirSync(migrationDir)
    .map((fileName) => path.join(migrationDir, fileName))
    .map(toMigrationJson);

  return migrationJSONs;
}

function toMigrationJson(filePath: string): MigrationInstance {
  const json = JSON.parse(fs.readFileSync(filePath).toString());

  const { schema } = getLatestMigrationSchema();
  const { valid, errors } = validate(json, schema);

  if (!valid) throw Error(`Migration file ${filePath} is invalid: ${errors}`);

  return json;
}
