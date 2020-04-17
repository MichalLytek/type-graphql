import * as TypeGraphQL from "type-graphql";
import { Role } from "../../enums/Role";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class RoleFilter {
  @TypeGraphQL.Field(_type => Role, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof Role | null;

  @TypeGraphQL.Field(_type => Role, {
    nullable: true,
    description: undefined
  })
  not?: keyof typeof Role | null;

  @TypeGraphQL.Field(_type => [Role], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof Role> | null;

  @TypeGraphQL.Field(_type => [Role], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<keyof typeof Role> | null;
}
