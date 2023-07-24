export type DirectiveMetadata = {
  nameOrDefinition: string;
  args: Record<string, any>;
};

export type DirectiveClassMetadata = {
  target: Function;
  directive: DirectiveMetadata;
};

export type DirectiveFieldMetadata = {
  target: Function;
  fieldName: string;
  directive: DirectiveMetadata;
};
