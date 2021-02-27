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
});
