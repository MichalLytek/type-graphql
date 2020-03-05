import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Category {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  name!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  slug!: string;

  @Field(_type => Int, {
    nullable: false,
    description: undefined,
  })
  number!: number;
}
