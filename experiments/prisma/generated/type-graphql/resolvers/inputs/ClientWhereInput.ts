import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { EnumRoleFilter } from "../inputs/EnumRoleFilter";
import { FloatFilter } from "../inputs/FloatFilter";
import { IntFilter } from "../inputs/IntFilter";
import { PostListRelationFilter } from "../inputs/PostListRelationFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ClientWhereInput {
  @TypeGraphQL.Field(_type => [ClientWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: ClientWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [ClientWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: ClientWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [ClientWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: ClientWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  email?: StringFilter | undefined;

  name?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  age?: IntFilter | undefined;

  balance?: FloatFilter | undefined;

  @TypeGraphQL.Field(_type => FloatFilter, {
    nullable: true,
    description: undefined
  })
  amount?: FloatFilter | undefined;

  posts?: PostListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => EnumRoleFilter, {
    nullable: true,
    description: undefined
  })
  role?: EnumRoleFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true,
    description: undefined
  })
  get firstName() {
    return this.name;
  }

  set firstName(name: StringNullableFilter | undefined) {
    this.name = name;
  }

  @TypeGraphQL.Field(_type => FloatFilter, {
    nullable: true,
    description: undefined
  })
  get accountBalance() {
    return this.balance;
  }

  set accountBalance(balance: FloatFilter | undefined) {
    this.balance = balance;
  }

  @TypeGraphQL.Field(_type => PostListRelationFilter, {
    nullable: true,
    description: undefined
  })
  get clientPosts() {
    return this.posts;
  }

  set clientPosts(posts: PostListRelationFilter | undefined) {
    this.posts = posts;
  }
}
