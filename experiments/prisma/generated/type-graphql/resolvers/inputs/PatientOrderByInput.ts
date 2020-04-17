import * as TypeGraphQL from "type-graphql";
import { OrderByArg } from "../../enums/OrderByArg";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class PatientOrderByInput {
  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  firstName?: keyof typeof OrderByArg | null;

  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  lastName?: keyof typeof OrderByArg | null;

  @TypeGraphQL.Field(_type => OrderByArg, {
    nullable: true,
    description: undefined
  })
  email?: keyof typeof OrderByArg | null;
}
