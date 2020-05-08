import * as TypeGraphQL from "type-graphql";
import { ClientCreateWithoutPostsInput } from "../inputs/ClientCreateWithoutPostsInput";
import { ClientWhereUniqueInput } from "../inputs/ClientWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ClientCreateOneWithoutPostsInput {
  @TypeGraphQL.Field(_type => ClientCreateWithoutPostsInput, {
    nullable: true,
    description: undefined
  })
  create?: ClientCreateWithoutPostsInput | null;

  @TypeGraphQL.Field(_type => ClientWhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  connect?: ClientWhereUniqueInput | null;
}
