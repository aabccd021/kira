import assert from 'power-assert';

import { getConfig } from './config';

test('can return config', function () {
  const { migrationDir, appSchemaPath } = getConfig();

  assert.strictEqual(migrationDir, 'example/migrations');
  assert.strictEqual(appSchemaPath, 'example/schema.json');
});
