import { ArgsType, InputType, Field } from "../../../src";
import { GenericInputType } from "./generics/input-type";
import { ClassInputType } from "./classes/input-type";

@ArgsType()
export class InputTypeTest {
  @Field(type => ClassInputType, { generic: GenericInputType })
  wrap: GenericInputType<ClassInputType>;
}
