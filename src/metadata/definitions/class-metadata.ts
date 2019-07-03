import { FieldMetadata } from "./field-metadata";
import { DirectiveClassMetadata } from "./directive-metadata";

export interface ClassMetadata {
  name: string;
  target: Function;
  fields?: FieldMetadata[];
  description?: string;
  isAbstract?: boolean;
  directives?: DirectiveClassMetadata[];
}
