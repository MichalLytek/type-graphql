import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { AggregateUserCountArgs } from "./args/AggregateUserCountArgs";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateUser {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: AggregateUserCountArgs) {
    return ctx.prisma.user.count(args);
  }
}
