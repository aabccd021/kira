/** Count number of document which refers to this document */
export type CountField = {
  /** @ignore */
  type: 'count';
  /** Name of collection of counted document, the collection must have reference to collection of this document.*/
  collection: string;
  /**
   * Name of {@link ReferenceField} of counted document, only document that reference document of this field will be
   * counted.
   */
  reference: string;
};
