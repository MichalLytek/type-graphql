import "reflect-metadata";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionInterfaceType,
  IntrospectionField,
} from "graphql";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import { ArgsType, Field, Int, InterfaceType, ID, Query, ObjectType, Arg, Args } from "../../src";

describe("Interfaces with arguments", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;
    let queryType: IntrospectionObjectType;

    beforeAll(async () => {
      getMetadataStorage().clear();

      @ArgsType()
      class ImageArgs {
        @Field(type => Int, { nullable: true })
        width?: number;
        @Field(type => Int, { nullable: true })
        height?: number;
      }

      @InterfaceType()
      abstract class Article {
        @Field(type => ID)
        id: string;
        @Field({ nullable: true })
        headline?: string;

        @Field()
        interfaceFieldInlineArguments(
          @Arg("width") width: number,
          @Arg("height") height: number,
        ): string {
          return `http://lorempixel.com/${width}/${height}/`;
        }
        @Field()
        interfaceFieldArgumentsType(@Args(type => ImageArgs) args: any): string {
          return `http://lorempixel.com/${args.width}/${args.height}/`;
        }
      }

      @ObjectType({ implements: Article })
      class WebArticle extends Article {
        @Field()
        url: string;

        @Field()
        implemetingObjectTypeFieldInlineArguments(
          @Arg("width") width: number,
          @Arg("height") height: number,
        ): string {
          return `http://lorempixel.com/${width}/${height}/`;
        }
        @Field()
        implemetingObjectTypeFieldArgumentsType(@Args(type => ImageArgs) args: any): string {
          return `http://lorempixel.com/${args.width}/${args.height}/`;
        }
      }

      class SampleResolver {
        @Query(returns => [Article])
        sampleQuery(): Article[] {
          return [];
        }
      }

      // get builded schema info from retrospection
      const schemaInfo = await getSchemaInfo({
        resolvers: [SampleResolver],
      });
      queryType = schemaInfo.queryType;
      schemaIntrospection = schemaInfo.schemaIntrospection;
    });

    it("should generate schema without errors", async () => {
      expect(schemaIntrospection).toBeDefined();
    });

    it("should have arguments for the interface field 'interfaceFieldInlineArguments' with @Arg() decorator", async () => {
      const sampleField = (schemaIntrospection.types.find(
        type => type.name === "Article",
      ) as IntrospectionInterfaceType).fields.find(
        f => f.name === "interfaceFieldInlineArguments",
      ) as IntrospectionField;

      expect(sampleField.args).toBeDefined();
      expect(sampleField.args.length).toEqual(2);
      expect(sampleField.args.every(arg => ["width", "height"].includes(arg.name))).toBeTruthy();
    });

    it("should have arguments for the interface field 'interfaceFieldArgumentsType' with @Args() decorator", async () => {
      const sampleField = (schemaIntrospection.types.find(
        type => type.name === "Article",
      ) as IntrospectionInterfaceType).fields.find(
        f => f.name === "interfaceFieldArgumentsType",
      ) as IntrospectionField;

      expect(sampleField.args).toBeDefined();
      expect(sampleField.args.length).toEqual(2);
      expect(sampleField.args.every(arg => ["width", "height"].includes(arg.name))).toBeTruthy();
    });

    it("should have arguments for the object field 'implemetingObjectTypeFieldInlineArguments'", async () => {
      const sampleField = (schemaIntrospection.types.find(
        type => type.name === "WebArticle",
      ) as IntrospectionInterfaceType).fields.find(
        f => f.name === "implemetingObjectTypeFieldInlineArguments",
      ) as IntrospectionField;

      expect(sampleField.args).toBeDefined();
      expect(sampleField.args.length).toEqual(2);
      expect(sampleField.args.every(arg => ["width", "height"].includes(arg.name))).toBeTruthy();
    });

    it("should have arguments for the object field 'implemetingObjectTypeFieldArgumentsType'", async () => {
      const sampleField = (schemaIntrospection.types.find(
        type => type.name === "WebArticle",
      ) as IntrospectionInterfaceType).fields.find(
        f => f.name === "implemetingObjectTypeFieldArgumentsType",
      ) as IntrospectionField;

      expect(sampleField.args).toBeDefined();
      expect(sampleField.args.length).toEqual(2);
      expect(sampleField.args.every(arg => ["width", "height"].includes(arg.name))).toBeTruthy();
    });
  });
});
