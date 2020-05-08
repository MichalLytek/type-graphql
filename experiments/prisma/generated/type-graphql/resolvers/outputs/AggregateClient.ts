import * as TypeGraphQL from "type-graphql";
import { AggregateClientCountArgs } from "./args/AggregateClientCountArgs";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateClient {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: AggregateClientCountArgs) {
    return ctx.prisma.user.count(args);
  }
}
