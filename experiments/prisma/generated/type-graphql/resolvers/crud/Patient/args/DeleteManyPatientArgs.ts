import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PatientWhereInput } from "../../../inputs/PatientWhereInput";

@ArgsType()
export class DeleteManyPatientArgs {
  @Field(_type => PatientWhereInput, { nullable: true })
  where?: PatientWhereInput | null;
}
