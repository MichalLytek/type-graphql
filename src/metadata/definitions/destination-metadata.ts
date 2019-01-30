import { FieldMetadata } from "./field-metadata";
import { TypeValueThunk, TypeOptions, TransformModel } from "../../decorators/types";

export interface DestinationMetadata {
  name: string;
  target: Function;
  array?: boolean;
  nullable?: boolean;
  transform?: TransformModel;
}
