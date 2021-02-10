import yargs from 'yargs';

import { handleGenerateMigration } from './commands/generate-migration';
import { handleMigrate } from './commands/migrate';

yargs
  .command({
    command: 'migrate',
    describe: 'Run pending migrations',
    handler: handleMigrate,
  })
  .command({
    command: 'generate-migration',
    describe: 'Generates a new migration file',
    handler: handleGenerateMigration,
  })
  .demandCommand()
  .parse();
