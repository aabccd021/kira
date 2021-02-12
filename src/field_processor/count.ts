import _ from 'lodash';

import { CountField, CountSchemaField } from '../field';
import { CollectionMap, FieldProcessor } from './_util';

export const _count: FieldProcessor<CountSchemaField, CountField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: CountSchemaField, collectionMap: CollectionMap): CountField {
  const { referenceCollectionName, referenceFieldName } = schemaField;
  const referenceField = collectionMap[referenceCollectionName]?.fields[referenceFieldName];
  if (_.isUndefined(referenceField)) {
    const message = `Referenced field ${referenceFieldName} does not exists on collection ${referenceCollectionName}`;
    throw Error(message);
  }

  if (referenceField.type !== 'reference') throw Error(`Referenced field is not ReferenceField`);

  return { ...schemaField, referenceField };
}

function schemaOf(field: CountField): CountSchemaField {
  return field;
}
