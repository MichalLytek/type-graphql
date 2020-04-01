import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { StringFilter } from "../inputs/StringFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieScalarWhereInput {
  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  directorFirstName?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  directorLastName?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  title?: StringFilter | null;

  @Field(_type => [MovieScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: MovieScalarWhereInput[] | null;

  @Field(_type => [MovieScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: MovieScalarWhereInput[] | null;

  @Field(_type => [MovieScalarWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: MovieScalarWhereInput[] | null;
}
