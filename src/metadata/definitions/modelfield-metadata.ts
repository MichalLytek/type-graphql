import { NullableListOptions, TypeValue } from "../../decorators/types";

export interface ModelFieldMetadata {
  name: string;
  type: TypeValue;
  nullable: boolean | NullableListOptions;
}
