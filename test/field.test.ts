import { Field } from '../src/field-type';

describe('Fields', () => {
  it('has type property', () => {
    const field: Field = { type: 'boolean' };
    field.type;
  });
});
