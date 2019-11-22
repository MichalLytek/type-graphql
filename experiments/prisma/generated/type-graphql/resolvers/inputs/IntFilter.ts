import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class IntFilter {
  @Field(_type => Int, {
    nullable: true,
    description: undefined
  })
  equals?: number | null;

  @Field(_type => Int, {
    nullable: true,
    description: undefined
  })
  not?: number | null;

  @Field(_type => [Int], {
    nullable: true,
    description: undefined
  })
  in?: number[] | null;

  @Field(_type => [Int], {
    nullable: true,
    description: undefined
  })
  notIn?: number[] | null;

  @Field(_type => Int, {
    nullable: true,
    description: undefined
  })
  lt?: number | null;

  @Field(_type => Int, {
    nullable: true,
    description: undefined
  })
  lte?: number | null;

  @Field(_type => Int, {
    nullable: true,
    description: undefined
  })
  gt?: number | null;

  @Field(_type => Int, {
    nullable: true,
    description: undefined
  })
  gte?: number | null;
}
