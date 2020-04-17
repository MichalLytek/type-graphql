import * as TypeGraphQL from "type-graphql";
import { PostKind } from "../../enums/PostKind";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostUpdateManyDataInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  uuid?: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  createdAt?: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  updatedAt?: Date | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true,
    description: undefined
  })
  published?: boolean | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  title?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined
  })
  content?: string | null;

  @TypeGraphQL.Field(_type => PostKind, {
    nullable: true,
    description: undefined
  })
  kind?: keyof typeof PostKind | null;
}
