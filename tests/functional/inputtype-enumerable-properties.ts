import "reflect-metadata";
import { type GraphQLSchema, graphql } from "graphql";
import { Arg, Field, InputType, Query, Resolver, buildSchema } from "type-graphql";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";

describe("InputType enumerable properties", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    getMetadataStorage().clear();

    @InputType()
    class SampleInput {
      @Field()
      requiredField!: string;

      @Field({ nullable: true })
      optionalField?: string;

      @Field({ nullable: true })
      anotherOptional?: number;
    }

    @InputType()
    class NestedInput {
      @Field({ nullable: true })
      optionalNested?: string;
    }

    @InputType()
    class ParentInput {
      @Field()
      required!: string;

      @Field(() => NestedInput, { nullable: true })
      nested?: NestedInput;
    }

    @Resolver()
    class SampleResolver {
      @Query(() => String)
      testSimpleInput(@Arg("input") input: SampleInput): string {
        return JSON.stringify({
          keys: Object.keys(input),
          hasOptional: "optionalField" in input,
          hasAnother: "anotherOptional" in input,
          optionalValue: input.optionalField,
        });
      }

      @Query(() => String)
      testNestedInput(@Arg("input") input: ParentInput): string {
        return JSON.stringify({
          keys: Object.keys(input),
          hasNested: "nested" in input,
        });
      }
    }

    schema = await buildSchema({
      resolvers: [SampleResolver],
      validate: false,
    });
  });

  describe("optional fields not provided", () => {
    it("should not create enumerable properties for undefined optional fields", async () => {
      const query = `
        query {
          testSimpleInput(input: { requiredField: "test" })
        }
      `;

      const result = await graphql({ schema, source: query });

      expect(result.errors).toBeUndefined();
      expect(result.data).toBeDefined();

      const data = JSON.parse(result.data!.testSimpleInput as string);

      // Only requiredField should be in Object.keys()
      expect(data.keys).toEqual(["requiredField"]);

      // Optional fields should not be enumerable
      expect(data.hasOptional).toBe(false);
      expect(data.hasAnother).toBe(false);

      // But should still be accessible (undefined)
      expect(data.optionalValue).toBeUndefined();
    });

    it("should handle nested InputTypes correctly", async () => {
      const query = `
        query {
          testNestedInput(input: { required: "value" })
        }
      `;

      const result = await graphql({ schema, source: query });

      expect(result.errors).toBeUndefined();
      expect(result.data).toBeDefined();

      const data = JSON.parse(result.data!.testNestedInput as string);

      // Only required field should be enumerable
      expect(data.keys).toEqual(["required"]);

      // Nested optional field should not be enumerable
      expect(data.hasNested).toBe(false);
    });
  });

  describe("optional fields provided", () => {
    it("should include provided optional fields in Object.keys()", async () => {
      const query = `
        query {
          testSimpleInput(input: { requiredField: "test", optionalField: "provided" })
        }
      `;

      const result = await graphql({ schema, source: query });

      expect(result.errors).toBeUndefined();
      expect(result.data).toBeDefined();

      const data = JSON.parse(result.data!.testSimpleInput as string);

      // Both provided fields should be in Object.keys()
      expect(data.keys).toContain("requiredField");
      expect(data.keys).toContain("optionalField");

      // Provided field should be enumerable
      expect(data.hasOptional).toBe(true);

      // Non-provided field should not be enumerable
      expect(data.hasAnother).toBe(false);

      // Value should be set
      expect(data.optionalValue).toBe("provided");
    });

    it("should handle explicitly null values correctly", async () => {
      const query = `
        query {
          testSimpleInput(input: { requiredField: "test", optionalField: null })
        }
      `;

      const result = await graphql({ schema, source: query });

      expect(result.errors).toBeUndefined();
      expect(result.data).toBeDefined();

      const data = JSON.parse(result.data!.testSimpleInput as string);

      // Explicitly null field should be in Object.keys()
      expect(data.keys).toContain("requiredField");
      expect(data.keys).toContain("optionalField");

      // Should be enumerable
      expect(data.hasOptional).toBe(true);

      // Value should be null (not undefined)
      expect(data.optionalValue).toBeNull();
    });
  });
});
