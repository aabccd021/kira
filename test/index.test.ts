import { notStrictEqual, strictEqual } from 'assert';
import { helloWorld } from '../src/index';

describe('helloWorld', () => {
  it('should return 2', () => {
    const result = helloWorld(1);
    strictEqual(result, 2);
  });
  it('should not return 3', () => {
    const result = helloWorld(1);
    notStrictEqual(result, 3);
  });
});
