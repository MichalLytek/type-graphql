import "reflect-metadata";
import type { GraphQLSchema } from "graphql";
import { printType } from "graphql";
import type { Class } from "type-graphql";
import {
  Arg,
  Field,
  InputType,
  Query,
  Resolver,
  buildSchema,
  getMetadataStorage,
} from "type-graphql";
import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("default values", () => {
  describe("dynamic default value", () => {
    let sampleResolver: Class;
    beforeAll(async () => {
      getMetadataStorage().clear();

      @InputType()
      class SampleInput {
        @Field()
        sampleField: Date = new Date();
      }

      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(@Arg("input") _input: SampleInput): string {
          return "sampleQuery";
        }
      }
      sampleResolver = SampleResolver;

      await getSchemaInfo({
        resolvers: [SampleResolver],
      });
    });

    it("should not throw error when schema with dynamic default has been built again", async () => {
      await expect(buildSchema({ resolvers: [sampleResolver] })).resolves.not.toThrow();
    });
  });

  describe("when disableInferringDefaultValues is set", () => {
    let schema: GraphQLSchema;

    beforeEach(async () => {
      getMetadataStorage().clear();
      @InputType()
      class SampleInitializerInput {
        @Field()
        inputField: string = "defaultValueFromPropertyInitializer";
      }

      @InputType()
      class SampleOptionInput {
        @Field({ defaultValue: "defaultValueFromOption" })
        inputField: string;
      }

      @Resolver()
      class SampleResolver {
        @Query()
        sampleQuery(
          @Arg("input1") _input1: SampleInitializerInput,
          @Arg("input2") _input2: SampleOptionInput,
        ): string {
          return "sampleQuery";
        }
      }
      schema = await buildSchema({
        resolvers: [SampleResolver],
        disableInferringDefaultValues: true,
      });
    });

    it("should not infer default value from a property initializer", async () => {
      const sampleInitializerInputType = schema.getType("SampleInitializerInput")!;
      const sampleInitializerInputSDL = printType(sampleInitializerInputType);

      expect(sampleInitializerInputSDL).toMatchInlineSnapshot(`
        "input SampleInitializerInput {
          inputField: String!
        }"
      `);
    });

    it("should read default value from a decorator option", async () => {
      const sampleOptionInputType = schema.getType("SampleOptionInput")!;
      const sampleOptionInputSDL = printType(sampleOptionInputType);

      expect(sampleOptionInputSDL).toMatchInlineSnapshot(`
        "input SampleOptionInput {
          inputField: String! = "defaultValueFromOption"
        }"
      `);
    });
  });

  describe("with nullable settings", () => {
    describe("when `nullable: false` and defaultValue is provided", () => {
      let schema: GraphQLSchema;

      beforeEach(async () => {
        getMetadataStorage().clear();
        @InputType()
        class SampleInput {
          @Field({ defaultValue: "stringDefaultValue", nullable: false })
          inputField: string;
        }

        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(@Arg("input") _input: SampleInput): string {
            return "sampleQuery";
          }
        }
        schema = await buildSchema({ resolvers: [SampleResolver] });
      });

      it("should emit field of type non-nullable string with default value", async () => {
        const sampleInputType = schema.getType("SampleInput")!;
        const sampleInputSDL = printType(sampleInputType);

        expect(sampleInputSDL).toMatchInlineSnapshot(`
          "input SampleInput {
            inputField: String! = "stringDefaultValue"
          }"
        `);
      });
    });

    describe("when `nullable: true` and defaultValue is provided", () => {
      let schema: GraphQLSchema;

      beforeEach(async () => {
        getMetadataStorage().clear();
        @InputType()
        class SampleInput {
          @Field({ defaultValue: "stringDefaultValue", nullable: true })
          inputField: string;
        }

        @Resolver()
        class SampleResolver {
          @Query()
          sampleQuery(@Arg("input") _input: SampleInput): string {
            return "sampleQuery";
          }
        }
        schema = await buildSchema({ resolvers: [SampleResolver] });
      });

      it("should emit field of type nullable string with default value", async () => {
        const sampleInputType = schema.getType("SampleInput")!;
        const sampleInputSDL = printType(sampleInputType);

        expect(sampleInputSDL).toMatchInlineSnapshot(`
          "input SampleInput {
            inputField: String = "stringDefaultValue"
          }"
        `);
      });
    });

    describe("when `nullableByDefault: true`", () => {
      describe("when defaultValue is provided", () => {
        let schema: GraphQLSchema;

        beforeEach(async () => {
          getMetadataStorage().clear();
          @InputType()
          class SampleInput {
            @Field({ defaultValue: "stringDefaultValue" })
            inputField: string;
          }

          @Resolver()
          class SampleResolver {
            @Query()
            sampleQuery(@Arg("input") _input: SampleInput): string {
              return "sampleQuery";
            }
          }
          schema = await buildSchema({
            resolvers: [SampleResolver],
            nullableByDefault: true,
          });
        });

        it("should emit field of type nullable string with default value", async () => {
          const sampleInputType = schema.getType("SampleInput")!;
          const sampleInputSDL = printType(sampleInputType);

          expect(sampleInputSDL).toMatchInlineSnapshot(`
            "input SampleInput {
              inputField: String = "stringDefaultValue"
            }"
          `);
        });
      });

      describe("when `nullable: false` and defaultValue is provided", () => {
        let schema: GraphQLSchema;

        beforeEach(async () => {
          getMetadataStorage().clear();
          @InputType()
          class SampleInput {
            @Field({ defaultValue: "stringDefaultValue", nullable: false })
            inputField: string;
          }

          @Resolver()
          class SampleResolver {
            @Query()
            sampleQuery(@Arg("input") _input: SampleInput): string {
              return "sampleQuery";
            }
          }
          schema = await buildSchema({
            resolvers: [SampleResolver],
            nullableByDefault: true,
          });
        });

        it("should emit field of type non-nullable string with default value", async () => {
          const sampleInputType = schema.getType("SampleInput")!;
          const sampleInputSDL = printType(sampleInputType);

          expect(sampleInputSDL).toMatchInlineSnapshot(`
            "input SampleInput {
              inputField: String! = "stringDefaultValue"
            }"
          `);
        });
      });
    });
  });
});
