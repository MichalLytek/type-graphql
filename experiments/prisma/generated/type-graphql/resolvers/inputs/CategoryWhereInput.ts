import * as TypeGraphQL from "type-graphql";
import { IntFilter } from "../inputs/IntFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CategoryWhereInput {
  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  name?: StringFilter | null;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  slug?: StringFilter | null;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true,
    description: undefined
  })
  number?: IntFilter | null;

  @TypeGraphQL.Field(_type => [CategoryWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: CategoryWhereInput[] | null;

  @TypeGraphQL.Field(_type => [CategoryWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: CategoryWhereInput[] | null;

  @TypeGraphQL.Field(_type => [CategoryWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: CategoryWhereInput[] | null;
}
