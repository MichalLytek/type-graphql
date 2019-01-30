import { ModelTransformType } from "../../decorators/types";
import { ClassMetadata } from ".";

export interface TypeClassMetadata extends ClassMetadata {
  toType?: ModelTransformType;
  model?: ClassMetadata;
  type?: ClassMetadata;
  destination?: boolean;
}
