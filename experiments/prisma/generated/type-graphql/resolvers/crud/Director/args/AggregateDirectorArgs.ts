import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { DirectorOrderByInput } from "../../../inputs/DirectorOrderByInput";
import { DirectorWhereInput } from "../../../inputs/DirectorWhereInput";
import { DirectorWhereUniqueInput } from "../../../inputs/DirectorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateDirectorArgs {
  @TypeGraphQL.Field(_type => DirectorWhereInput, { nullable: true })
  where?: DirectorWhereInput | undefined;

  @TypeGraphQL.Field(_type => DirectorOrderByInput, { nullable: true })
  orderBy?: DirectorOrderByInput | undefined;

  @TypeGraphQL.Field(_type => DirectorWhereUniqueInput, { nullable: true })
  cursor?: DirectorWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | undefined;
}
