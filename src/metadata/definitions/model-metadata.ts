import { FieldMetadata } from "./field-metadata";
import { DestinationMetadata } from "./destination-metadata";

export interface ModelMetadata {
  name: () => string;
  target: Function;
  models: any[];
  fields?: FieldMetadata[];
}
