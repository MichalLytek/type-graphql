import * as TypeGraphQL from "type-graphql";
import { Director } from "../../../models/Director";
import { AggregateDirector } from "../../outputs/AggregateDirector";

@TypeGraphQL.Resolver(_of => Director)
export class AggregateDirectorResolver {
  @TypeGraphQL.Query(_returns => AggregateDirector, {
    nullable: false,
    description: undefined
  })
  async aggregateDirector(): Promise<AggregateDirector> {
    return new AggregateDirector();
  }
}
