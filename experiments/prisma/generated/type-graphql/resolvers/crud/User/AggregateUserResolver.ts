import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { User } from "../../../models/User";
import { AggregateUser } from "../../outputs/AggregateUser";

@Resolver(_of => User)
export class AggregateUserResolver {
  @Query(_returns => AggregateUser, {
    nullable: false,
    description: undefined
  })
  async aggregateUser(): Promise<AggregateUser> {
    return new AggregateUser();
  }
}
