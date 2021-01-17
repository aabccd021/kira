import { expect } from 'chai';
import { helloWorld } from '../src';

describe('Hello world', () => {
  it('returns 2 if given 1', () => {
    const result = helloWorld(1);
    expect(result).to.equal(2);
  });
});
