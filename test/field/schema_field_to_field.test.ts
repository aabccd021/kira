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

  describe('countFieldOf', function () {
    it('throw error if reference field type is not `reference`', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            tweetCount: {
              fieldType: 'count',
              referenceCollectionName: 'tweet',
              referenceFieldName: 'user',
            },
          },
        },
        tweet: { fields: { user: { fieldType: 'string' } } },
      };
      const id: FieldId = ['user', 'tweetCount'];

      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        'Referenced field is not `reference` field'
      );
    });

    it('throw error if reference collection name is wrong', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            tweetCount: {
              fieldType: 'count',
              referenceCollectionName: 'tweet',
              referenceFieldName: 'user',
            },
          },
        },
        tweet: {
          fields: {
            user: {
              fieldType: 'reference',
              referenceCollectionName: 'kiraMasumoto',
            },
          },
        },
      };
      const id: FieldId = ['user', 'tweetCount'];

      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        'Invalid referenced collection'
      );
    });

    it('returns correct integer field from schema', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            tweetCount: {
              fieldType: 'count',
              referenceCollectionName: 'tweet',
              referenceFieldName: 'user',
            },
          },
        },
        tweet: {
          fields: {
            user: {
              fieldType: 'reference',
              referenceCollectionName: 'user',
            },
          },
        },
      };
      const id: FieldId = ['user', 'tweetCount'];

      // when
      const countField = schemaFieldToField(schemaCollections, [], id);

      // then
      expect(countField).to.deep.equal({
        fieldType: 'count',
        referenceCollectionName: 'tweet',
        referenceFieldName: 'user',
        referenceField: {
          fieldType: 'reference',
          referenceCollectionName: 'user',
          referenceSyncedFields: [],
        },
      });
    });
  });
  describe('integerFieldOf', function () {
    it('throw error if max smaller than min', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            age: {
              fieldType: 'integer',
              validation: { min: { value: 5 }, max: { value: 3 } },
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
              validation: { min: { value: 4 }, max: { value: 9 } },
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
        validation: { min: { value: 4 }, max: { value: 9 } },
      });
    });
  });

  describe('referenceFieldOf', function () {
    it('returns correct field from schema', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: { fields: { userName: { fieldType: 'string' } } },
        tweet: {
          fields: {
            owner: {
              fieldType: 'reference',
              referenceCollectionName: 'user',
              referenceSyncedFieldNames: ['userName'],
            },
          },
        },
      };
      const id: FieldId = ['tweet', 'owner'];

      // when
      const serverTimestampField = schemaFieldToField(schemaCollections, [], id);

      // then
      expect(serverTimestampField).to.deep.equal({
        fieldType: 'reference',
        referenceCollectionName: 'user',
        referenceSyncedFields: [{ fieldName: 'userName', field: { fieldType: 'string' } }],
      });
    });

    it('throw error if synced field is reference field', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: { fields: {} },
        kira: { fields: { masumoto: { fieldType: 'reference', referenceCollectionName: 'kira' } } },
        tweet: {
          fields: {
            owner: {
              fieldType: 'reference',
              referenceCollectionName: 'kira',
              referenceSyncedFieldNames: ['masumoto'],
            },
          },
        },
      };
      const id: FieldId = ['tweet', 'owner'];

      // when

      // then
      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        '"reference" field kira.masumoto not allowed on syncedFields'
      );
    });
  });

  describe('serverTimestampFieldOf', function () {
    it('returns correct field from schema', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: { fields: { createdOn: { fieldType: 'serverTimestamp' } } },
      };
      const id: FieldId = ['user', 'createdOn'];

      // when
      const serverTimestampField = schemaFieldToField(schemaCollections, [], id);

      // then
      expect(serverTimestampField).to.deep.equal({ fieldType: 'serverTimestamp' });
    });
  });

  describe('stringFieldOf', function () {
    it('returns correct field from schema', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            createdOn: {
              fieldType: 'string',
              validation: {
                minLength: { value: 2 },
                maxLength: { value: 8 },
              },
            },
          },
        },
      };
      const id: FieldId = ['user', 'createdOn'];

      // when
      const stringField = schemaFieldToField(schemaCollections, [], id);

      // then
      expect(stringField).to.deep.equal({
        fieldType: 'string',
        validation: {
          minLength: { value: 2 },
          maxLength: { value: 8 },
        },
      });
    });

    it('throw error if minLength smaller than 0', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            age: {
              fieldType: 'string',
              validation: { minLength: { value: -3 } },
            },
          },
        },
      };
      const id: FieldId = ['user', 'age'];

      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        'minLength must be greater than 0'
      );
    });

    it('throw error if maxLength smaller than 0', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            age: {
              fieldType: 'string',
              validation: { maxLength: { value: -5 } },
            },
          },
        },
      };
      const id: FieldId = ['user', 'age'];

      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        'maxLength must be greater than 0'
      );
    });

    it('throw error if maxLength smaller than minLength', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            age: {
              fieldType: 'string',
              validation: {
                minLength: { value: 5 },
                maxLength: { value: 3 },
              },
            },
          },
        },
      };
      const id: FieldId = ['user', 'age'];

      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        'maxLength must be greater than minLength'
      );
    });
  });

  describe('sumFieldof', function () {
    it('returns correct field from schema', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            likeSum: {
              fieldType: 'sum',
              referenceCollectionName: 'like',
              referenceFieldName: 'owner',
              sumFieldName: 'value',
            },
          },
        },
        like: {
          fields: {
            owner: {
              fieldType: 'reference',
              referenceCollectionName: 'user',
            },
            value: { fieldType: 'integer' },
          },
        },
      };
      const id: FieldId = ['user', 'likeSum'];

      // when
      const stringField = schemaFieldToField(schemaCollections, [], id);

      // then
      expect(stringField).to.deep.equal({
        fieldType: 'sum',
        referenceCollectionName: 'like',
        referenceFieldName: 'owner',
        sumFieldName: 'value',
        referenceField: {
          fieldType: 'reference',
          referenceCollectionName: 'user',
          referenceSyncedFields: [],
        },
        sumField: { fieldType: 'integer' },
      });
    });

    it('throw error if referenced field is not "reference" field', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            likeSum: {
              fieldType: 'sum',
              referenceCollectionName: 'like',
              referenceFieldName: 'owner',
              sumFieldName: 'value',
            },
          },
        },
        like: {
          fields: {
            owner: { fieldType: 'integer' },
            value: { fieldType: 'integer' },
          },
        },
      };
      const id: FieldId = ['user', 'likeSum'];

      // then
      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        `owner is not "reference" field`
      );
    });

    it('throw error if referenced field collection name is incorrect', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            likeSum: {
              fieldType: 'sum',
              referenceCollectionName: 'like',
              referenceFieldName: 'owner',
              sumFieldName: 'value',
            },
          },
        },
        like: {
          fields: {
            owner: {
              fieldType: 'reference',
              referenceCollectionName: 'tweet',
            },
            value: { fieldType: 'integer' },
          },
        },
      };
      const id: FieldId = ['user', 'likeSum'];

      // then
      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        `Invalid referenced collection name tweet`
      );
    });

    it('throw error if summed field is not integer', async function () {
      // given
      const schemaCollections: SchemaCollections = {
        user: {
          fields: {
            likeSum: {
              fieldType: 'sum',
              referenceCollectionName: 'like',
              referenceFieldName: 'owner',
              sumFieldName: 'value',
            },
          },
        },
        like: {
          fields: {
            owner: {
              fieldType: 'reference',
              referenceCollectionName: 'user',
            },
            value: { fieldType: 'string' },
          },
        },
      };
      const id: FieldId = ['user', 'likeSum'];

      // then
      expect(() => schemaFieldToField(schemaCollections, [], id)).to.throw(
        Error,
        `like.value is not "integer" field`
      );
    });
  });
});