import { ArrayOr, integer } from '../utils';

export type StringField = {
  /** @ignore */
  type: 'string';
  /** Minimum length of this string, inclusive. */
  minLength?: integer;
  /** Maximum length of this string, inclusive. */
  maxLength?: integer;
  /** `isUnique`: value of this string field will be unique across collections. */
  properties?: ArrayOr<StringFieldProperties>;
};

type StringFieldProperties = 'isUnique';
