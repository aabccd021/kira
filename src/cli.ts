import yargs from 'yargs';
import { migrate } from './migration/migrate';
import { generateMigrationFile } from './commands/generate-migration-file';

yargs
  .command({
    command: 'app:migrate',
    describe: 'Run pending migrations',
    handler: migrate,
  })
  .command({
    command: 'migration:generate',
    describe: 'Generates a new migration file',
    handler: generateMigrationFile,
  })
  .demandCommand().argv;
