import path from 'path';

export type Config = {
  migrationDir: string;
  appSchemaPath: string;
};

export function getConfig(): Config {
  const projectDir = 'example';
  const migrationDir = path.join(projectDir, 'migrations');
  const appSchemaPath = path.join(projectDir, 'migrations');

  return { migrationDir, appSchemaPath };
}
