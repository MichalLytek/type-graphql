import { FieldMetadata } from "./field-metadata";
import { TypeValueThunk, TypeOptions, TransformModel } from "../../decorators/types";

export interface DestinationMetadata {
  name: string;
  target: Function;
  nullable?: boolean;
  transform?: TransformModel;
}
