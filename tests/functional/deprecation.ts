import "reflect-metadata";
import { IntrospectionSchema, IntrospectionObjectType } from "graphql";

import { ObjectType, Resolver, Field, Query, Mutation } from "../../src";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("Deprecation", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;
    let mutationType: IntrospectionObjectType;
    let queryType: IntrospectionObjectType;

    beforeAll(async () => {
      // create sample definitions

      @ObjectType()
      class SampleObject {
        @Field()
        normalField: string;

        @Field({ deprecationReason: "sample object field deprecation reason" })
        describedField: string;

        @Field({ deprecationReason: "sample object getter field deprecation reason" })
        get describedGetterField(): string {
          return "describedGetterField";
        }

        @Field({ deprecationReason: "sample object method field deprecation reason" })
        methodField(): string {
          return "methodField";
        }
      }

      @Resolver(of => SampleObject)
      class SampleResolver {
        @Query()
        normalQuery(): SampleObject {
          return {} as SampleObject;
        }

        @Query({ deprecationReason: "sample query deprecation reason" })
        describedQuery(): string {
          return "describedQuery";
        }

        @Mutation()
        normalMutation(): string {
          return "normalMutation";
        }

        @Mutation({ deprecationReason: "sample mutation deprecation reason" })
        describedMutation(): string {
          return "describedMutation";
        }
      }

      // get builded schema info from retrospection
      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
      });
      schemaIntrospection = schemaInfo.schemaIntrospection;
      queryType = schemaInfo.queryType;
      mutationType = schemaInfo.mutationType!;
    });

    it("should generate proper object fields deprecation reason", async () => {
      const sampleObjectType = schemaIntrospection.types.find(
        type => type.name === "SampleObject",
      ) as IntrospectionObjectType;
      const normalField = sampleObjectType.fields.find(field => field.name === "normalField")!;
      const describedField = sampleObjectType.fields.find(
        field => field.name === "describedField",
      )!;
      const describedGetterField = sampleObjectType.fields.find(
        field => field.name === "describedGetterField",
      )!;
      const methodField = sampleObjectType.fields.find(field => field.name === "methodField")!;

      expect(normalField.isDeprecated).toBeFalsy();
      expect(normalField.deprecationReason).toBeNull();
      expect(describedField.isDeprecated).toBeTruthy();
      expect(describedField.deprecationReason).toEqual("sample object field deprecation reason");
      expect(describedGetterField.isDeprecated).toBeTruthy();
      expect(describedGetterField.deprecationReason).toEqual(
        "sample object getter field deprecation reason",
      );
      expect(methodField.isDeprecated).toBeTruthy();
      expect(methodField.deprecationReason).toEqual(
        "sample object method field deprecation reason",
      );
    });

    it("should generate proper query type deprecation reason", async () => {
      const normalQuery = queryType.fields.find(field => field.name === "normalQuery")!;
      const describedQuery = queryType.fields.find(field => field.name === "describedQuery")!;

      expect(normalQuery.isDeprecated).toBeFalsy();
      expect(normalQuery.deprecationReason).toBeNull();
      expect(describedQuery.isDeprecated).toBeTruthy();
      expect(describedQuery.deprecationReason).toEqual("sample query deprecation reason");
    });

    it("should generate proper mutation type deprecation reason", async () => {
      const normalMutation = mutationType.fields.find(field => field.name === "normalMutation")!;
      const describedMutation = mutationType.fields.find(
        field => field.name === "describedMutation",
      )!;

      expect(normalMutation.isDeprecated).toBeFalsy();
      expect(normalMutation.deprecationReason).toBeNull();
      expect(describedMutation.isDeprecated).toBeTruthy();
      expect(describedMutation.deprecationReason).toEqual("sample mutation deprecation reason");
    });
  });
});
