import { Arg, Args, ArgsType, Ctx, Field, FieldResolver, Float, ID, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, registerEnumType } from "type-graphql";
import { Role } from "../../enums/Role";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class RoleFilter {
  @Field(_type => Role, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof Role | null;

  @Field(_type => Role, {
    nullable: true,
    description: undefined
  })
  not?: keyof typeof Role | null;

  @Field(_type => [Role], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof Role> | null;

  @Field(_type => [Role], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<keyof typeof Role> | null;
}
