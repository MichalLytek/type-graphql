export type ExtensionsMetadata = Readonly<Record<string, any>>

export interface ExtensionsClassMetadata {
  target: Function
  extensions: ExtensionsMetadata
}

export interface ExtensionsFieldMetadata {
  target: Function
  fieldName: string
  extensions: ExtensionsMetadata
}
