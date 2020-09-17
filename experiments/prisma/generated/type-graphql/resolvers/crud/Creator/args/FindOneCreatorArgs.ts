import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { CreatorWhereUniqueInput } from "../../../inputs/CreatorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindOneCreatorArgs {
  @TypeGraphQL.Field(_type => CreatorWhereUniqueInput, { nullable: false })
  where!: CreatorWhereUniqueInput;
}
