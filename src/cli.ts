import yargs from 'yargs';

import { migrate } from './command/migrate';

yargs
  .command({
    command: 'migrate',
    describe: 'Run pending migrations',
    handler: migrate,
  })
  .demandCommand()
  .parse();
