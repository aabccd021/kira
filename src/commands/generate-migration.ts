import dateformat from 'dateformat';
import path from 'path';
import * as fs from 'fs';
import { getConfig } from '../config';
import { getLatestMigrationSchema, MigrationInstance } from '../migration-schema';

export function generateMigration(): void {
  const { migrationDir } = getConfig();

  const now = new Date();
  const useUtcTime = true;
  const fileName = dateformat(now, 'yyyymmddHHMMss', useUtcTime);
  const filePath = path.join(migrationDir, `${fileName}.json`);

  const { version } = getLatestMigrationSchema();
  const emptyMigrationInstance: MigrationInstance = {
    $schema:
      `https://raw.githubusercontent.com/aabccd021/kira/master/migration-schema/` +
      `v${version}.json`,
    migrations: [],
  };

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(emptyMigrationInstance, null, 2));
}
