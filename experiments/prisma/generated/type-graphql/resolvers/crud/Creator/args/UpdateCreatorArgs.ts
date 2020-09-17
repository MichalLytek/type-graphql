import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { CreatorUpdateInput } from "../../../inputs/CreatorUpdateInput";
import { CreatorWhereUniqueInput } from "../../../inputs/CreatorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateCreatorArgs {
  @TypeGraphQL.Field(_type => CreatorUpdateInput, { nullable: false })
  data!: CreatorUpdateInput;

  @TypeGraphQL.Field(_type => CreatorWhereUniqueInput, { nullable: false })
  where!: CreatorWhereUniqueInput;
}
