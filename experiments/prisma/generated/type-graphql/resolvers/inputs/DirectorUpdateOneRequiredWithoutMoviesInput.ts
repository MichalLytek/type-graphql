import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorCreateWithoutMoviesInput } from "../inputs/DirectorCreateWithoutMoviesInput";
import { DirectorUpdateWithoutMoviesDataInput } from "../inputs/DirectorUpdateWithoutMoviesDataInput";
import { DirectorUpsertWithoutMoviesInput } from "../inputs/DirectorUpsertWithoutMoviesInput";
import { DirectorWhereUniqueInput } from "../inputs/DirectorWhereUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorUpdateOneRequiredWithoutMoviesInput {
  @Field(_type => DirectorCreateWithoutMoviesInput, {
    nullable: true,
    description: undefined
  })
  create?: DirectorCreateWithoutMoviesInput | null;

  @Field(_type => DirectorWhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  connect?: DirectorWhereUniqueInput | null;

  @Field(_type => DirectorUpdateWithoutMoviesDataInput, {
    nullable: true,
    description: undefined
  })
  update?: DirectorUpdateWithoutMoviesDataInput | null;

  @Field(_type => DirectorUpsertWithoutMoviesInput, {
    nullable: true,
    description: undefined
  })
  upsert?: DirectorUpsertWithoutMoviesInput | null;
}
