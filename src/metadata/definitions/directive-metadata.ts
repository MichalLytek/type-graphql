export interface DirectiveMetadata {
  nameOrDefinition: string;
  args: Record<string, any>;
}

export interface DirectiveClassMetadata {
  target: Function;
  directive: DirectiveMetadata;
}
export interface DirectiveFieldMetadata {
  target: Function;
  field: string;
  directive: DirectiveMetadata;
}
