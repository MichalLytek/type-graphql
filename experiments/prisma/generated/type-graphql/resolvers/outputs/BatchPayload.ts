import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class BatchPayload {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count!: number;
}
