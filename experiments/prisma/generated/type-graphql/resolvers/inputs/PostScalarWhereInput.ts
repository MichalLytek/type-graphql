import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { BooleanFilter } from "../inputs/BooleanFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { NullablePostKindFilter } from "../inputs/NullablePostKindFilter";
import { NullableStringFilter } from "../inputs/NullableStringFilter";
import { StringFilter } from "../inputs/StringFilter";
import { UUIDFilter } from "../inputs/UUIDFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class PostScalarWhereInput {
  @Field(_type => UUIDFilter, {
    nullable: true,
    description: undefined
  })
  uuid?: UUIDFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  published?: BooleanFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  title?: StringFilter | null;

  @Field(_type => NullableStringFilter, {
    nullable: true,
    description: undefined
  })
  content?: NullableStringFilter | null;

  @Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  authorId?: IntFilter | null;

  @Field(_type => NullablePostKindFilter, {
    nullable: true,
    description: undefined
  })
  kind?: NullablePostKindFilter | null;

  @Field(_type => [PostScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: PostScalarWhereInput[] | null;

  @Field(_type => [PostScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: PostScalarWhereInput[] | null;

  @Field(_type => [PostScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: PostScalarWhereInput[] | null;
}
