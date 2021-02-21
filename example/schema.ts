import { KiraSchema } from './../src/command/migrate';
const schema: KiraSchema = {
  version: '0.1.0',
  collections: {
    users: {
      fields: {
        userName: {
          fieldType: 'string',
        },
      },
    },
  },
};

export default schema;
