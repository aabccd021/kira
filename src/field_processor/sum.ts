import _ from 'lodash';

import { SumField, SumSchemaField } from '../field';
import { CollectionMap, FieldProcessor } from './_util';

export const _sum: FieldProcessor<SumSchemaField, SumField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: SumSchemaField, collectionMap: CollectionMap): SumField {
  const { referenceCollectionName, referenceFieldName, sumFieldName } = schemaField;
  const referenceCollection = collectionMap[referenceCollectionName];
  const referenceField = referenceCollection?.fields[referenceFieldName];
  const sumField = referenceCollection?.fields[sumFieldName];

  if (_.isUndefined(referenceField)) {
    throw Error(
      `Referenced field ${referenceFieldName} does not exists on collection ${referenceCollectionName}`
    );
  }
  if (referenceField.type !== 'reference') {
    throw Error(`Referenced field ${referenceFieldName} is not ReferenceField`);
  }
  if (_.isUndefined(sumField)) {
    const message = `Referenced field ${referenceFieldName} does not exists on collection ${referenceCollectionName}`;
    throw Error(message);
  }
  if (sumField.type !== 'integer') {
    throw Error(`Sum field ${sumFieldName} is not Integer Field`);
  }

  return { ...schemaField, referenceField, sumField };
}

function schemaOf(field: SumField): SumSchemaField {
  return field;
}
