import * as fs from 'fs';
import path from 'path';
import * as semver from 'semver';
import * as tsj from 'ts-json-schema-generator';
import yargs from 'yargs';

import { getLatestMigrationSchema } from '../../migration-schema';

function generateMigrationJsonSchema(): void {
  const releaseTypes: semver.ReleaseType[] = [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease',
  ];

  const argv = yargs.option('release-type', { choices: releaseTypes, demandOption: true }).argv;
  const { version: latestVersion } = getLatestMigrationSchema();
  const releaseType = argv['release-type'];
  const newVersion = semver.inc(latestVersion, releaseType);

  const config: tsj.Config = {
    path: path.join('src', 'index.ts'),
    type: 'MigrationInstance',
    tsconfig: path.join(__dirname, 'tsconfig.json'),
    additionalProperties: true,
  };

  const ouptutPath = path.join('migration-schema', `v${newVersion}.json`);

  const schema = tsj.createGenerator(config).createSchema(config.type);
  const schemaString = JSON.stringify(schema, undefined, 2);
  fs.writeFileSync(ouptutPath, schemaString);
}

generateMigrationJsonSchema();
