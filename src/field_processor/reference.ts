import { chain, isUndefined, keys } from 'lodash';

import { Field, ReferenceField, ReferenceFieldMigration } from '../field';
import { Collections, FieldProcessor } from './_util';

export const _reference: FieldProcessor<ReferenceField, ReferenceFieldMigration> = {
  fieldOf,
  schemaOf,
  dependency: [],
};

function fieldOf(schemaField: ReferenceFieldMigration, collectionMap: Collections): ReferenceField {
  const { referenceCollectionName, referenceSyncedFields } = schemaField;
  const referenceCollection = collectionMap[referenceCollectionName];

  const newReferenceSyncedFields = chain(referenceSyncedFields)
    .map((referenceFieldName) => referenceCollection?.fields[referenceFieldName])
    .mapValues(toSyncedFields)
    .value();

  return { ...schemaField, referenceSyncedFields: newReferenceSyncedFields };
}

function toSyncedFields(referenceField: Field | undefined): Exclude<Field, ReferenceField> {
  if (isUndefined(referenceField)) throw Error(`Does not exists`);
  if (referenceField.fieldType === 'reference') throw Error(`ReferenceField not allowed`);
  return referenceField;
}

function schemaOf(field: ReferenceField): ReferenceFieldMigration {
  const { referenceSyncedFields } = field;
  return { ...field, referenceSyncedFields: keys(referenceSyncedFields) };
}
