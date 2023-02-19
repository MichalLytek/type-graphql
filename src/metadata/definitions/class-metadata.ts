import { DirectiveMetadata } from "./directive-metadata";
import { ExtensionsMetadata } from "./extensions-metadata";
import { FieldMetadata } from "./field-metadata";

export interface ClassMetadata {
  name: string;
  target: Function;
  fields?: FieldMetadata[];
  description?: string;
  directives?: DirectiveMetadata[];
  extensions?: ExtensionsMetadata;
  simpleResolvers?: boolean;
}
