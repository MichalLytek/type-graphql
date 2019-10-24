import { registerEnumType, ObjectType, Field, Int, Float, ID, Resolver, FieldResolver, Root, Ctx, InputType, Query, Mutation, Arg, ArgsType, Args } from "type-graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class NullablePostKindFilter {
}
