import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Post } from "../../../models/Post";
import { AggregatePost } from "../../outputs/AggregatePost";

@Resolver(_of => Post)
export class AggregatePostResolver {
  @Query(_returns => AggregatePost, {
    nullable: false,
    description: undefined
  })
  async aggregatePost(): Promise<AggregatePost> {
    return new AggregatePost();
  }
}
