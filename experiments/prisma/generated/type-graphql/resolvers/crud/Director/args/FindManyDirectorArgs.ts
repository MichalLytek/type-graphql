import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { DirectorOrderByInput } from "../../../inputs/DirectorOrderByInput";
import { DirectorWhereInput } from "../../../inputs/DirectorWhereInput";
import { DirectorWhereUniqueInput } from "../../../inputs/DirectorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindManyDirectorArgs {
  @TypeGraphQL.Field(_type => DirectorWhereInput, { nullable: true })
  where?: DirectorWhereInput | null | undefined;

  @TypeGraphQL.Field(_type => DirectorOrderByInput, { nullable: true })
  orderBy?: DirectorOrderByInput | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null | undefined;

  @TypeGraphQL.Field(_type => DirectorWhereUniqueInput, { nullable: true })
  after?: DirectorWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => DirectorWhereUniqueInput, { nullable: true })
  before?: DirectorWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  first?: number | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  last?: number | null | undefined;
}