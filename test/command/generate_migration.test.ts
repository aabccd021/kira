import assert from 'assert';
import fs from 'fs';
import { SemVer } from 'semver';
import sinon from 'sinon';

import { handleGenerateMigrationCommand } from '../../src/command/generate_migration';
import * as config from '../../src/config';
import * as migrationUtil from '../../src/migration_schema';

test('can generate empty migration file', function () {
  // Arrange
  const month = 3;
  const clock = sinon.useFakeTimers(Date.UTC(2021, month - 1, 4, 5, 6, 7));

  const writeFileSync = sinon.stub(fs, 'writeFileSync');
  const mkdirSync = sinon.stub(fs, 'mkdirSync');

  const getConfig = sinon.stub(config, 'getConfig').withArgs().returns({
    migrationDir: 'dummyMigrationDir',
    appSchemaPath: 'dummyAppSchemapath',
  });

  const getLatestMigrationSchema = sinon
    .stub(migrationUtil, 'getLatestMigrationSchema')
    .withArgs()
    .returns({
      schema: undefined,
      version: new SemVer('0.1.0'),
    });

  // Act
  handleGenerateMigrationCommand();

  // Assert
  assert.ok(getConfig.calledOnce);
  assert.strictEqual(getConfig.calledTwice, false);
  assert.deepStrictEqual(getConfig.firstCall.args, []);

  assert.ok(getLatestMigrationSchema.calledOnce);
  assert.strictEqual(getLatestMigrationSchema.calledTwice, false);
  assert.deepStrictEqual(getLatestMigrationSchema.firstCall.args, []);

  assert.ok(mkdirSync.calledOnce);
  assert.strictEqual(mkdirSync.calledTwice, false);
  assert.deepStrictEqual(mkdirSync.firstCall.args, ['dummyMigrationDir', { recursive: true }]);

  assert.ok(writeFileSync.calledOnce);
  assert.strictEqual(writeFileSync.calledTwice, false);
  assert.deepStrictEqual(writeFileSync.firstCall.args, [
    'dummyMigrationDir/20210304050607.json',
    `{
  "$schema": "https://raw.githubusercontent.com/aabccd021/kira/master/migration-schema/v0.1.0.json",
  "migrations": []
}`,
  ]);

  clock.restore();
  sinon.restore();
});
