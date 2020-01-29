import { FieldMetadata } from "./field-metadata";
import { DirectiveMetadata } from "./directive-metadata";
import { ExtensionsMetadata } from "./extensions-metadata";

export interface ClassMetadata {
  name: string;
  target: Function;
  fields?: FieldMetadata[];
  description?: string;
  isAbstract?: boolean;
  directives?: DirectiveMetadata[];
  extensions?: ExtensionsMetadata;
  simpleResolvers?: boolean;
}
