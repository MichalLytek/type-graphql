import { FieldMetadata } from "./field-metadata";
import { TypeValueThunk, TypeOptions } from "../../decorators/types";

export interface DestinationMetadata {
  name: string;
  target: Function;
  nullable?: boolean;
  apply?: (field: FieldMetadata) => void;
}
