import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { AggregatePatientCountArgs } from "./args/AggregatePatientCountArgs";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AggregatePatient {
  @Field(_type => Int, {
    nullable: false,
    description: undefined
  })
  count(@Ctx() ctx: any, @Args() args: AggregatePatientCountArgs) {
    return ctx.prisma.patient.count(args);
  }
}
