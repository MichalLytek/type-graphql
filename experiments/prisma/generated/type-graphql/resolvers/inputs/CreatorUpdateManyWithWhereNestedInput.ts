import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { CreatorScalarWhereInput } from "../inputs/CreatorScalarWhereInput";
import { CreatorUpdateManyDataInput } from "../inputs/CreatorUpdateManyDataInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class CreatorUpdateManyWithWhereNestedInput {
  @TypeGraphQL.Field(_type => CreatorScalarWhereInput, {
    nullable: false,
    description: undefined
  })
  where!: CreatorScalarWhereInput;

  @TypeGraphQL.Field(_type => CreatorUpdateManyDataInput, {
    nullable: false,
    description: undefined
  })
  data!: CreatorUpdateManyDataInput;
}
