import * as TypeGraphQL from "type-graphql";
import { AggregatePatientCountArgs } from "./args/AggregatePatientCountArgs";

@TypeGraphQL.ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregatePatient {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false,
    description: undefined
  })
  count(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: AggregatePatientCountArgs) {
    return ctx.prisma.patient.count(args);
  }
}
