import { isUndefined } from 'lodash';

import { SumField, SumSchemaField } from '../field';
import { Collections, FieldProcessor } from './_util';

export const _sum: FieldProcessor<SumField, SumSchemaField> = {
  fieldOf,
  schemaOf,
  dependencyOf: () => [],
};

function fieldOf(schemaField: SumSchemaField, collectionMap: Collections): SumField {
  const { referenceCollectionName, referenceFieldName, sumFieldName } = schemaField;
  const referenceCollection = collectionMap[referenceCollectionName];
  const referenceField = referenceCollection?.fields[referenceFieldName];
  const sumField = referenceCollection?.fields[sumFieldName];

  if (isUndefined(referenceField)) {
    throw Error(
      `Referenced field ${referenceFieldName} does not exists on collection ${referenceCollectionName}`
    );
  }
  if (referenceField.fieldType !== 'reference') {
    throw Error(`Referenced field ${referenceFieldName} is not ReferenceField`);
  }
  if (isUndefined(sumField)) {
    const message = `Referenced field ${referenceFieldName} does not exists on collection ${referenceCollectionName}`;
    throw Error(message);
  }
  if (sumField.fieldType !== 'integer') {
    throw Error(`Sum field ${sumFieldName} is not Integer Field`);
  }

  return { ...schemaField, referenceField, sumField };
}

function schemaOf(field: SumField): SumSchemaField {
  return field;
}
