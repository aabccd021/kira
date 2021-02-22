import { expect } from 'chai';
import rewire from 'rewire';
import sinon from 'sinon';

import { SchemaFieldEntry } from '../../src/command/migrate';
import { Field } from '../../src/field';
import { Collections, SchemaCollection } from '../../src/field_processor/_util';
import * as field_processor from '../../src/field_processor/mod';

const migrate = rewire('../../src/command/migrate');
const byDependency = migrate.__get__('byDependency');
const processField = migrate.__get__('processField');
const toFieldEntries = migrate.__get__('toFieldEntries');

describe('migration', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('byDependency', function () {
    it('return -1 if a is dependency of b', async function () {
      // given
      const aId = { collectionName: 'colX', fieldName: 'fieldA' };
      const a: SchemaFieldEntry = {
        id: aId,
        schemaField: { fieldType: 'string' },
      };
      const b: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldB' },
        schemaField: { fieldType: 'string' },
      };
      const dependencyIdsOf = sinon
        .stub(field_processor, 'dependencyIdsOf')
        .onFirstCall()
        .returns([])
        .onSecondCall()
        .returns([aId]);

      // when
      const compareResult = byDependency(a, b);

      //then
      expect(dependencyIdsOf.calledTwice).to.be.true;
      expect(dependencyIdsOf.firstCall.calledWith(a.schemaField)).to.be.true;
      expect(dependencyIdsOf.secondCall.calledWith(b.schemaField)).to.be.true;
      expect(compareResult).to.equal(-1);
    });

    it('return 1 if b is dependency of a', async function () {
      // given
      const a: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldA' },
        schemaField: { fieldType: 'string' },
      };
      const bId = { collectionName: 'colX', fieldName: 'fieldB' };
      const b: SchemaFieldEntry = {
        id: bId,
        schemaField: { fieldType: 'string' },
      };
      const dependencyIdsOf = sinon
        .stub(field_processor, 'dependencyIdsOf')
        .onFirstCall()
        .returns([bId])
        .onSecondCall()
        .returns([]);

      // when
      const compareResult = byDependency(a, b);

      //then
      expect(dependencyIdsOf.calledTwice).to.be.true;
      expect(dependencyIdsOf.firstCall.calledWith(a.schemaField)).to.be.true;
      expect(dependencyIdsOf.secondCall.calledWith(b.schemaField)).to.be.true;
      expect(compareResult).to.equal(1);
    });

    it('return 0 if no dependency relation', async function () {
      // given
      const a: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldA' },
        schemaField: { fieldType: 'string' },
      };
      const b: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldB' },
        schemaField: { fieldType: 'string' },
      };
      const dependencyIdsOf = sinon
        .stub(field_processor, 'dependencyIdsOf')
        .onFirstCall()
        .returns([])
        .onSecondCall()
        .returns([]);

      // when
      const compareResult = byDependency(a, b);

      //then
      expect(dependencyIdsOf.calledTwice).to.be.true;
      expect(dependencyIdsOf.firstCall.calledWith(a.schemaField)).to.be.true;
      expect(dependencyIdsOf.secondCall.calledWith(b.schemaField)).to.be.true;
      expect(compareResult).to.equal(0);
    });
  });

  describe('processField', function () {
    it('return processed Collections', async function () {
      // given
      const dummySchemaField: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldB' },
        schemaField: { fieldType: 'string' },
      };
      const dummyField: Field = {
        fieldType: 'string',
      };
      const fieldOf = sinon.stub(field_processor, 'fieldOf').onFirstCall().returns(dummyField);
      const dummyCollections: Collections = {};

      // when
      const newCollections = processField(dummyCollections, dummySchemaField);

      //then
      expect(fieldOf.calledOnce).to.be.true;
      expect(fieldOf.firstCall.calledWith(dummySchemaField.schemaField, dummyCollections)).to.be
        .true;
      expect(newCollections).to.deep.equal({
        colX: { fields: { fieldB: { fieldType: 'string' } } },
      });
    });
  });

  describe('toFieldEntries', function () {
    it('return schema field entries from collection pairs', async function () {
      // given
      const dummyCollectionPair: [string, SchemaCollection] = [
        'colY',
        { fields: { fieldB: { fieldType: 'string' } } },
      ];
      // when
      const resultSchemaFieldEntries = toFieldEntries(dummyCollectionPair);

      //then
      expect(resultSchemaFieldEntries).to.deep.equal([
        {
          id: { collectionName: 'colY', fieldName: 'fieldB' },
          schemaField: { fieldType: 'string' },
        },
      ]);
    });
  });
});
