import * as TypeGraphQL from "type-graphql";
import { Post } from "../models/Post";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class User {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  id!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  email!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  name?: string | null;

  posts?: Post[] | null;
}
