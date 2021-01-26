import { ArrayOr } from '../utils';

export type ReferenceField = {
  /** @ignore */
  type: 'reference';
  /**
   * Name of collection of referenced document.
   */
  collection: string;
  /**
   * Name of fields to be synced.
   */
  syncedFields: ArrayOr<string>;
};
