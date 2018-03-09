import { IsPositive, Max, Min } from "class-validator";
import { GraphQLArgsType, Field, Int } from "../../src";

@GraphQLArgsType()
export class RecipesArguments {
  @Field(type => Int, { nullable: true })
  @Min(0)
  skip: number = 0;

  @Field(type => Int, { nullable: true })
  @Min(1)
  @Max(50)
  take: number = 10;
}
