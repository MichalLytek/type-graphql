import * as TypeGraphQL from "type-graphql";
import { PostWhereInput } from "../inputs/PostWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostFilter {
  @TypeGraphQL.Field(_type => PostWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: PostWhereInput | null;

  @TypeGraphQL.Field(_type => PostWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: PostWhereInput | null;

  @TypeGraphQL.Field(_type => PostWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: PostWhereInput | null;
}
