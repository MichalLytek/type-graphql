import { IsPositive, Max, Min } from "class-validator";
import { ArgsType, Field, Int } from "../../../src";

@ArgsType()
export class RecipesArgs {
  @Field(type => Int)
  @Min(0)
  skip = 0;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  take = 10;
}
