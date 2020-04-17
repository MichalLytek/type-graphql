import * as TypeGraphQL from "type-graphql";
import { PostScalarWhereInput } from "../inputs/PostScalarWhereInput";
import { PostUpdateManyDataInput } from "../inputs/PostUpdateManyDataInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpdateManyWithWhereNestedInput {
  @TypeGraphQL.Field(_type => PostScalarWhereInput, {
    nullable: false,
    description: undefined
  })
  where!: PostScalarWhereInput;

  @TypeGraphQL.Field(_type => PostUpdateManyDataInput, {
    nullable: false,
    description: undefined
  })
  data!: PostUpdateManyDataInput;
}
