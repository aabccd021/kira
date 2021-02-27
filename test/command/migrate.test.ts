import { expect } from 'chai';
import sinon from 'sinon';

import { _toFieldIds } from '../../src/command/migrate';
import { SchemaCollection } from '../../src/util';

describe('migration', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('_toFieldEntries', function () {
    it('return schema field entries from collection pairs', async function () {
      // given
      const dummyCollectionPair: [string, SchemaCollection] = [
        'colY',
        { fields: { fieldB: { fieldType: 'string' } } },
      ];
      // when
      const resultSchemaFieldEntries = _toFieldIds(dummyCollectionPair);

      //then
      expect(resultSchemaFieldEntries).to.deep.equal([
        { collectionName: 'colY', fieldName: 'fieldB' },
      ]);
    });
  });
});
