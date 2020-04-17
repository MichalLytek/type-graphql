import * as TypeGraphQL from "type-graphql";
import { MovieOrderByInput } from "../../../inputs/MovieOrderByInput";
import { MovieWhereInput } from "../../../inputs/MovieWhereInput";
import { MovieWhereUniqueInput } from "../../../inputs/MovieWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DirectorMoviesArgs {
  @TypeGraphQL.Field(_type => MovieWhereInput, { nullable: true })
  where?: MovieWhereInput | null;

  @TypeGraphQL.Field(_type => MovieOrderByInput, { nullable: true })
  orderBy?: MovieOrderByInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null;

  @TypeGraphQL.Field(_type => MovieWhereUniqueInput, { nullable: true })
  after?: MovieWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => MovieWhereUniqueInput, { nullable: true })
  before?: MovieWhereUniqueInput | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  first?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  last?: number | null;
}
