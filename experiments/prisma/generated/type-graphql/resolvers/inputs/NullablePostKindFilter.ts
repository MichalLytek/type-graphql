import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { PostKind } from "../../enums/PostKind";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class NullablePostKindFilter {
  @Field(_type => PostKind, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof PostKind | null;

  @Field(_type => PostKind, {
    nullable: true,
    description: undefined
  })
  not?: keyof typeof PostKind | null;

  @Field(_type => [PostKind], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof PostKind> | null;

  @Field(_type => [PostKind], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<keyof typeof PostKind> | null;
}
