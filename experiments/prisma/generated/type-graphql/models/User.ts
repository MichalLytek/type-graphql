import * as TypeGraphQL from "type-graphql";
import { Post } from "../models/Post";
import { Role } from "../enums/Role";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class User {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined,
  })
  id!: number;

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

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined,
  })
  age!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: false,
    description: undefined,
  })
  balance!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: false,
    description: undefined,
  })
  amount!: number;

  posts?: Post[] | null;

  @TypeGraphQL.Field(_type => Role, {
    nullable: false,
    description: undefined,
  })
  role!: keyof typeof Role;
}
