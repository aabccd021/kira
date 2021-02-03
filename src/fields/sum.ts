import { IntegerField } from './integer';
import { CollectionMap } from '../migration/migration';
import { ReferenceField } from './reference';
import { FieldController } from '../field';
import { isNil } from 'lodash';
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
   * Name of field to be summed. The field must be {@link SumField}.
   */
  sumFieldName: string;
};

export type SumField = SchemaSumField & {
  referenceField: ReferenceField;
  sumField: IntegerField;
};

export const sumController: FieldController<SchemaSumField, SumField> = {
  schema2Field,
  field2Schema,
};

function schema2Field(schemaField: SchemaSumField, collectionMap: CollectionMap): SumField {
  const { referenceCollectionName, referenceFieldName, sumFieldName } = schemaField;
  const referenceCollection = collectionMap[referenceCollectionName];
  const referenceField = referenceCollection?.fields[referenceFieldName];
  const sumField = referenceCollection?.fields[sumFieldName];

  if (isNil(referenceField)) {
    throw Error(
      `Referenced field ${referenceFieldName} does not exists` +
        ` on collection ${referenceCollectionName}`
    );
  }
  if (referenceField.type !== 'reference') {
    throw Error(`Referenced field ${referenceFieldName} is not ReferenceField`);
  }

  if (isNil(sumField)) {
    throw Error(
      `Referenced field ${referenceFieldName} does not exists` +
        ` on collection ${referenceCollectionName}`
    );
  }
  if (sumField.type !== 'integer') {
    throw Error(`Sum field ${sumFieldName} is not Integer Field`);
  }

  return { ...schemaField, referenceField, sumField };
}

function field2Schema(field: SumField): SchemaSumField {
  return field;
}
