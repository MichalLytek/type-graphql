import * as TypeGraphQL from "type-graphql";
import { OrderByArg } from "../../enums/OrderByArg";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CategoryOrderByInput {
  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  name?: keyof typeof OrderByArg | null;

  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  slug?: keyof typeof OrderByArg | null;

  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  number?: keyof typeof OrderByArg | null;
}
