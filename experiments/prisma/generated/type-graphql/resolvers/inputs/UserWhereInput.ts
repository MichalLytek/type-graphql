import * as TypeGraphQL from "type-graphql";
import { FloatFilter } from "../inputs/FloatFilter";
import { IntFilter } from "../inputs/IntFilter";
import { NullableStringFilter } from "../inputs/NullableStringFilter";
import { PostFilter } from "../inputs/PostFilter";
import { RoleFilter } from "../inputs/RoleFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class UserWhereInput {
  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  id?: IntFilter | null;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  email?: StringFilter | null;

  @TypeGraphQL.Field(_type => NullableStringFilter, {
    nullable: true,
    description: undefined
  })
  name?: NullableStringFilter | null;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  age?: IntFilter | null;

  @TypeGraphQL.Field(_type => FloatFilter, {
    nullable: true,
    description: undefined
  })
  balance?: FloatFilter | null;

  @TypeGraphQL.Field(_type => FloatFilter, {
    nullable: true,
    description: undefined
  })
  amount?: FloatFilter | null;

  @TypeGraphQL.Field(_type => PostFilter, {
    nullable: true,
    description: undefined
  })
  posts?: PostFilter | null;

  @TypeGraphQL.Field(_type => RoleFilter, {
    nullable: true,
    description: undefined
  })
  role?: RoleFilter | null;

  @TypeGraphQL.Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: UserWhereInput[] | null;

  @TypeGraphQL.Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: UserWhereInput[] | null;

  @TypeGraphQL.Field(_type => [UserWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: UserWhereInput[] | null;
}
