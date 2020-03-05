import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { SlugNumberCompoundUniqueInput } from "../inputs/SlugNumberCompoundUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class CategoryWhereUniqueInput {
  @Field(_type => SlugNumberCompoundUniqueInput, {
    nullable: true,
    description: undefined
  })
  slug_number?: SlugNumberCompoundUniqueInput | null;
}
