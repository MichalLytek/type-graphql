import "reflect-metadata";
import { IntrospectionSchema } from "graphql";
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
});
