import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorOrderByInput } from "../../inputs/DirectorOrderByInput";
import { DirectorWhereInput } from "../../inputs/DirectorWhereInput";
import { DirectorWhereUniqueInput } from "../../inputs/DirectorWhereUniqueInput";

@ArgsType()
export class AggregateDirectorCountArgs {
  @Field(_type => DirectorWhereInput, { nullable: true })
  where?: DirectorWhereInput | null;

  @Field(_type => DirectorOrderByInput, { nullable: true })
  orderBy?: DirectorOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => DirectorWhereUniqueInput, { nullable: true })
  after?: DirectorWhereUniqueInput | null;

  @Field(_type => DirectorWhereUniqueInput, { nullable: true })
  before?: DirectorWhereUniqueInput | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
