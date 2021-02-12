import assert from 'assert';

import { getConfig } from '../src/config';

test('can return config', function () {
  const { migrationDir, appSchemaPath } = getConfig();

  assert.strictEqual(migrationDir, 'example/migrations');
  assert.strictEqual(appSchemaPath, 'example/schema.json');
});
