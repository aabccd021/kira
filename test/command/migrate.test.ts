import { expect } from 'chai';
import sinon from 'sinon';

import {
  _assertNoCircularDependency,
  _byDependency,
  _processField,
  _toFieldEntries,
  SchemaFieldEntry,
} from '../../src/command/migrate';
import { Field } from '../../src/field';
import { Collections, FieldId, SchemaCollection } from '../../src/field_processor/_util';
import * as field_processor from '../../src/field_processor/mod';

describe('migration', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('_byDependency', function () {
    it('return -1 if a is dependency of b', async function () {
      // given

      //
      const aId = { collectionName: 'colX', fieldName: 'fieldA' };
      const a: SchemaFieldEntry = {
        id: aId,
        schemaField: { fieldType: 'string' },
      };
      const aDeps: FieldId[] = [];

      //
      const b: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldB' },
        schemaField: { fieldType: 'string' },
      };
      const bDeps = [aId];

      //
      const dependencyIdsOf = sinon
        .stub(field_processor, 'dependencyIdsOf')
        .onFirstCall()
        .returns(aDeps)
        .onSecondCall()
        .returns(bDeps);

      // when
      const compareResult = _byDependency(a, b);

      //then
      expect(dependencyIdsOf.calledTwice).to.be.true;
      expect(dependencyIdsOf.firstCall.calledWith(a.schemaField)).to.be.true;
      expect(dependencyIdsOf.secondCall.calledWith(b.schemaField)).to.be.true;
      expect(compareResult).to.equal(-1);
    });

    it('return 1 if b is dependency of a', async function () {
      // given

      //
      const bId = { collectionName: 'colX', fieldName: 'fieldB' };
      const b: SchemaFieldEntry = {
        id: bId,
        schemaField: { fieldType: 'string' },
      };
      const bDeps: FieldId[] = [];

      //
      const a: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldA' },
        schemaField: { fieldType: 'string' },
      };
      const aDeps = [bId];

      //
      const dependencyIdsOf = sinon
        .stub(field_processor, 'dependencyIdsOf')
        .onFirstCall()
        .returns(aDeps)
        .onSecondCall()
        .returns(bDeps);

      // when
      const compareResult = _byDependency(a, b);

      //then
      expect(dependencyIdsOf.calledTwice).to.be.true;
      expect(dependencyIdsOf.firstCall.calledWith(a.schemaField)).to.be.true;
      expect(dependencyIdsOf.secondCall.calledWith(b.schemaField)).to.be.true;
      expect(compareResult).to.equal(1);
    });

    it('return 1 if a has no dependency and b has one', async function () {
      // given

      //
      const a: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldA' },
        schemaField: { fieldType: 'string' },
      };
      const aDeps: FieldId[] = [];

      //
      const b: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldB' },
        schemaField: { fieldType: 'string' },
      };
      const bDeps: FieldId[] = [{ collectionName: 'colZ', fieldName: 'fieldY' }];

      //
      const dependencyIdsOf = sinon
        .stub(field_processor, 'dependencyIdsOf')
        .onFirstCall()
        .returns(aDeps)
        .onSecondCall()
        .returns(bDeps);

      // when
      const compareResult = _byDependency(a, b);

      //then
      expect(dependencyIdsOf.calledTwice).to.be.true;
      expect(dependencyIdsOf.firstCall.calledWith(a.schemaField)).to.be.true;
      expect(dependencyIdsOf.secondCall.calledWith(b.schemaField)).to.be.true;
      expect(compareResult).to.equal(1);
    });

    it('return -1 if b has no dependency and a has one', async function () {
      // given

      //
      const a: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldA' },
        schemaField: { fieldType: 'string' },
      };
      const aDeps: FieldId[] = [{ collectionName: 'colZ', fieldName: 'fieldY' }];

      //
      const b: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldB' },
        schemaField: { fieldType: 'string' },
      };
      const bDeps: FieldId[] = [];

      const dependencyIdsOf = sinon
        .stub(field_processor, 'dependencyIdsOf')
        .onFirstCall()
        .returns(aDeps)
        .onSecondCall()
        .returns(bDeps);

      // when
      const compareResult = _byDependency(a, b);

      //then
      expect(dependencyIdsOf.calledTwice).to.be.true;
      expect(dependencyIdsOf.firstCall.calledWith(a.schemaField)).to.be.true;
      expect(dependencyIdsOf.secondCall.calledWith(b.schemaField)).to.be.true;
      expect(compareResult).to.equal(-1);
    });

    it('return 0 if no dependency relation', async function () {
      // given

      //
      const a: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldA' },
        schemaField: { fieldType: 'string' },
      };
      const aDeps: FieldId[] = [];

      //
      const b: SchemaFieldEntry = {
        id: { collectionName: 'colX', fieldName: 'fieldB' },
        schemaField: { fieldType: 'string' },
      };
      const bDeps: FieldId[] = [];

      //
      const dependencyIdsOf = sinon
        .stub(field_processor, 'dependencyIdsOf')
        .onFirstCall()
        .returns(aDeps)
        .onSecondCall()
        .returns(bDeps);

      // when
      const compareResult = _byDependency(a, b);

      //then
      expect(dependencyIdsOf.calledTwice).to.be.true;
      expect(dependencyIdsOf.firstCall.calledWith(a.schemaField)).to.be.true;
      expect(dependencyIdsOf.secondCall.calledWith(b.schemaField)).to.be.true;
      expect(compareResult).to.equal(0);
    });
  });

  describe('_processField', function () {
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
      const newCollections = _processField(dummyCollections, dummySchemaField);

      //then
      expect(fieldOf.calledOnce).to.be.true;
      expect(fieldOf.firstCall.calledWith(dummySchemaField.schemaField, dummyCollections)).to.be
        .true;
      expect(newCollections).to.deep.equal({
        colX: { fields: { fieldB: { fieldType: 'string' } } },
      });
    });
  });

  describe('_toFieldEntries', function () {
    it('return schema field entries from collection pairs', async function () {
      // given
      const dummyCollectionPair: [string, SchemaCollection] = [
        'colY',
        { fields: { fieldB: { fieldType: 'string' } } },
      ];
      // when
      const resultSchemaFieldEntries = _toFieldEntries(dummyCollectionPair);

      //then
      expect(resultSchemaFieldEntries).to.deep.equal([
        {
          id: { collectionName: 'colY', fieldName: 'fieldB' },
          schemaField: { fieldType: 'string' },
        },
      ]);
    });
  });

  describe('_assertNoCircluarDependency', function () {
    it('does not throw error if has no circular dependencies', async function () {
      const dummySchemaFieldEntries: SchemaFieldEntry[] = [
        {
          id: {
            collectionName: 'colY',
            fieldName: 'stringP',
          },
          schemaField: {
            fieldType: 'string',
          },
        },
        {
          id: {
            collectionName: 'colX',
            fieldName: 'refXA',
          },
          schemaField: {
            fieldType: 'reference',
            referenceCollectionName: 'colY',
            referenceSyncedFields: ['stringP'],
          },
        },
      ];

      expect(() => _assertNoCircularDependency(dummySchemaFieldEntries)).to.not.throw();
    });

    it('throw error if has circular dependency', async function () {
      const dummySchemaFieldEntries: SchemaFieldEntry[] = [
        {
          id: {
            collectionName: 'colX',
            fieldName: 'refXA',
          },
          schemaField: {
            fieldType: 'reference',
            referenceCollectionName: 'colY',
            referenceSyncedFields: ['refYB'],
          },
        },
        {
          id: {
            collectionName: 'colY',
            fieldName: 'refYB',
          },
          schemaField: {
            fieldType: 'reference',
            referenceCollectionName: 'colX',
            referenceSyncedFields: ['refXA'],
          },
        },
      ];

      expect(() => _assertNoCircularDependency(dummySchemaFieldEntries)).to.throw(
        Error,
        `Circular dependency detected: [
  {
    "collectionName": "colX",
    "fieldName": "refXA"
  },
  {
    "collectionName": "colY",
    "fieldName": "refYB"
  }
]`
      );
    });
  });
});
