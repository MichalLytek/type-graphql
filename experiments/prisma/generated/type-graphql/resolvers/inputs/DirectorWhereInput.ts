import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { MovieFilter } from "../inputs/MovieFilter";
import { StringFilter } from "../inputs/StringFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorWhereInput {
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

  @Field(_type => MovieFilter, {
    nullable: true,
    description: undefined
  })
  movies?: MovieFilter | null;

  @Field(_type => [DirectorWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: DirectorWhereInput[] | null;

  @Field(_type => [DirectorWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: DirectorWhereInput[] | null;

  @Field(_type => [DirectorWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: DirectorWhereInput[] | null;
}
