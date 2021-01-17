export type CreateCollection = {
  migrationType: 'createCollection';
  collectionName: string;
};

export type UpdateCollectionName = {
  migrationType: 'updateCollectionName';
  collectionName: string;
};

export type DeleteCollection = {
  migrationType: 'deleteCollection';
  collectionName: string;
};

export type CreateField = {
  migrationType: 'createField';
  collectionName: string;
  fieldName: string;
};

export type UpdateFieldType = {
  migrationType: 'updateFieldType';
  collectionName: string;
  fieldName: string;
};

export type UpdateFieldName = {
  migrationType: 'updateFieldName';
  collectionName: string;
  fieldName: string;
};

export type DeleteField = {
  migrationType: 'deleteField';
  collectionName: string;
  fieldName: string;
};
