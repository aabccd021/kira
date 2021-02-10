import { isNil } from 'lodash';
import { FieldController } from '../field';
import { CollectionMap } from '../migration/migration';
import { ReferenceField } from './reference';

export type SchemaCountField = {
  /** @ignore */
  readonly type: 'count';
  /**
   * Name of collection of counted document, the collection must have reference to collection of
   * this document.
   * @minLength 1
   */
  readonly referenceCollectionName: string;
  /**
   * Name of {@link ReferenceField} of counted document, only document that reference document of
   * this field will be counted.
   * @minLength 1
   */
  readonly referenceFieldName: string;
};

export type CountField = SchemaCountField & {
  readonly referenceField: ReferenceField;
};

export const countController: FieldController<SchemaCountField, CountField> = {
  schema2Field,
  field2Schema,
};

function schema2Field(schemaField: SchemaCountField, collectionMap: CollectionMap): CountField {
  const { referenceCollectionName, referenceFieldName } = schemaField;
  const referenceField = collectionMap[referenceCollectionName]?.fields[referenceFieldName];
  if (isNil(referenceField)) {
    throw Error(
      `Referenced field ${referenceFieldName} does not exists` +
        ` on collection ${referenceCollectionName}`
    );
  }
  if (referenceField.type !== 'reference') throw Error(`Referenced field is not ReferenceField`);

  return { ...schemaField, referenceField };
}

function field2Schema(field: CountField): SchemaCountField {
  return field;
}
