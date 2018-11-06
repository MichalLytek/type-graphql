import { FieldMetadata } from "./field-metadata";

export interface ClassMetadata {
  name: string;
  target: Function;
  fields?: FieldMetadata[];
  description?: string;
  interfaceClasses?: Function[];
  metadata?: {
    [key: string]: any;
  };
}
