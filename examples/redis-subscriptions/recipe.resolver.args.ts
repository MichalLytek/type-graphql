import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class NewCommentsArgs {
  @Field(_type => ID)
  recipeId!: string;
}
