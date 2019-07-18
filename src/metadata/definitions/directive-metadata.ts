export interface DirectiveMetadata {
  nameOrSDL: string;
  args: { [key: string]: string };
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
