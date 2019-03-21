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
        image1(@Arg("width") width: number, @Arg("height") height: number): string {
          return `http://lorempixel.com/${width}/${height}/`;
        }
        @Field()
        image2(@Args(type => ImageArgs) args: any): string {
          return `http://lorempixel.com/${args.width}/${args.height}/`;
        }
      }

      @ObjectType({ implements: Article })
      class WebArticle extends Article {
        @Field()
        url: string;

        @Field()
        image3(@Arg("width") width: number, @Arg("height") height: number): string {
          return `http://lorempixel.com/${width}/${height}/`;
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

    it("should have arguments for the interface field 'image1' with @Arg() decorator", async () => {
      const image1Field = (schemaIntrospection.types.find(
        type => type.name === "Article",
      ) as IntrospectionInterfaceType).fields.find(f => f.name === "image1") as IntrospectionField;

      expect(image1Field.args).toBeDefined();
      expect(image1Field.args.length).toEqual(2);
      expect(image1Field.args.every(arg => ["width", "height"].includes(arg.name))).toBeTruthy();
    });

    it("should have arguments for the interface field 'image2' with @Args() decorator", async () => {
      const image1Field = (schemaIntrospection.types.find(
        type => type.name === "Article",
      ) as IntrospectionInterfaceType).fields.find(f => f.name === "image2") as IntrospectionField;

      expect(image1Field.args).toBeDefined();
      expect(image1Field.args.length).toEqual(2);
      expect(image1Field.args.every(arg => ["width", "height"].includes(arg.name))).toBeTruthy();
    });

    it("should have arguments for the object field 'image3'", async () => {
      const image1Field = (schemaIntrospection.types.find(
        type => type.name === "WebArticle",
      ) as IntrospectionInterfaceType).fields.find(f => f.name === "image3") as IntrospectionField;

      expect(image1Field.args).toBeDefined();
      expect(image1Field.args.length).toEqual(2);
      expect(image1Field.args.every(arg => ["width", "height"].includes(arg.name))).toBeTruthy();
    });
  });
});
