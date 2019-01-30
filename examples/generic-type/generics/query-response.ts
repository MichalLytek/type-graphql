import { GenericType, GenericField, Field, Int } from "../../../src";

@GenericType({ gqlType: "ObjectType" })
export class QueryResponse<Type> {
  @GenericField({ array: true })
  items: Type[];

  @Field(type => Int)
  count: number;

  constructor(items: Type[]) {
    this.count = items.length;
    this.items = items;
  }
}
