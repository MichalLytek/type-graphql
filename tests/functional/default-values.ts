import "reflect-metadata";
import { GraphQLSchema, IntrospectionSchema, printType } from "graphql";
import {
  Arg,
  buildSchema,
  ClassType,
  Field,
  getMetadataStorage,
  InputType,
  Query,
  Resolver,
} from "../../src";

import { getSchemaInfo } from "../helpers/getSchemaInfo";

describe("default values", () => {
  describe("dynamic default value", () => {
    let schemaIntrospection: IntrospectionSchema;
    let sampleResolver: ClassType;
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
        sampleQuery(@Arg("input") input: SampleInput): string {
          return "sampleQuery";
        }
      }
      sampleResolver = SampleResolver;

      // get builded schema info from retrospection
      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
      });
      schemaIntrospection = schemaInfo.schemaIntrospection;
    });

    it("should not throw error when schema with dynamic default has been built again", async () => {
      await expect(buildSchema({ resolvers: [sampleResolver] })).resolves.not.toThrowError();
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
          sampleQuery(@Arg("input") input: SampleInput): string {
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
            inputField: String! = \\"stringDefaultValue\\"
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
          sampleQuery(@Arg("input") input: SampleInput): string {
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
            inputField: String = \\"stringDefaultValue\\"
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
            sampleQuery(@Arg("input") input: SampleInput): string {
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
              inputField: String = \\"stringDefaultValue\\"
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
            sampleQuery(@Arg("input") input: SampleInput): string {
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
              inputField: String! = \\"stringDefaultValue\\"
            }"
          `);
        });
      });
    });
  });
});
