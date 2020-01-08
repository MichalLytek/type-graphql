export interface ExtensionsClassMetadata {
  target: Function;
  extensions: Record<string, any>;
}

export interface ExtensionsFieldMetadata {
  target: Function;
  fieldName: string;
  extensions: Record<string, any>;
}
