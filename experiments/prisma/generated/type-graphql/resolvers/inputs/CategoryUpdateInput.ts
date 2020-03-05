import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class CategoryUpdateInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  slug?: string | null;

  @Field(_type => Int, {
    nullable: true,
    description: undefined
  })
  number?: number | null;
}
