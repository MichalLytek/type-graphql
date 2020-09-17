import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { UserOrderByInput } from "../../../inputs/UserOrderByInput";
import { UserWhereInput } from "../../../inputs/UserWhereInput";
import { UserWhereUniqueInput } from "../../../inputs/UserWhereUniqueInput";
import { UserDistinctFieldEnum } from "../../../../enums/UserDistinctFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyUserArgs {
  @TypeGraphQL.Field(_type => UserWhereInput, { nullable: true })
  where?: UserWhereInput | undefined;

  @TypeGraphQL.Field(_type => [UserOrderByInput], { nullable: true })
  orderBy?: UserOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => UserWhereUniqueInput, { nullable: true })
  cursor?: UserWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, { nullable: true })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [UserDistinctFieldEnum], { nullable: true })
  distinct?: Array<typeof UserDistinctFieldEnum[keyof typeof UserDistinctFieldEnum]> | undefined;
}
