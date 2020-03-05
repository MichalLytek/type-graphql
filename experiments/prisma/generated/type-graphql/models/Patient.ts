import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Patient {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  firstName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  lastName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  email!: string;
}
