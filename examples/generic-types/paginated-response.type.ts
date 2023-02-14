import { ClassType, Field, ObjectType, Int } from "type-graphql";

export function PaginatedResponse<TItemsFieldValue>(
  itemsFieldValue: ClassType<TItemsFieldValue> | string | number | boolean,
) {
  // 'isAbstract' decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
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
