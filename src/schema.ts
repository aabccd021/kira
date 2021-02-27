import { SchemaCollection } from './util';

const version = '0.1.0';

export type KiraSchema = {
  version: typeof version;
  collections: { [collectionName: string]: SchemaCollection };
};

function isSchema(rawSchema: unknown): rawSchema is KiraSchema {
  return (rawSchema as KiraSchema).version === version;
}

export async function loadSchemaOnPath(schemaPath: string): Promise<KiraSchema> {
  const schemaFile: { default: unknown } = await import(schemaPath);
  const schema = schemaFile.default;

  if (!isSchema(schema)) throw Error(`${schemaPath} is not a valid schema`);

  return schema;
}
