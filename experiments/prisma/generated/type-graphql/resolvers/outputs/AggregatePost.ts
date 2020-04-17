import * as TypeGraphQL from "type-graphql";
import { AggregatePostCountArgs } from "./args/AggregatePostCountArgs";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregatePost {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: AggregatePostCountArgs) {
    return ctx.prisma.post.count(args);
  }
}
