import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import { join } from "path";
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
  existsSync: (path: any) => {
    pathArg = path;
  },
  mkdirSync: (path: any) => {
    pathArg = path;
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

  function checkSchemaSDL(commentPrefix: "#" | `"""` = `"""`) {
    expect(contentArg).toContain("THIS FILE WAS GENERATED");
    expect(contentArg).toContain("MyObject");
    if (commentPrefix === `"""`) {
      expect(contentArg).toContain(`"""Description test"""`);
    } else {
      expect(contentArg).toContain(`# Description test`);
    }
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
        emitSchemaFile: "testPath11",
      });
      expect(pathArg).toEqual("testPath11");
      checkSchemaSDL();
    });

    it("should generate schema SDL file on selected file path", async () => {
      const targetPath = join(__dirname, "schemas", "graphql", "schema.qgl");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(pathArg).toEqual(targetPath);
      checkSchemaSDL();
    });

    it("should generate schema SDL file on selected file path", async () => {
      const targetPath = "schemas/graphql/schema.qgl";
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(pathArg).toEqual(targetPath);
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

    it("should read EmitSchemaFileOptions and apply them in emit", async () => {
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
          path: "testPath12",
        },
      });
      expect(pathArg).toEqual("testPath12");
      checkSchemaSDL("#");
    });

    it("should read EmitSchemaFileOptions and set default path", async () => {
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
        },
      });
      expect(pathArg).toContain(process.cwd());
      expect(pathArg).toContain("schema.gql");
      checkSchemaSDL("#");
    });
  });

  describe("buildSchemaSync", () => {
    it("should generate schema SDL file on selected file path", async () => {
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: "testPath21",
      });
      expect(pathArg).toEqual("testPath21");
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

    it("should read EmitSchemaFileOptions and apply them in emit", async () => {
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
          path: "testPath22",
        },
      });
      expect(pathArg).toEqual("testPath22");
      checkSchemaSDL("#");
    });

    it("should read EmitSchemaFileOptions and set default path", async () => {
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
        },
      });
      expect(pathArg).toContain(process.cwd());
      expect(pathArg).toContain("schema.gql");
      checkSchemaSDL("#");
    });
  });
});
