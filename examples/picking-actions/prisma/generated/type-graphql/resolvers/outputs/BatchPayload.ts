import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class BatchPayload {
  @Field(_type => Int, {
    nullable: false,
    description: undefined
  })
  count!: number;
}
