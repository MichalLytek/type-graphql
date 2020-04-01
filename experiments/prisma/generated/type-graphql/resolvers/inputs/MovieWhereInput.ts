import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorWhereInput } from "../inputs/DirectorWhereInput";
import { StringFilter } from "../inputs/StringFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieWhereInput {
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

  @Field(_type => [MovieWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: MovieWhereInput[] | null;

  @Field(_type => [MovieWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: MovieWhereInput[] | null;

  @Field(_type => [MovieWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: MovieWhereInput[] | null;

  @Field(_type => DirectorWhereInput, {
    nullable: true,
    description: undefined
  })
  director?: DirectorWhereInput | null;
}
