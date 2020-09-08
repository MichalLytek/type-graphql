import * as TypeGraphQL from "type-graphql";
import GraphQLJSON from "graphql-type-json";
import { JsonValue, InputJsonValue } from "../../../client";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType({
  isAbstract: true,
  description: undefined,
})
export class ClientOrderByInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true,
    description: undefined
  })
  id?: typeof SortOrder[keyof typeof SortOrder] | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true,
    description: undefined
  })
  email?: typeof SortOrder[keyof typeof SortOrder] | undefined;

  name?: typeof SortOrder[keyof typeof SortOrder] | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true,
    description: undefined
  })
  age?: typeof SortOrder[keyof typeof SortOrder] | undefined;

  balance?: typeof SortOrder[keyof typeof SortOrder] | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true,
    description: undefined
  })
  amount?: typeof SortOrder[keyof typeof SortOrder] | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true,
    description: undefined
  })
  role?: typeof SortOrder[keyof typeof SortOrder] | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true,
    description: undefined
  })
  get firstName() {
    return this.name;
  }

  set firstName(name: typeof SortOrder[keyof typeof SortOrder] | undefined) {
    this.name = name;
  }

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true,
    description: undefined
  })
  get accountBalance() {
    return this.balance;
  }

  set accountBalance(balance: typeof SortOrder[keyof typeof SortOrder] | undefined) {
    this.balance = balance;
  }
}
