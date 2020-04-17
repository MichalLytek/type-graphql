import * as TypeGraphQL from "type-graphql";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Patient {
  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  firstName!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  lastName!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  email!: string;
}
