import dateformat from 'dateformat';
import path from 'path';
import { MigrationInstance } from '../migration/migration';
import { getLatestMigrationSchema } from '../migration/util';
import * as fs from 'fs';
import { getConfig } from '../config';

export function generateMigrationFile(): void {
  const { migrationDir } = getConfig();

  const now = new Date();
  const useUtcTime = true;
  const fileName = dateformat(now, 'yyyymmddHHMMss', useUtcTime);
  const filePath = path.join(migrationDir, `${fileName}.json`);

  const { version: latestVersion } = getLatestMigrationSchema();

  const emptyMigration: MigrationInstance = {
    $schema:
      `https://raw.githubusercontent.com/aabccd021/kira/master/migration-schema/` +
      `v${latestVersion}.json`,
    migrations: [],
  };

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(emptyMigration, null, 2));
}
