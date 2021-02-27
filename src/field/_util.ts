export type FieldType = 'count' | 'integer' | 'reference' | 'serverTimestamp' | 'string' | 'sum';

export type Validation<T> = {
  value: T;
  errorMessage?: string;
};
