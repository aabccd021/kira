import yargs from 'yargs';

import { handleMigrateCommand } from './command/migrate';

yargs
  .command({
    command: 'migrate',
    describe: 'Run pending migrations',
    handler: handleMigrateCommand,
  })
  .demandCommand()
  .parse();
