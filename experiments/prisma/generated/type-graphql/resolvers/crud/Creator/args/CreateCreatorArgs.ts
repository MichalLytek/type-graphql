import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { CreatorCreateInput } from "../../../inputs/CreatorCreateInput";

@TypeGraphQL.ArgsType()
export class CreateCreatorArgs {
  @TypeGraphQL.Field(_type => CreatorCreateInput, { nullable: false })
  data!: CreatorCreateInput;
}
