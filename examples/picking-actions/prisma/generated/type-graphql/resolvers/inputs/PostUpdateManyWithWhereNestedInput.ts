import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PostScalarWhereInput } from "../inputs/PostScalarWhereInput";
import { PostUpdateManyDataInput } from "../inputs/PostUpdateManyDataInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpdateManyWithWhereNestedInput {
  @Field(_type => PostScalarWhereInput, {
    nullable: false,
    description: undefined
  })
  where!: PostScalarWhereInput;

  @Field(_type => PostUpdateManyDataInput, {
    nullable: false,
    description: undefined
  })
  data!: PostUpdateManyDataInput;
}
