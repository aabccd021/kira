import sinon from 'sinon';
import * as config from '../../src/config';
import * as migrationUtil from '../../src/migration/util';
import fs from 'fs';
import { generateMigrationFile } from '../../src/commands/generate-migration-file';
import { SemVer } from 'semver';
import * as assert from 'power-assert';

describe('generateMigrationFile', function () {
  it('generate migration file with correct date', function () {
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
    generateMigrationFile();

    // Assert
    assert.ok(getConfig.calledOnce);
    assert.deepStrictEqual(getConfig.firstCall.args, []);
    assert.ok(getLatestMigrationSchema.calledOnce);
    assert.deepStrictEqual(getLatestMigrationSchema.firstCall.args, []);
    assert.ok(mkdirSync.calledOnce);
    assert.deepStrictEqual(mkdirSync.firstCall.args, ['dummyMigrationDir', { recursive: true }]);
    assert.ok(writeFileSync.calledOnce);
    assert.deepStrictEqual(writeFileSync.firstCall.args, [
      'dummyMigrationDir/20210304050607.json',
      `{
  "$schema": "https://raw.githubusercontent.com/aabccd021/kira/master/migration-schema/v0.1.0.json",
  "migrations": []
}`,
    ]);

    clock.restore();
  });
});
