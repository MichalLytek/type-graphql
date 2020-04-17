import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PatientOrderByInput } from "../../inputs/PatientOrderByInput";
import { PatientWhereInput } from "../../inputs/PatientWhereInput";
import { PatientWhereUniqueInput } from "../../inputs/PatientWhereUniqueInput";

@ArgsType()
export class AggregatePatientCountArgs {
  @Field(_type => PatientWhereInput, { nullable: true })
  where?: PatientWhereInput | null;

  @Field(_type => PatientOrderByInput, { nullable: true })
  orderBy?: PatientOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => PatientWhereUniqueInput, { nullable: true })
  after?: PatientWhereUniqueInput | null;

  @Field(_type => PatientWhereUniqueInput, { nullable: true })
  before?: PatientWhereUniqueInput | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
