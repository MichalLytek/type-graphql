import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class BooleanFilter {
  @Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  equals?: boolean | null;

  @Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  not?: boolean | null;
}
