import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UuidCompoundUniqueInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  uuid!: string;
}
