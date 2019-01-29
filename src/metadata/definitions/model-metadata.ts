import { ClassType } from "./../../interfaces/ClassType";
import { FieldMetadata } from "./field-metadata";
import { DestinationMetadata } from "./destination-metadata";
import { TransformModel, ModelTransformType } from "../../decorators/types";

export interface ModelMetadata {
  name: string;
  target: Function;
  toType: ModelTransformType;
  models?: Function[];
  transform?: TransformModel;
  fields?: FieldMetadata[];
}
