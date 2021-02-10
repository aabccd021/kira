import _ from 'lodash';

import { CollectionMap } from '../migration';
import { FieldController } from '.';
import { ReferenceField } from './reference';

export type SchemaCountField = {
  /** @ignore */
  type: 'count';
  /**
   * Name of collection of counted document, the collection must have reference to collection of
   * this document.
   */
  referenceCollectionName: string;
  /**
   * Name of {@link ReferenceField} of counted document, only document that reference document of
   * this field will be counted.
   */
  referenceFieldName: string;
};

export type CountField = SchemaCountField & {
  referenceField: ReferenceField;
};

export const _count: FieldController<SchemaCountField, CountField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: SchemaCountField, collectionMap: CollectionMap): CountField {
  const { referenceCollectionName, referenceFieldName } = schemaField;
  const referenceField = collectionMap[referenceCollectionName]?.fields[referenceFieldName];
  if (_.isUndefined(referenceField)) {
    const message = `Referenced field ${referenceFieldName} does not exists on collection ${referenceCollectionName}`;
    throw Error(message);
  }

  if (referenceField.type !== 'reference') throw Error(`Referenced field is not ReferenceField`);

  return { ...schemaField, referenceField };
}

function schemaOf(field: CountField): SchemaCountField {
  return field;
}
