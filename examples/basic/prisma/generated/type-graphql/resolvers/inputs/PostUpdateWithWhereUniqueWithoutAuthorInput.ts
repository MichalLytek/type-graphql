import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PostUpdateWithoutAuthorDataInput } from "../inputs/PostUpdateWithoutAuthorDataInput";
import { PostWhereUniqueInput } from "../inputs/PostWhereUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpdateWithWhereUniqueWithoutAuthorInput {
  @Field(_type => PostWhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  where!: PostWhereUniqueInput;

  @Field(_type => PostUpdateWithoutAuthorDataInput, {
    nullable: false,
    description: undefined
  })
  data!: PostUpdateWithoutAuthorDataInput;
}
