import { Field, SchemaField } from '../field';
import { Collections, FieldId } from './_util';
import { _count } from './count';
import { _integer } from './integer';
import { _reference } from './reference';
import { _serverTimestamp } from './server_timestamp';
import { _string } from './string';
import { _sum } from './sum';

/**
 * Kira fields.
 *
 * Property `type` of a field is required, and must be a camelCase of it's name.
 *
 */
export function fieldOf(schemaField: SchemaField, collectionMap: Collections): Field {
  switch (schemaField.fieldType) {
    case 'count':
      return _count.fieldOf(schemaField, collectionMap);
    case 'integer':
      return _integer.fieldOf(schemaField, collectionMap);
    case 'reference':
      return _reference.fieldOf(schemaField, collectionMap);
    case 'serverTimestamp':
      return _serverTimestamp.fieldOf(schemaField, collectionMap);
    case 'string':
      return _string.fieldOf(schemaField, collectionMap);
    case 'sum':
      return _sum.fieldOf(schemaField, collectionMap);
  }
}

export function schemaOf(field: Field): SchemaField {
  switch (field.fieldType) {
    case 'count':
      return _count.schemaOf(field);
    case 'integer':
      return _integer.schemaOf(field);
    case 'reference':
      return _reference.schemaOf(field);
    case 'serverTimestamp':
      return _serverTimestamp.schemaOf(field);
    case 'string':
      return _string.schemaOf(field);
    case 'sum':
      return _sum.schemaOf(field);
  }
}

export function dependencyIdsOf(schemaField: SchemaField): FieldId[] {
  switch (schemaField.fieldType) {
    case 'count':
      return _count.dependencyOf(schemaField);
    case 'integer':
      return _integer.dependencyOf(schemaField);
    case 'reference':
      return _reference.dependencyOf(schemaField);
    case 'serverTimestamp':
      return _serverTimestamp.dependencyOf(schemaField);
    case 'string':
      return _string.dependencyOf(schemaField);
    case 'sum':
      return _sum.dependencyOf(schemaField);
  }
}
