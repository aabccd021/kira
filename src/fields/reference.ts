import _ from 'lodash';

import { CollectionMap } from '../migration';
import { ArrayOr } from '../utils';
import { Field, FieldController } from '.';

export type SchemaReferenceField = {
  /** @ignore */
  type: 'reference';
  /**
   * Name of collection of referenced document.
   */
  referenceCollectionName: string;
  /**
   * Name of fields to be synced.
   */
  referenceSyncedFields: ArrayOr<string>;
};

export type ReferenceField = Omit<SchemaReferenceField, 'referenceSyncedFields'> & {
  referenceSyncedFields: { [fieldName: string]: SyncedField };
};
type SyncedField = Exclude<Field, ReferenceField>;

export const _reference: FieldController<SchemaReferenceField, ReferenceField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: SchemaReferenceField, collectionMap: CollectionMap): ReferenceField {
  const { referenceCollectionName, referenceSyncedFields } = schemaField;
  const referenceCollection = collectionMap[referenceCollectionName];
  const newReferenceSyncedFields = _(referenceSyncedFields)
    .flatMap((referenceFieldName) => referenceCollection?.fields[referenceFieldName])
    .mapValues(toSyncedFields)
    .value();
  return { ...schemaField, referenceSyncedFields: newReferenceSyncedFields };
}

function toSyncedFields(referenceField: Field | undefined): SyncedField {
  if (_.isUndefined(referenceField)) throw Error(`Does not exists`);
  if (referenceField.type === 'reference') throw Error(`ReferenceField not allowed`);
  return referenceField;
}

function schemaOf(field: ReferenceField): SchemaReferenceField {
  const { referenceSyncedFields } = field;
  return { ...field, referenceSyncedFields: _.keys(referenceSyncedFields) };
}
