import * as TypeGraphQL from "type-graphql";
import { AggregateDirectorCountArgs } from "./args/AggregateDirectorCountArgs";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregateDirector {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: AggregateDirectorCountArgs) {
    return ctx.prisma.director.count(args);
  }
}
