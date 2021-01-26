/** Sum value of certain field of document which refers to this document */
export type SumField = {
  /** @ignore */
  type: 'sum';
  /**
   * Name of collection of document of summed field, the collection must have reference to collection of this document.
   */
  collection: string;
  /**
   * Name of {@link ReferenceField} of document of summed field, only field of document that reference this document
   * will be summed.
   */
  reference: string;
  /**
   * Name of field to be summed. The field must be {@link IntegerField}.
   */
  field: string;
};
