import { chain, find, isUndefined } from 'lodash';

import { FieldId, SchemaCollections } from '../util';
import {
  CountField,
  Field,
  IntegerField,
  ReferenceField,
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
  if (find(trace, id)) throw Error('Cicular Dependency Detected');

  const { collectionName, fieldName } = id;
  const schemaField = collections[collectionName]?.fields[fieldName];

  if (isUndefined(schemaField)) throw Error(`Field ${collectionName}.${fieldName} doen't exists`);

  const newTrace = [...trace, id];
  const fieldGetter: FieldGetter = (_id: FieldId) => schemaFieldToField(collections, newTrace, _id);

  switch (schemaField.fieldType) {
    case 'count':
      return countFieldOf(schemaField, fieldGetter);
    case 'integer':
      return integerFieldOf(schemaField, fieldGetter);
    case 'reference':
      return referenceFieldOf(schemaField, fieldGetter);
    case 'serverTimestamp':
      return serverTimestampFieldOf(schemaField, fieldGetter);
    case 'string':
      return stringFieldOf(schemaField, fieldGetter);
    case 'sum':
      return sumFieldOf(schemaField, fieldGetter);
  }
}

type FieldGetter = (fieldId: FieldId) => Field;

/**
 * Count
 */
function countFieldOf(schemaField: CountSchemaField, fieldOfId: FieldGetter): CountField {
  const { referenceCollectionName, referenceFieldName } = schemaField;
  const referenceField = fieldOfId({
    collectionName: referenceCollectionName,
    fieldName: referenceFieldName,
  });
  if (isUndefined(referenceField)) {
    throw Error(
      `Referenced field ${referenceFieldName} does not exists on collection ${referenceCollectionName}`
    );
  }

  if (referenceField.fieldType !== 'reference') {
    throw Error(`Referenced field is not ReferenceField`);
  }

  return { ...schemaField, referenceField };
}

/**
 * Integer
 */
function integerFieldOf(schemaField: IntegerSchemaField, _: FieldGetter): IntegerField {
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
function referenceFieldOf(schemaField: ReferenceSchemaField, toField: FieldGetter): ReferenceField {
  const { referenceCollectionName, referenceSyncedFieldNames } = schemaField;

  const referenceSyncedFields = chain(referenceSyncedFieldNames)
    .map<FieldId>((fieldName) => ({ collectionName: referenceCollectionName, fieldName }))
    .map(toField)
    .mapValues(toSyncedFields)
    .value();

  return { ...schemaField, referenceSyncedFields };
}

function toSyncedFields(referenceField: Field | undefined): Exclude<Field, ReferenceField> {
  if (isUndefined(referenceField)) throw Error(`Does not exists`);
  if (referenceField.fieldType === 'reference') throw Error(`ReferenceField not allowed`);
  return referenceField;
}

function serverTimestampFieldOf(
  schemaField: ServerTimestampSchemaField,
  _: FieldGetter
): ServerTimestampField {
  return schemaField;
}

/**
 * String
 */
function stringFieldOf(schemaField: StringSchemaField, _: FieldGetter): StringField {
  const { validation } = schemaField;

  const minLengthValue = validation?.minLength?.value;
  const maxLengthValue = validation?.maxLength?.value;

  if (!isUndefined(minLengthValue)) {
    if (minLengthValue === 0) throw Error('minLength 0 does not need to be specified');
    if (minLengthValue < 0) {
      throw Error(`minLength must be greater than 0, given ${minLengthValue}`);
    }
  }
  if (!isUndefined(maxLengthValue) && maxLengthValue <= 0) {
    throw Error(`max must be greater than 0, given ${maxLengthValue}`);
  }
  if (
    !isUndefined(minLengthValue) &&
    !isUndefined(maxLengthValue) &&
    maxLengthValue < minLengthValue
  ) {
    throw Error(`maxLength must be greater than minLength`);
  }

  return schemaField;
}

/**
 * Sum
 */
function sumFieldOf(schemaField: SumSchemaField, fieldOfId: FieldGetter): SumField {
  const { referenceCollectionName, referenceFieldName, sumFieldName } = schemaField;

  const referenceField = fieldOfId({
    collectionName: referenceCollectionName,
    fieldName: referenceFieldName,
  });
  const sumField = fieldOfId({
    collectionName: referenceCollectionName,
    fieldName: sumFieldName,
  });

  if (referenceField.fieldType !== 'reference') {
    throw Error(`Referenced field ${referenceFieldName} is not ReferenceField`);
  }

  if (sumField.fieldType !== 'integer') {
    throw Error(`Sum field ${sumFieldName} is not Integer Field`);
  }

  return { ...schemaField, referenceField, sumField };
}
