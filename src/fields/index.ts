import { ServerTimestampField } from './server-timestamp';
import { ReferenceField } from './reference';
import { SumField } from './sum';
import { CountField } from './count';
import { StringField } from './string';
import { IntegerField } from './integer';
/**
 * Kira fields.
 *
 * Property `type` of a field is required, and must be a camelCase of it's name.
 *
 */
export type Fields = Readonly<
  | CountField
  | IntegerField
  | ReferenceField
  | ServerTimestampField
  | StringField
  | SumField
>;
