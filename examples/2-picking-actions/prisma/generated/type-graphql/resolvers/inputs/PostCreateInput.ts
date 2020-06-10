import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserCreateOneWithoutPostsInput } from "../inputs/UserCreateOneWithoutPostsInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostCreateInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  id?: string | null | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  createdAt?: Date | null | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  updatedAt?: Date | null | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false,
    description: undefined
  })
  published!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined
  })
  title!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  content?: string | null | undefined;

  @TypeGraphQL.Field(_type => UserCreateOneWithoutPostsInput, {
    nullable: true,
    description: undefined
  })
  author?: UserCreateOneWithoutPostsInput | null | undefined;
}
