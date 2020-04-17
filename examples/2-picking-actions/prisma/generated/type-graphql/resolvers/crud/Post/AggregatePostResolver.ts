import * as TypeGraphQL from "type-graphql";
import { Post } from "../../../models/Post";
import { AggregatePost } from "../../outputs/AggregatePost";

@TypeGraphQL.Resolver(_of => Post)
export class AggregatePostResolver {
  @TypeGraphQL.Query(_returns => AggregatePost, {
    nullable: false,
    description: undefined
  })
  async aggregatePost(): Promise<AggregatePost> {
    return new AggregatePost();
  }
}
