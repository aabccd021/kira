import { expect } from 'chai';
import { Field } from '../src/field-type';
import {
  isBooleanField,
  isDateField,
  isDateTimeField,
  isFloatField,
  isIntField,
  isListField,
  isMapField,
  isReferenceField,
  isStringField,
} from '../src/field-type-guard';

describe('Field type guards', () => {
  it('has valid BooleanField type guard', () => {
    const booleanField: Field = { type: 'boolean' };
    const stringField: Field = { type: 'string' };
    expect(isBooleanField(booleanField)).to.be.true;
    expect(isBooleanField(stringField)).to.be.false;
  });

  it('has valid StringField type guard', () => {
    const booleanField: Field = { type: 'boolean' };
    const stringField: Field = { type: 'string' };
    expect(isStringField(stringField)).to.be.true;
    expect(isStringField(booleanField)).to.be.false;
  });

  it('has valid IntField type guard', () => {
    const intField: Field = { type: 'int' };
    const stringField: Field = { type: 'string' };
    expect(isIntField(intField)).to.be.true;
    expect(isIntField(stringField)).to.be.false;
  });

  it('has valid FloatField type guard', () => {
    const floatField: Field = { type: 'float' };
    const stringField: Field = { type: 'string' };
    expect(isFloatField(floatField)).to.be.true;
    expect(isFloatField(stringField)).to.be.false;
  });

  it('has valid DateField type guard', () => {
    const dateField: Field = { type: 'date' };
    const stringField: Field = { type: 'string' };
    expect(isDateField(dateField)).to.be.true;
    expect(isDateField(stringField)).to.be.false;
  });

  it('has valid DateTimeField type guard', () => {
    const dateTimeField: Field = { type: 'dateTime' };
    const stringField: Field = { type: 'string' };
    expect(isDateTimeField(dateTimeField)).to.be.true;
    expect(isDateTimeField(stringField)).to.be.false;
  });

  it('has valid ListField type guard', () => {
    const listField: Field = { type: 'list' };
    const stringField: Field = { type: 'string' };
    expect(isListField(listField)).to.be.true;
    expect(isListField(stringField)).to.be.false;
  });

  it('has valid MapField type guard', () => {
    const mapField: Field = { type: 'map' };
    const stringField: Field = { type: 'string' };
    expect(isMapField(mapField)).to.be.true;
    expect(isMapField(stringField)).to.be.false;
  });

  it('has valid ReferenceField type guard', () => {
    const referenceField: Field = { type: 'reference' };
    const stringField: Field = { type: 'string' };
    expect(isReferenceField(referenceField)).to.be.true;
    expect(isReferenceField(stringField)).to.be.false;
  });
});
