import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { StringFilter } from "../inputs/StringFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class PatientWhereInput {
  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  firstName?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  lastName?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  email?: StringFilter | null;

  @Field(_type => [PatientWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: PatientWhereInput[] | null;

  @Field(_type => [PatientWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: PatientWhereInput[] | null;

  @Field(_type => [PatientWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: PatientWhereInput[] | null;
}
