import * as TypeGraphQL from "type-graphql";
import { Client } from "../../../models/Client";
import { AggregateClient } from "../../outputs/AggregateClient";

@TypeGraphQL.Resolver(_of => Client)
export class AggregateClientResolver {
  @TypeGraphQL.Query(_returns => AggregateClient, {
    nullable: false,
    description: undefined
  })
  async aggregateClient(): Promise<AggregateClient> {
    return new AggregateClient();
  }
}
