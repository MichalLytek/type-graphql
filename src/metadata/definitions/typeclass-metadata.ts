import { ModelTransformType } from "../../decorators/types";
import { ClassMetadata } from "./class-metadata";

export interface TypeClassMetadata extends ClassMetadata {
  toType?: ModelTransformType;
  model?: ClassMetadata;
}
