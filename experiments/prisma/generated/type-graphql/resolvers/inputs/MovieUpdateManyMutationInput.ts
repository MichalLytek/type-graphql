import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieUpdateManyMutationInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  title?: string | null;
}
