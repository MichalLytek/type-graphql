import * as Joiful from "joiful";
import { ArgsType, Field, Int } from "../../src";

@ArgsType()
export class RecipesArguments {
  @Field(type => Int)
  // use decorators for Joi
  @Joiful.number().min(0)
  skip: number = 0;

  @Field(type => Int)
  // use decorators for Joi
  @Joiful.number().min(1).max(50)
  take: number = 10;
}
