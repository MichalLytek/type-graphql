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
  fieldName: string;
  directive: DirectiveMetadata;
}

export interface DirectiveArgumentMetadata {
  target: Function;
  fieldName: string;
  parameterIndex: number;
  directive: DirectiveMetadata;
}
