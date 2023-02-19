import { ClassType, Field, Int, ObjectType } from "type-graphql";

export function PaginatedResponse<TItemsFieldValue>(
  itemsFieldValue: ClassType<TItemsFieldValue> | string | number | boolean,
) {
  @ObjectType()
  abstract class PaginatedResponseClass {
    @Field(_type => [itemsFieldValue])
    items: TItemsFieldValue[];

    @Field(_type => Int)
    total: number;

    @Field()
    hasMore: boolean;
  }

  return PaginatedResponseClass;
}
