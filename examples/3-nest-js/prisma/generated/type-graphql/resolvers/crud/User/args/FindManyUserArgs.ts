import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserOrderByInput } from "../../../inputs/UserOrderByInput";
import { UserWhereInput } from "../../../inputs/UserWhereInput";
import { UserWhereUniqueInput } from "../../../inputs/UserWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindManyUserArgs {
  @TypeGraphQL.Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | null | undefined;

  @TypeGraphQL.Field(_type => UserOrderByInput, { nullable: true })
  orderBy?: UserOrderByInput | null | undefined;

  @TypeGraphQL.Field(_type => UserWhereUniqueInput, { nullable: true })
  cursor?: UserWhereUniqueInput | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  take?: number | null | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | null | undefined;
}
