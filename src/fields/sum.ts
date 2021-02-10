import _ from 'lodash';

import { CollectionMap } from '../migration';
import { FieldController } from '.';
import { IntegerField } from './integer';
import { ReferenceField } from './reference';
/** Sum value of certain field of document which refers to this document */
export type SchemaSumField = {
  /** @ignore */
  type: 'sum';
  /**
   * Name of collection of document of summed field, the collection must have reference to
   * collection of this document.
   */
  referenceCollectionName: string;
  /**
   * Name of {@link ReferenceField} of document of summed field, only field of document that
   * reference this document will be summed.
   */
  referenceFieldName: string;
  /**
   * Name of field to be summed. The field must be {@link IntegerField}.
   */
  sumFieldName: string;
};

export type SumField = SchemaSumField & {
  referenceField: ReferenceField;
  sumField: IntegerField;
};

export const _sum: FieldController<SchemaSumField, SumField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: SchemaSumField, collectionMap: CollectionMap): SumField {
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

function schemaOf(field: SumField): SchemaSumField {
  return field;
}
