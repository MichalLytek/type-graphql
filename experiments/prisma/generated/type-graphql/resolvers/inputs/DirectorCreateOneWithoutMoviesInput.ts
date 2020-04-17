import * as TypeGraphQL from "type-graphql";
import { DirectorCreateWithoutMoviesInput } from "../inputs/DirectorCreateWithoutMoviesInput";
import { DirectorWhereUniqueInput } from "../inputs/DirectorWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorCreateOneWithoutMoviesInput {
  @TypeGraphQL.Field(_type => DirectorCreateWithoutMoviesInput, {
    nullable: true,
    description: undefined
  })
  create?: DirectorCreateWithoutMoviesInput | null;

  @TypeGraphQL.Field(_type => DirectorWhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  connect?: DirectorWhereUniqueInput | null;
}
