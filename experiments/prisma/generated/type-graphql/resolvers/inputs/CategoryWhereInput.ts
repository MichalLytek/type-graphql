import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { IntFilter } from "../inputs/IntFilter";
import { StringFilter } from "../inputs/StringFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class CategoryWhereInput {
  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  name?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  slug?: StringFilter | null;

  @Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  number?: IntFilter | null;

  @Field(_type => [CategoryWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: CategoryWhereInput[] | null;

  @Field(_type => [CategoryWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: CategoryWhereInput[] | null;

  @Field(_type => [CategoryWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: CategoryWhereInput[] | null;
}
