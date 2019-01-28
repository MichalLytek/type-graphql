import { FieldMetadata } from "./field-metadata";
import { TypeValueThunk } from "../../decorators/types";

export interface DestinationMetadata {
  name: string;
  target: Function;
}
