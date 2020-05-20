import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { Post } from "../models/Post";
import { Role } from "../enums/Role";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Client {
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

  @TypeGraphQL.Field(_type => String, {
    nullable: true,
    description: undefined,
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
