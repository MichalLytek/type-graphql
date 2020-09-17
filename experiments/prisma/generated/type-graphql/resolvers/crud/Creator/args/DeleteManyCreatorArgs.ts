import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { CreatorWhereInput } from "../../../inputs/CreatorWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyCreatorArgs {
  @TypeGraphQL.Field(_type => CreatorWhereInput, { nullable: true })
  where?: CreatorWhereInput | undefined;
}
