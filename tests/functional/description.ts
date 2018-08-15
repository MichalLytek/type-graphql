import "reflect-metadata";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionInputObjectType,
} from "graphql";

import {
  ObjectType,
  ArgsType,
  InputType,
  Resolver,
  Field,
  Query,
  Mutation,
  Arg,
  Args,
} from "../../src";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("Description", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;
    let mutationType: IntrospectionObjectType;
    let queryType: IntrospectionObjectType;

    beforeAll(async () => {
      // create sample definitions

      @ObjectType({ description: "sample object description" })
      class SampleObject {
        @Field()
        normalField: string;

        @Field({ description: "sample object field description" })
        describedField: string;

        @Field({ description: "sample object getter field description" })
        get describedGetterField(): string {
          return "describedGetterField";
        }

        @Field({ description: "sample object method field description" })
        methodField(
          @Arg("arg", { description: "sample object method arg description" }) arg: string,
        ): string {
          return "methodField";
        }
      }

      @InputType({ description: "sample input description" })
      class SampleInput {
        @Field()
        normalField: string;

        @Field({ description: "sample input field description" })
        describedField: string;
      }

      @ArgsType()
      class SampleArguments {
        @Field()
        normalField: string;

        @Field({ description: "sample argument field description" })
        describedField: string;
      }

      @Resolver(of => SampleObject)
      class SampleResolver {
        @Query()
        normalQuery(): string {
          return "normalQuery";
        }

        @Query({ description: "sample query description" })
        describedQuery(
          @Arg("normalArg") normalArg: string,
          @Arg("describedArg", { description: "sample query arg description" })
          describedArg: string,
        ): string {
          return "describedQuery";
        }

        @Query()
        argumentedQuery(@Args() args: SampleArguments): string {
          return "argumentedQuery";
        }

        @Query()
        inputQuery(@Arg("input") input: SampleInput): string {
          return "inputQuery";
        }

        @Mutation()
        normalMutation(): string {
          return "normalMutation";
        }

        @Mutation({ description: "sample mutation description" })
        describedMutation(
          @Arg("normalArg") normalArg: string,
          @Arg("describedArg", { description: "sample mutation arg description" })
          describedArg: string,
        ): string {
          return "describedMutation";
        }

        @Mutation()
        argumentedMutation(@Args() args: SampleArguments): string {
          return "argumentedMutation";
        }

        @Mutation()
        inputMutation(@Arg("input") input: SampleInput): string {
          return "inputMutation";
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

    it("should generate proper object type description", async () => {
      const sampleObjectType = schemaIntrospection.types.find(
        type => type.name === "SampleObject",
      ) as IntrospectionObjectType;

      expect(sampleObjectType.description).toEqual("sample object description");
    });

    it("should generate proper object fields descriptions", async () => {
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

      expect(normalField.description).toBeNull();
      expect(describedField.description).toEqual("sample object field description");
      expect(describedGetterField.description).toEqual("sample object getter field description");
      expect(methodField.description).toEqual("sample object method field description");
    });

    it("should generate proper query type description", async () => {
      const normalQuery = queryType.fields.find(field => field.name === "normalQuery")!;
      const describedQuery = queryType.fields.find(field => field.name === "describedQuery")!;

      expect(normalQuery.description).toBeNull();
      expect(describedQuery.description).toEqual("sample query description");
    });

    it("should generate proper query inline args description", async () => {
      const describedQuery = queryType.fields.find(field => field.name === "describedQuery")!;
      const normalArg = describedQuery.args.find(arg => arg.name === "normalArg")!;
      const describedArg = describedQuery.args.find(arg => arg.name === "describedArg")!;

      expect(describedQuery.args).toHaveLength(2);
      expect(normalArg.description).toBeNull();
      expect(describedArg.description).toEqual("sample query arg description");
    });

    it("should generate proper query object args description", async () => {
      const argumentedQuery = queryType.fields.find(field => field.name === "argumentedQuery")!;
      const normalField = argumentedQuery.args.find(arg => arg.name === "normalField")!;
      const describedField = argumentedQuery.args.find(arg => arg.name === "describedField")!;

      expect(argumentedQuery.args).toHaveLength(2);
      expect(normalField.description).toBeNull();
      expect(describedField.description).toEqual("sample argument field description");
    });

    it("should generate proper mutation type description", async () => {
      const normalMutation = mutationType.fields.find(field => field.name === "normalMutation")!;
      const describedMutation = mutationType.fields.find(
        field => field.name === "describedMutation",
      )!;

      expect(normalMutation.description).toBeNull();
      expect(describedMutation.description).toEqual("sample mutation description");
    });

    it("should generate proper mutation inline args description", async () => {
      const describedQuery = mutationType.fields.find(field => field.name === "describedMutation")!;
      const normalArg = describedQuery.args.find(arg => arg.name === "normalArg")!;
      const describedArg = describedQuery.args.find(arg => arg.name === "describedArg")!;

      expect(describedQuery.args).toHaveLength(2);
      expect(normalArg.description).toBeNull();
      expect(describedArg.description).toEqual("sample mutation arg description");
    });

    it("should generate proper mutation object args description", async () => {
      const argumentedMutation = mutationType.fields.find(
        field => field.name === "argumentedMutation",
      )!;
      const normalField = argumentedMutation.args.find(arg => arg.name === "normalField")!;
      const describedField = argumentedMutation.args.find(arg => arg.name === "describedField")!;

      expect(argumentedMutation.args).toHaveLength(2);
      expect(normalField.description).toBeNull();
      expect(describedField.description).toEqual("sample argument field description");
    });

    it("should generate proper input type description", async () => {
      const sampleInputType = schemaIntrospection.types.find(
        type => type.name === "SampleInput",
      ) as IntrospectionInputObjectType;

      expect(sampleInputType.description).toEqual("sample input description");
    });

    it("should generate proper input fields description", async () => {
      const sampleInputType = schemaIntrospection.types.find(
        type => type.name === "SampleInput",
      ) as IntrospectionInputObjectType;
      const normalField = sampleInputType.inputFields.find(field => field.name === "normalField")!;
      const describedField = sampleInputType.inputFields.find(
        field => field.name === "describedField",
      )!;

      expect(normalField.description).toBeNull();
      expect(describedField.description).toEqual("sample input field description");
    });
  });
});
