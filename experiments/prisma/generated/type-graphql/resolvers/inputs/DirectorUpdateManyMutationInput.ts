import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorUpdateManyMutationInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  firstName?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  lastName?: string | null;
}
