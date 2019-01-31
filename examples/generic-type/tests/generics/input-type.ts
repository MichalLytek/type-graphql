import { GenericType, GenericField } from "../../../../src";
import { ClassInputType } from "../classes/input-type";

@GenericType({ types: [ClassInputType], gqlType: "InputType" })
export class GenericInputType<Type> {
  @GenericField()
  generic: Type;
}
