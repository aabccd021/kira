import _ from 'lodash';

import { Field, ReferenceField, ReferenceSchemaField } from '../field';
import { CollectionMap, FieldProcessor } from './_util';

export const _reference: FieldProcessor<ReferenceSchemaField, ReferenceField> = {
  fieldOf,
  schemaOf,
};

function fieldOf(schemaField: ReferenceSchemaField, collectionMap: CollectionMap): ReferenceField {
  const { referenceCollectionName, referenceSyncedFields } = schemaField;
  const referenceCollection = collectionMap[referenceCollectionName];
  const newReferenceSyncedFields = _(referenceSyncedFields)
    .flatMap((referenceFieldName) => referenceCollection?.fields[referenceFieldName])
    .mapValues(toSyncedFields)
    .value();
  return { ...schemaField, referenceSyncedFields: newReferenceSyncedFields };
}

function toSyncedFields(referenceField: Field | undefined): Exclude<Field, ReferenceField> {
  if (_.isUndefined(referenceField)) throw Error(`Does not exists`);
  if (referenceField.type === 'reference') throw Error(`ReferenceField not allowed`);
  return referenceField;
}

function schemaOf(field: ReferenceField): ReferenceSchemaField {
  const { referenceSyncedFields } = field;
  return { ...field, referenceSyncedFields: _.keys(referenceSyncedFields) };
}
