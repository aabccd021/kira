import { isUndefined } from 'lodash';

import { CountField, CountSchemaField } from '../field';
import { Collections, FieldProcessor } from './_util';

export const _count: FieldProcessor<CountField, CountSchemaField> = {
  fieldOf,
  schemaOf,
  dependencyOf: () => [],
};

function fieldOf(schemaField: CountSchemaField, collectionMap: Collections): CountField {
  const { referenceCollectionName, referenceFieldName } = schemaField;
  const referenceField = collectionMap[referenceCollectionName]?.fields[referenceFieldName];
  if (isUndefined(referenceField)) {
    const message = `Referenced field ${referenceFieldName} does not exists on collection ${referenceCollectionName}`;
    throw Error(message);
  }

  if (referenceField.fieldType !== 'reference') {
    throw Error(`Referenced field is not ReferenceField`);
  }

  return { ...schemaField, referenceField };
}

function schemaOf(field: CountField): CountSchemaField {
  return field;
}
