import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class GetAllArgs {
  @Field(_type => Int)
  skip = 0;

  @Field(_type => Int)
  take = 10;
}
