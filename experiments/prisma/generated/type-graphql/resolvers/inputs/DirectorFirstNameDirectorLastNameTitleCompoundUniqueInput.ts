import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  directorFirstName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  directorLastName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  title!: string;
}
