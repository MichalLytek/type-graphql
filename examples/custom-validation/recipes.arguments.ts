import Joiful from "joiful";
import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class RecipesArguments {
  @Field(_type => Int)
  // use decorators for Joi
  @(Joiful.number().min(0))
  skip = 0;

  @Field(_type => Int)
  // use decorators for Joi
  @(Joiful.number().min(1).max(50))
  take = 10;
}
