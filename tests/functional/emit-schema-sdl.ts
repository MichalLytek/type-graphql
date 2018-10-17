import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import {
  Field,
  ObjectType,
  buildSchema,
  Query,
  Resolver,
  emitSchemaDefinitionFile,
  emitSchemaDefinitionFileSync,
  buildSchemaSync,
} from "../../src";

let pathArg: any;
let contentArg: any;

jest.mock("fs", () => ({
  writeFile: (path: any, content: any, callback: (err: any) => void) => {
    pathArg = path;
    contentArg = content;
    callback(null);
  },
  writeFileSync: (path: any, content: any) => {
    pathArg = path;
    contentArg = content;
  },
}));

describe("Emitting schema definition file", () => {
  let schema: GraphQLSchema;
  let MyResolverClass: any;

  beforeEach(() => {
    pathArg = undefined;
    contentArg = undefined;
  });

  beforeAll(async () => {
    @ObjectType()
    class MyObject {
      @Field()
      normalProperty: string;

      @Field({ description: "Description test" })
      descriptionProperty: boolean;
    }

    @Resolver()
    class MyResolver {
      @Query()
      myQuery(): MyObject {
        return {} as MyObject;
      }
    }
    MyResolverClass = MyResolver;

    schema = await buildSchema({
      resolvers: [MyResolver],
    });
  });

  function checkSchemaSDL() {
    expect(contentArg).toContain("THIS FILE WAS GENERATED");
    expect(contentArg).toContain("MyObject");
    expect(contentArg).toContain("# Description test");
  }

  describe("emitSchemaDefinitionFile", () => {
    it("should call writing file with schema SDL", async () => {
      await emitSchemaDefinitionFile("testPath1", schema);
      expect(pathArg).toEqual("testPath1");
      checkSchemaSDL();
    });
  });

  describe("emitSchemaDefinitionFileSync", () => {
    it("should call writing file with schema SDL", async () => {
      emitSchemaDefinitionFileSync("testPath2", schema);
      expect(pathArg).toEqual("testPath2");
      checkSchemaSDL();
    });
  });

  describe("buildSchema", () => {
    it("should generate schema SDL file on selected file path", async () => {
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: "testPath3",
      });
      expect(pathArg).toEqual("testPath3");
      checkSchemaSDL();
    });

    it("should generate schema SDL file in current working dir", async () => {
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: true,
      });
      expect(pathArg).toContain(process.cwd());
      expect(pathArg).toContain("schema.gql");
      checkSchemaSDL();
    });
  });

  describe("buildSchemaSync", () => {
    it("should generate schema SDL file on selected file path", async () => {
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: "testPath4",
      });
      expect(pathArg).toEqual("testPath4");
      checkSchemaSDL();
    });

    it("should generate schema SDL file in current working dir", async () => {
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: true,
      });
      expect(pathArg).toContain(process.cwd());
      expect(pathArg).toContain("schema.gql");
      checkSchemaSDL();
    });
  });
});
