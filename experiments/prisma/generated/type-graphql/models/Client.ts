import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { Post } from "../models/Post";
import { Role } from "../enums/Role";

/** User model doc */
@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: "User model doc",
})
export class Client {
  /** User model field doc */
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: "User model field doc",
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  email!: string;

  /** renamed field doc */
  name?: string | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined,
  })
  age!: number;

  balance!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: false,
    description: undefined,
  })
  amount!: number;

  posts?: Post[] | null | undefined;

  @TypeGraphQL.Field(_type => Role, {
    nullable: false,
    description: undefined,
  })
  role!: keyof typeof Role;

  /** renamed field doc */
  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: "renamed field doc",
  })
  get firstName(): string | null | undefined {
    return this.name;
  }

  @TypeGraphQL.Field(_type => TypeGraphQL.Float, {
    nullable: false,
    description: undefined,
  })
  get accountBalance(): number {
    return this.balance;
  }
}
