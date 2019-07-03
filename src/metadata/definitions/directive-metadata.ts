export interface DirectiveMetadata {
  name: string;
  args?: { [key: string]: any };
}

export type DirectiveClassMetadata = DirectiveMetadata & { target: Function };
export type DirectiveFieldMetadata = DirectiveMetadata & { target: Function; field: string };
