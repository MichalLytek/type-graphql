import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Director } from "../../../models/Director";
import { AggregateDirector } from "../../outputs/AggregateDirector";

@Resolver(_of => Director)
export class AggregateDirectorResolver {
  @Query(_returns => AggregateDirector, {
    nullable: false,
    description: undefined
  })
  async aggregateDirector(): Promise<AggregateDirector> {
    return new AggregateDirector();
  }
}
