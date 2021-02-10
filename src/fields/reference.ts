import { flatten, fromPairs, isNil, keys } from 'lodash';
import { FieldController, Field } from '../field';
import { CollectionMap } from '../migration/migration';
import { ArrayOr } from '../utils';

export type SchemaReferenceField = {
  /** @ignore */
  readonly type: 'reference';
  /**
   * Name of collection of referenced document.
   * @minLength 1
   */
  readonly referenceCollectionName: string;
  /**
   * Name of fields to be synced.
   * @minLength 1
   */
  readonly referenceSyncedFields: ArrayOr<string>;
};

export type ReferenceField = Omit<SchemaReferenceField, 'referenceSyncedFields'> & {
  readonly referenceSyncedFields: { readonly [fieldName: string]: Exclude<Field, ReferenceField> };
};

export const referenceController: FieldController<SchemaReferenceField, ReferenceField> = {
  schema2Field,
  field2Schema,
};

function schema2Field(
  schemaField: SchemaReferenceField,
  collectionMap: CollectionMap
): ReferenceField {
  const { referenceCollectionName, referenceSyncedFields } = schemaField;
  const referenceCollection = collectionMap[referenceCollectionName];
  const newReferenceSyncedFieldsPairs = flatten(referenceSyncedFields).map((referenceFieldName) => {
    const referenceField = referenceCollection?.fields[referenceFieldName];
    const trace = `{collection: ${referenceCollectionName}, field: ${referenceFieldName}}`;
    if (isNil(referenceField)) throw Error(`Does not exists: ${trace}`);
    if (referenceField.type === 'reference') throw Error(`ReferenceField not allowed: ${trace}`);
    return [referenceFieldName, referenceField];
  });
  const newReferenceSyncedFields = fromPairs(newReferenceSyncedFieldsPairs);
  return { ...schemaField, referenceSyncedFields: newReferenceSyncedFields };
}

function field2Schema(field: ReferenceField): SchemaReferenceField {
  const { referenceSyncedFields } = field;
  const newReferenceSyncedFields = keys(referenceSyncedFields);
  return { ...field, referenceSyncedFields: newReferenceSyncedFields };
}
