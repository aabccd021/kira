import path from 'path';
import * as fs from 'fs';
import { SemVer, sort as semverSort } from 'semver';
import { isNil, last } from 'lodash';

export function getLatestMigrationSchema(): { readonly schema: unknown; readonly version: SemVer } {
  const schemaDir = path.join(__dirname, '..', '..', 'migration-schema');
  const fileNames = fs.readdirSync(schemaDir);

  const versions = fileNames.map((n) => path.basename(n, '.json')).map((n) => new SemVer(n));
  const latestVersion = last(semverSort(versions));

  if (isNil(latestVersion)) {
    throw Error(`Migration schema file not found on directory: ${schemaDir}`);
  }

  const schemaFilePath = path.join(schemaDir, `v${latestVersion}.json`);
  const schema = JSON.parse(fs.readFileSync(schemaFilePath).toString());

  return { schema, version: latestVersion };
}
