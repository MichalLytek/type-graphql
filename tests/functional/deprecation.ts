import "reflect-metadata";
import type { GraphQLSchema, IntrospectionObjectType, IntrospectionSchema } from "graphql";
import { printType } from "graphql";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("Deprecation", () => {
  describe("Schema", () => {
    let schema: GraphQLSchema;
    let schemaIntrospection: IntrospectionSchema;
    let mutationType: IntrospectionObjectType;
    let queryType: IntrospectionObjectType;

    beforeAll(async () => {
      // Create sample definitions

      @ObjectType()
      class SampleObject {
        @Field()
        normalField: string;

        @Field({ deprecationReason: "sample object field deprecation reason" })
        deprecatedField: string;

        @Field({ deprecationReason: "sample object getter field deprecation reason" })
        get deprecatedGetterField(): string {
          return "deprecatedGetterField";
        }

        @Field({ deprecationReason: "sample object method field deprecation reason" })
        methodField(): string {
          return "methodField";
        }
      }

      @InputType()
      class SampleInput {
        @Field()
        normalField: string;

        @Field({
          deprecationReason: "sample input field deprecation reason",
          nullable: true,
        })
        deprecatedField: string;
      }

      @ArgsType()
      class SampleArgs {
        @Field()
        normalArg: string;

        @Field({
          deprecationReason: "sample args field deprecation reason",
          nullable: true,
        })
        deprecatedArg: string;
      }

      @Resolver(() => SampleObject)
      class SampleResolver {
        @Query()
        normalQuery(): SampleObject {
          return {} as SampleObject;
        }

        @Query()
        inputQuery(@Arg("input") _input: SampleInput): SampleObject {
          return {} as SampleObject;
        }

        @Query()
        argsQuery(@Args() _args: SampleArgs): SampleObject {
          return {} as SampleObject;
        }

        @Query()
        deprecatedArgQuery(
          @Arg("arg", {
            deprecationReason: "sample query arg deprecation reason",
            nullable: true,
          })
          _arg?: string,
        ): SampleObject {
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
      schema = schemaInfo.schema;
      schemaIntrospection = schemaInfo.schemaIntrospection;
      queryType = schemaInfo.queryType;
      mutationType = schemaInfo.mutationType!;
    });

    it("should generate proper object fields deprecation reason", async () => {
      const sampleObjectType = schemaIntrospection.types.find(
        type => type.name === "SampleObject",
      ) as IntrospectionObjectType;
      const normalField = sampleObjectType.fields.find(field => field.name === "normalField")!;
      const deprecatedField = sampleObjectType.fields.find(
        field => field.name === "deprecatedField",
      )!;
      const deprecatedGetterField = sampleObjectType.fields.find(
        field => field.name === "deprecatedGetterField",
      )!;
      const methodField = sampleObjectType.fields.find(field => field.name === "methodField")!;

      expect(normalField.isDeprecated).toBeFalsy();
      expect(normalField.deprecationReason).toBeNull();
      expect(deprecatedField.isDeprecated).toBeTruthy();
      expect(deprecatedField.deprecationReason).toEqual("sample object field deprecation reason");
      expect(deprecatedGetterField.isDeprecated).toBeTruthy();
      expect(deprecatedGetterField.deprecationReason).toEqual(
        "sample object getter field deprecation reason",
      );
      expect(methodField.isDeprecated).toBeTruthy();
      expect(methodField.deprecationReason).toEqual(
        "sample object method field deprecation reason",
      );
    });

    it("should generate proper input type fields deprecation reason", async () => {
      const sampleInputType = schema.getType("SampleInput")!;
      const sampleInputTypeSDL = printType(sampleInputType);

      expect(sampleInputTypeSDL).toMatchInlineSnapshot(`
        "input SampleInput {
          normalField: String!
          deprecatedField: String @deprecated(reason: "sample input field deprecation reason")
        }"
      `);
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

    it("should generate proper single arg deprecation reason", async () => {
      const queryObjectType = schema.getQueryType()!;
      const queryObjectTypeSDL = printType(queryObjectType);

      expect(queryObjectTypeSDL).toContain(
        'deprecatedArgQuery(arg: String @deprecated(reason: "sample query arg deprecation reason"))',
      );
    });

    it("should generate proper args type fields deprecation reason", async () => {
      const queryObjectType = schema.getQueryType()!;
      const queryObjectTypeSDL = printType(queryObjectType);

      expect(queryObjectTypeSDL).toContain(
        'argsQuery(normalArg: String!, deprecatedArg: String @deprecated(reason: "sample args field deprecation reason")): SampleObject!',
      );
    });
  });
});
