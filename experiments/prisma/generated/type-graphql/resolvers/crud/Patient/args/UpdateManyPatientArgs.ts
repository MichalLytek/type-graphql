import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PatientUpdateManyMutationInput } from "../../../inputs/PatientUpdateManyMutationInput";
import { PatientWhereInput } from "../../../inputs/PatientWhereInput";

@ArgsType()
export class UpdateManyPatientArgs {
  @Field(_type => PatientUpdateManyMutationInput, { nullable: false })
  data!: PatientUpdateManyMutationInput;

  @Field(_type => PatientWhereInput, { nullable: true })
  where?: PatientWhereInput | null;
}
