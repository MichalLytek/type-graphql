import * as TypeGraphQL from "type-graphql";
import { PostUpdateWithoutAuthorDataInput } from "../inputs/PostUpdateWithoutAuthorDataInput";
import { PostWhereUniqueInput } from "../inputs/PostWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpdateWithWhereUniqueWithoutAuthorInput {
  @TypeGraphQL.Field(_type => PostWhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  where!: PostWhereUniqueInput;

  @TypeGraphQL.Field(_type => PostUpdateWithoutAuthorDataInput, {
    nullable: false,
    description: undefined
  })
  data!: PostUpdateWithoutAuthorDataInput;
}
