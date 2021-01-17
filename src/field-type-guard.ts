import {
  Field,
  BooleanField,
  DateField,
  DateTimeField,
  FloatField,
  IntField,
  ListField,
  MapField,
  ReferenceField,
  StringField,
} from './field-type';

export function isBooleanField(field: Field): field is BooleanField {
  return (field as BooleanField).type === 'boolean';
}

export function isStringField(field: Field): field is StringField {
  return (field as StringField).type === 'string';
}

export function isIntField(field: Field): field is IntField {
  return (field as IntField).type === 'int';
}

export function isFloatField(field: Field): field is FloatField {
  return (field as FloatField).type === 'float';
}

export function isDateField(field: Field): field is DateField {
  return (field as DateField).type === 'date';
}

export function isDateTimeField(field: Field): field is DateTimeField {
  return (field as DateTimeField).type === 'dateTime';
}

export function isListField(field: Field): field is ListField {
  return (field as ListField).type === 'list';
}

export function isMapField(field: Field): field is MapField {
  return (field as MapField).type === 'map';
}

export function isReferenceField(field: Field): field is ReferenceField {
  return (field as ReferenceField).type === 'reference';
}
