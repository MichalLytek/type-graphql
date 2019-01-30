import { GqlTypes } from "../../decorators/types";
import { ClassMetadata } from ".";

export interface TypeClassMetadata extends ClassMetadata {
  gqlType?: GqlTypes;
  genericType?: ClassMetadata;
  type?: ClassMetadata;
  isWrapper?: boolean;
}
