import { ClassType, Field, ObjectType, Int } from "../../src";

export default function PaginatedResponse<TItemsFieldValue>(
  itemsFieldValue: ClassType<TItemsFieldValue> | String | Number | Boolean,
) {
  @ObjectType()
  abstract class PaginatedResponseClass {
    @Field(type => [itemsFieldValue])
    items: TItemsFieldValue[];

    @Field(type => Int)
    total: number;

    @Field()
    hasMore: boolean;
  }
  return PaginatedResponseClass;
}
