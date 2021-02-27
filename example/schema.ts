import { KiraSchema } from './../src/schema';

const schema: KiraSchema = {
  version: '0.1.0',
  collections: {
    colX: {
      fields: {
        refXA: {
          fieldType: 'reference',
          referenceCollectionName: 'colY',
          referenceSyncedFields: ['refYB'],
        },
      },
    },
    colY: {
      fields: {
        refYB: {
          fieldType: 'reference',
          referenceCollectionName: 'colX',
          referenceSyncedFields: ['refXA'],
        },
      },
    },
  },
};

export default schema;
