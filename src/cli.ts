import yargs from 'yargs';

import { handleGenerateMigrationCommand } from './command/generate_migration';
import { handleMigrateCommand } from './command/migrate';

yargs
  .command({
    command: 'migrate',
    describe: 'Run pending migrations',
    handler: handleMigrateCommand,
  })
  .command({
    command: 'generate-migration',
    describe: 'Generates a new migration file',
    handler: handleGenerateMigrationCommand,
  })
  .demandCommand()
  .parse();
