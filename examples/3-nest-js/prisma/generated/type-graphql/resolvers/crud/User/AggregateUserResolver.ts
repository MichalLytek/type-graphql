import * as TypeGraphQL from "type-graphql";
import { User } from "../../../models/User";
import { AggregateUser } from "../../outputs/AggregateUser";

@TypeGraphQL.Resolver(_of => User)
export class AggregateUserResolver {
  @TypeGraphQL.Query(_returns => AggregateUser, {
    nullable: false,
    description: undefined
  })
  async aggregateUser(): Promise<AggregateUser> {
    return new AggregateUser();
  }
}
