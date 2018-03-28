import "reflect-metadata";
import {
  GraphQLSchema,
  IntrospectionObjectType,
  IntrospectionSchema,
  TypeKind,
  IntrospectionListTypeRef,
  IntrospectionNonNullTypeRef,
  IntrospectionNamedTypeRef,
} from "graphql";

import { Subscription, Resolver, Query, Arg, ObjectType, Field } from "../../src";
import { MetadataStorage } from "../../src/metadata/metadata-storage";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { getInnerTypeOfNonNullableType, getItemTypeOfList } from "../helpers/getInnerFieldType";

describe("Subscriptions", () => {
  describe("Schema", () => {
    let schema: GraphQLSchema;
    let schemaIntrospection: IntrospectionSchema;
    let subscriptionType: IntrospectionObjectType;

    beforeAll(async () => {
      MetadataStorage.clear();

      @ObjectType()
      class SampleObject {
        @Field() sampleField: string;
      }

      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(): boolean {
          return true;
        }
        @Subscription()
        sampleSubscription(): boolean {
          return true;
        }

        @Subscription()
        subscriptionWithArgs(
          @Arg("stringArg") stringArg: string,
          @Arg("booleanArg") booleanArg: boolean,
        ): boolean {
          return true;
        }

        @Subscription(returns => [SampleObject])
        subscriptionWithExplicitType(): any {
          return true;
        }
      }
      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
      });
      schema = schemaInfo.schema;
      schemaIntrospection = schemaInfo.schemaIntrospection;
      subscriptionType = schemaInfo.subscriptionType!;
    });

    it("should build schema without errors", () => {
      expect(schema).toBeDefined();
    });

    it("should correctly generate simple subscription type", () => {
      const sampleSubscription = subscriptionType.fields.find(
        field => field.name === "sampleSubscription",
      )!;
      const sampleSubscriptionType = getInnerTypeOfNonNullableType(sampleSubscription);

      expect(sampleSubscription).toBeDefined();
      expect(sampleSubscription.args).toHaveLength(0);
      expect(sampleSubscriptionType.kind).toEqual(TypeKind.SCALAR);
      expect(sampleSubscriptionType.name).toEqual("Boolean");
    });

    it("should correctly generate type of subscription with args", () => {
      const subscriptionWithArgs = subscriptionType.fields.find(
        field => field.name === "subscriptionWithArgs",
      )!;
      const subscriptionWithArgsType = getInnerTypeOfNonNullableType(subscriptionWithArgs);

      expect(subscriptionWithArgs).toBeDefined();
      expect(subscriptionWithArgs.args).toHaveLength(2);
      expect(subscriptionWithArgsType.kind).toEqual(TypeKind.SCALAR);
      expect(subscriptionWithArgsType.name).toEqual("Boolean");
    });

    it("should correctly generate type of subscription with explicit type", () => {
      const subscriptionWithExplicitType = subscriptionType.fields.find(
        field => field.name === "subscriptionWithExplicitType",
      )!;
      const innerType = getInnerTypeOfNonNullableType(subscriptionWithExplicitType);
      const itemType = getItemTypeOfList(subscriptionWithExplicitType);

      expect(subscriptionWithExplicitType).toBeDefined();
      expect(subscriptionWithExplicitType.args).toHaveLength(0);
      expect(innerType.kind).toEqual(TypeKind.LIST);
      expect(itemType.kind).toEqual(TypeKind.OBJECT);
      expect(itemType.name).toEqual("SampleObject");
    });
  });
});
