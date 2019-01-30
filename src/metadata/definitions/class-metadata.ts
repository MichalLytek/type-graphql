import { FieldMetadata } from "./field-metadata";
import { BaseClassMetadata } from "./types";

export interface ClassMetadata extends BaseClassMetadata {
  fields?: FieldMetadata[];
  description?: string;
  interfaceClasses?: Function[];
}
