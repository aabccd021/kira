import { curry, isEqual, isUndefined, map, some } from 'lodash';

import { FieldId, SchemaCollections } from '../util';
import {
  CountField,
  Field,
  IntegerField,
  ReferenceField,
  ReferenceSyncedField,
  ReferenceSyncedFields,
  ServerTimestampField,
  StringField,
  SumField,
} from './field';
import {
  CountSchemaField,
  IntegerSchemaField,
  ReferenceSchemaField,
  ServerTimestampSchemaField,
  StringSchemaField,
  SumSchemaField,
} from './schema_field';

export function schemaFieldToField(
  collections: SchemaCollections,
  trace: FieldId[],
  id: FieldId
): Field {
  const traceIncludesId = some(trace, (_id) => isEqual(_id, id));
  if (traceIncludesId) throw Error(`Circular dependency detected ${map(trace, (t) => `{${t}}`)}`);

  const [collectionName, fieldName] = id;
  const schemaField = collections[collectionName]?.fields[fieldName];

  if (isUndefined(schemaField)) throw Error(`Field ${collectionName}.${fieldName} does not exists`);

  const newTrace = [...trace, id];
  const fieldGetter: FieldGetter = (_id: FieldId) => schemaFieldToField(collections, newTrace, _id);

  switch (schemaField.fieldType) {
    case 'count':
      return countFieldOf(schemaField, id, fieldGetter);
    case 'integer':
      return integerFieldOf(schemaField);
    case 'reference':
      return referenceFieldOf(schemaField, fieldGetter);
    case 'serverTimestamp':
      return serverTimestampFieldOf(schemaField);
    case 'string':
      return stringFieldOf(schemaField);
    case 'sum':
      return sumFieldOf(schemaField, id, fieldGetter);
  }
}

type FieldGetter = (fieldId: FieldId) => Field;

/**
 * Count
 */
function countFieldOf(
  schemaField: CountSchemaField,
  id: FieldId,
  fieldOfId: FieldGetter
): CountField {
  const [collectionName] = id;
  const { referenceCollectionName, referenceFieldName } = schemaField;
  const referenceField = fieldOfId([referenceCollectionName, referenceFieldName]);

  if (referenceField.fieldType !== 'reference') {
    throw Error('Referenced field is not `reference` field');
  }

  if (referenceField.referenceCollectionName !== collectionName) {
    throw Error(`Invalid referenced collection`);
  }
  return { fieldType: 'count', referenceCollectionName, referenceFieldName, referenceField };
}

/**
 * Integer
 */
function integerFieldOf(schemaField: IntegerSchemaField): IntegerField {
  const { validation } = schemaField;

  const minValue = validation?.min?.value;
  const maxValue = validation?.max?.value;

  if (!isUndefined(minValue) && !isUndefined(maxValue) && maxValue < minValue) {
    throw Error('max must be greater than min');
  }

  return schemaField;
}

/**
 * Reference
 */
function referenceFieldOf(
  schemaField: ReferenceSchemaField,
  fieldOfId: FieldGetter
): ReferenceField {
  const { referenceCollectionName, referenceSyncedFieldNames } = schemaField;

  const referenceSyncedFields: ReferenceSyncedFields = map(
    referenceSyncedFieldNames,
    toSyncedFieldWith(referenceCollectionName, fieldOfId)
  );

  return { fieldType: 'reference', referenceSyncedFields, referenceCollectionName };
}

const toSyncedFieldWith = curry(_toSyncedField);

function _toSyncedField(
  referenceCollectionName: string,
  fieldOfId: FieldGetter,
  referenceFieldName: string
): { fieldName: string; field: ReferenceSyncedField } {
  const referenceField = fieldOfId([referenceCollectionName, referenceFieldName]);
  if (referenceField.fieldType === 'reference') {
    throw Error(
      `"reference" field ${referenceCollectionName}.${referenceFieldName} not allowed on syncedFields`
    );
  }
  return { fieldName: referenceFieldName, field: referenceField };
}

/**
 * ServerTimestamp
 */
function serverTimestampFieldOf(schemaField: ServerTimestampSchemaField): ServerTimestampField {
  return schemaField;
}

/**
 * String
 */
function stringFieldOf(schemaField: StringSchemaField): StringField {
  const { validation } = schemaField;

  const minLengthValue = validation?.minLength?.value;
  const maxLengthValue = validation?.maxLength?.value;

  if (!isUndefined(minLengthValue) && minLengthValue < 0) {
    throw Error('minLength must be greater than 0');
  }

  if (!isUndefined(maxLengthValue) && maxLengthValue <= 0) {
    throw Error(`maxLength must be greater than 0`);
  }

  if (
    !isUndefined(minLengthValue) &&
    !isUndefined(maxLengthValue) &&
    maxLengthValue < minLengthValue
  ) {
    throw Error('maxLength must be greater than minLength');
  }

  return schemaField;
}

/**
 * Sum
 */
function sumFieldOf(schemaField: SumSchemaField, id: FieldId, fieldOfId: FieldGetter): SumField {
  const [collectionName] = id;
  const { referenceCollectionName, referenceFieldName, sumFieldName } = schemaField;

  const referenceField = fieldOfId([referenceCollectionName, referenceFieldName]);
  const sumField = fieldOfId([referenceCollectionName, sumFieldName]);

  if (referenceField.fieldType !== 'reference') {
    throw Error(`${referenceFieldName} is not "reference" field`);
  }

  if (referenceField.referenceCollectionName !== collectionName) {
    throw Error(`Invalid referenced collection name ${referenceField.referenceCollectionName}`);
  }

  if (sumField.fieldType !== 'integer') {
    throw Error(`${referenceCollectionName}.${sumFieldName} is not "integer" field`);
  }

  return {
    fieldType: 'sum',
    referenceFieldName,
    referenceField,
    referenceCollectionName,
    sumFieldName,
    sumField,
  };
}
