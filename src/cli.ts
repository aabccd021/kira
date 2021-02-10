import yargs from 'yargs';
import { migrate } from './commands/migrate';
import { generateMigration } from './commands/generate-migration';

yargs
  .command({
    command: 'migrate',
    describe: 'Run pending migrations',
    handler: migrate,
  })
  .command({
    command: 'generate-migration',
    describe: 'Generates a new migration file',
    handler: generateMigration,
  })
  .demandCommand().argv;
