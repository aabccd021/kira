import { chain, curry } from 'lodash';

import { Field } from '../field/field';
import { schemaFieldToField } from '../field/schema_field_to_field';
import { loadSchemaOnPath } from '../schema';
import { FieldId, SchemaCollection } from '../util';

export async function migrate(): Promise<void> {
  const schemaPath = './../example/schema';
  const schema = await loadSchemaOnPath(schemaPath);
  const fields: Field[] = chain(schema.collections)
    .toPairs()
    .flatMap<FieldId>(_toFieldIds)
    .map(toFieldWith(schema.collections, []))
    .value();
  console.log(fields);
}

export function _toFieldIds(collectionPair: [string, SchemaCollection]): FieldId[] {
  const [collectionName, collection] = collectionPair;
  return chain(collection.fields)
    .keys()
    .map<FieldId>((fieldName) => [collectionName, fieldName])
    .value();
}

const toFieldWith = curry(schemaFieldToField);
