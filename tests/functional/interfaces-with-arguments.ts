import "reflect-metadata";
import { getMetadataStorage } from "../../src/metadata/getMetadataStorage";
import {
  IntrospectionSchema,
  IntrospectionObjectType,
  IntrospectionInterfaceType,
  IntrospectionField,
  GraphQLSchema,
  graphql,
} from "graphql";
import { getSchemaInfo } from "../helpers/getSchemaInfo";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  ID,
  Int,
  InterfaceType,
  ObjectType,
  Query,
  Resolver,
  buildSchema,
} from "../../src";

describe("Interfaces with arguments", () => {
  describe("Schema", () => {
    let schemaIntrospection: IntrospectionSchema;

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

      @Resolver()
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

  describe("Functional", () => {
    const getImageUrl = (width: number, height: number) =>
      `http://lorempixel.com/${width}/${height}/`;
    let schema: GraphQLSchema;

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
        constructor(id: string) {
          this.id = id;
        }

        @Field()
        interfaceFieldInlineArguments(
          @Arg("width") width: number,
          @Arg("height") height: number,
        ): string {
          return getImageUrl(width, height);
        }
        @Field()
        interfaceFieldArgumentsType(@Args(type => ImageArgs) args: any): string {
          return getImageUrl(args.width, args.height);
        }
      }

      @ObjectType({ implements: Article })
      class WebArticle extends Article {
        @Field()
        url: string;
        constructor(id: string, url: string) {
          super(id);
          this.url = url;
        }

        @Field()
        implemetingObjectTypeFieldInlineArguments(
          @Arg("width") width: number,
          @Arg("height") height: number,
        ): string {
          return getImageUrl(width, height);
        }
        @Field()
        implemetingObjectTypeFieldArgumentsType(@Args(type => ImageArgs) args: any): string {
          return getImageUrl(args.width, args.height);
        }
      }

      @Resolver()
      class SampleResolver {
        @Query(returns => [Article])
        sampleQuery(): Article[] {
          return [new WebArticle("fake123456", "http://fake.domain.com/dummy-article")];
        }
      }

      schema = await buildSchema({
        resolvers: [SampleResolver],
      });
    });

    it("should build the schema without errors", () => {
      expect(schema).toBeDefined();
    });

    it("should properly resolve interfaceFieldInlineArguments", async () => {
      const query = `query {
        sampleQuery {
          interfaceFieldInlineArguments(width: 200, height: 200)
        }
      }`;

      const response = await graphql(schema, query);

      const result = response.data!.sampleQuery;
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].interfaceFieldInlineArguments).toEqual(getImageUrl(200, 200));
    });

    it("should properly resolve interfaceFieldArgumentsType", async () => {
      const query = `query {
        sampleQuery {
          interfaceFieldArgumentsType(width: 200, height: 200)
        }
      }`;

      const response = await graphql(schema, query);

      const result = response.data!.sampleQuery;
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].interfaceFieldArgumentsType).toEqual(getImageUrl(200, 200));
    });

    it("should properly resolve implemetingObjectTypeFieldInlineArguments", async () => {
      const query = `query {
        sampleQuery {
          ... on WebArticle {
            implemetingObjectTypeFieldInlineArguments(width: 200, height: 200)
          }
        }
      }`;

      const response = await graphql(schema, query);

      const result = response.data!.sampleQuery;
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].implemetingObjectTypeFieldInlineArguments).toEqual(getImageUrl(200, 200));
    });

    it("should properly resolve implemetingObjectTypeFieldArgumentsType", async () => {
      const query = `query {
        sampleQuery {
          ... on WebArticle {
            implemetingObjectTypeFieldArgumentsType(width: 200, height: 200)
          }
        }
      }`;

      const response = await graphql(schema, query);

      const result = response.data!.sampleQuery;
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].implemetingObjectTypeFieldArgumentsType).toEqual(getImageUrl(200, 200));
    });
  });
});
