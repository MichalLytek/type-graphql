import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { OrderByArg } from "../../enums/OrderByArg";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PostOrderByInput {
  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  id?: keyof typeof OrderByArg | null | undefined;

  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  createdAt?: keyof typeof OrderByArg | null | undefined;

  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  updatedAt?: keyof typeof OrderByArg | null | undefined;

  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  published?: keyof typeof OrderByArg | null | undefined;

  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  title?: keyof typeof OrderByArg | null | undefined;

  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  content?: keyof typeof OrderByArg | null | undefined;

  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  authorId?: keyof typeof OrderByArg | null | undefined;
}
