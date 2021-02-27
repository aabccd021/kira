import { expect } from 'chai';

import { schemaFieldToField } from '../../src/field/schema_field_to_field';
import { FieldId, SchemaCollections } from '../../src/util';

describe('schema_field_to_field', function () {
  describe('schemaFieldToField', function () {
    it('throw error if circular dependency detected', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        colX: {
          fields: {
            refXA: {
              fieldType: 'reference',
              referenceCollectionName: 'colY',
              referenceSyncedFieldNames: ['refYB'],
            },
          },
        },
        colY: {
          fields: {
            refYB: {
              fieldType: 'reference',
              referenceCollectionName: 'colX',
              referenceSyncedFieldNames: ['refXA'],
            },
          },
        },
      };
      const id: FieldId = ['colY', 'refYB'];

      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        'Circular dependency detected {colY,refYB},{colX,refXA}'
      );
    });
    it('throw error if field with id does not exists', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        colX: {
          fields: {
            refXA: {
              fieldType: 'reference',
              referenceCollectionName: 'colY',
              referenceSyncedFieldNames: ['refYB'],
            },
          },
        },
      };
      const id: FieldId = ['colY', 'refYB'];

      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        'Field colY.refYB does not exists'
      );
    });
  });

  describe('integerFieldOf', function () {
    it('throw error max smaller than min', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            age: {
              fieldType: 'integer',
              validation: {
                min: { value: 5 },
                max: { value: 3 },
              },
            },
          },
        },
      };
      const id: FieldId = ['user', 'age'];

      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        'max must be greater than min'
      );
    });
    it('returns correct integer field from schema', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            age: {
              fieldType: 'integer',
              validation: {
                min: { value: 4 },
                max: { value: 9 },
              },
            },
          },
        },
      };
      const id: FieldId = ['user', 'age'];

      // when
      const integerField = schemaFieldToField(schemaCollections, [], id);

      // then
      expect(integerField).to.deep.equal({
        fieldType: 'integer',
        validation: {
          min: { value: 4 },
          max: { value: 9 },
        },
      });
    });
  });

  describe('serverTimestampFieldOf', function () {
    it('returns correct field from schema', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            createdOn: {
              fieldType: 'serverTimestamp',
            },
          },
        },
      };
      const id: FieldId = ['user', 'createdOn'];

      // when
      const integerField = schemaFieldToField(schemaCollections, [], id);

      // then
      expect(integerField).to.deep.equal({ fieldType: 'serverTimestamp' });
    });
  });
});
