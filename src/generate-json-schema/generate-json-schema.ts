import * as fs from 'fs';
import { SemVer } from 'semver';
import * as tsj from 'ts-json-schema-generator';
import { Config } from 'ts-json-schema-generator';
import path from 'path';

export function generateMigrationJsonSchema(semver: SemVer): void {
  const config: Config = {
    path: path.join('src', 'index.ts'),
    type: 'MigrationInstance',
    tsconfig: path.join(__dirname, 'tsconfig.json'),
    additionalProperties: true,
  };

  const ouptutPath = path.join('migration-schema', `v${semver}.json`);

  const schema = tsj.createGenerator(config).createSchema(config.type);
  const schemaString = JSON.stringify(schema, null, 2);
  fs.writeFileSync(ouptutPath, schemaString);
}

generateMigrationJsonSchema(new SemVer('0.1.0'));
