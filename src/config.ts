import path from 'path';

export type Config = {
  readonly migrationDir: string;
  readonly appSchemaPath: string;
};

export function getConfig(): Config {
  const projectDir = 'example';
  const migrationDir = path.join(projectDir, 'migrations');
  const appSchemaPath = path.join(projectDir, 'schema.json');

  return { migrationDir, appSchemaPath };
}
