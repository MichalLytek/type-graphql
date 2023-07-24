export type ExtensionsMetadata = Readonly<Record<string, any>>;

export type ExtensionsClassMetadata = {
  target: Function;
  extensions: ExtensionsMetadata;
};

export type ExtensionsFieldMetadata = {
  target: Function;
  fieldName: string;
  extensions: ExtensionsMetadata;
};
