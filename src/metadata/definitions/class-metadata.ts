import type { DirectiveMetadata } from "./directive-metadata";
import type { ExtensionsMetadata } from "./extensions-metadata";
import type { FieldMetadata } from "./field-metadata";

export type ClassMetadata = {
  name: string;
  target: Function;
  fields?: FieldMetadata[];
  description?: string;
  directives?: DirectiveMetadata[];
  extensions?: ExtensionsMetadata;
  simpleResolvers?: boolean;
};
