import { integer } from '../utils';

export type IntegerField = {
  /** @ignore */
  type: 'int';
  /** Minimum value of this integer, inclusive. */
  min?: integer;
  /** Maximum value of this integer, inclusive. */
  max?: integer;
  /** This document will be deleted if this integer equals this value. */
  deleteDocWhen?: integer;
};
