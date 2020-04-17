import * as TypeGraphQL from "type-graphql";
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
