import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PostWhereInput } from "../inputs/PostWhereInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class PostFilter {
  @Field(_type => PostWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: PostWhereInput | null;

  @Field(_type => PostWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: PostWhereInput | null;

  @Field(_type => PostWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: PostWhereInput | null;
}
