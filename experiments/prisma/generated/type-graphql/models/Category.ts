import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../client";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Category {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  slug!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined,
  })
  number!: number;
}
