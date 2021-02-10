import { expect } from 'chai';

import { getConfig } from '../src/config';

describe('getConfig', function () {
  it('can return config', function () {
    const { migrationDir, appSchemaPath } = getConfig();

    expect(migrationDir).to.equal('example/migrations');
    expect(appSchemaPath).to.equal('example/schema.json');
  });
});
