import { FieldMetadata } from "./field-metadata";
import { DirectiveMetadata } from "./directive-metadata";

export interface ClassMetadata {
  name: string;
  target: Function;
  fields?: FieldMetadata[];
  description?: string;
  isAbstract?: boolean;
  directives?: DirectiveMetadata[];
}
