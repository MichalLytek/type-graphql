import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { DirectorCreateOneWithoutMoviesInput } from "../inputs/DirectorCreateOneWithoutMoviesInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class MovieCreateInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  title!: string;

  @Field(_type => DirectorCreateOneWithoutMoviesInput, {
    nullable: false,
    description: undefined
  })
  director!: DirectorCreateOneWithoutMoviesInput;
}
