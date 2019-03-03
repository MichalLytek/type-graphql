import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import * as mockfs from "mock-fs";
import * as fs from "fs";
import * as path from "path";
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

describe("Emitting schema definition file", () => {
  let schema: GraphQLSchema;
  let MyResolverClass: any;

  beforeEach(() => {
    pathArg = undefined;
    contentArg = undefined;
    const travisBuildDir = process.env.TRAVIS_BUILD_DIR;
    if (typeof travisBuildDir === "string") {
      mockfs({ [travisBuildDir]: {} });
    } else {
      mockfs({});
    }
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

  afterEach(() => {
    mockfs.restore();
  });

  function checkSchemaSDL(contents: string, commentPrefix: "#" | `"""` = `"""`) {
    expect(contents).toContain("THIS FILE WAS GENERATED");
    expect(contents).toContain("MyObject");
    if (commentPrefix === `"""`) {
      expect(contents).toContain(`"""Description test"""`);
    } else {
      expect(contents).toContain(`# Description test`);
    }
  }

  describe("emitSchemaDefinitionFile", () => {
    it("should call writing file with schema SDL", async () => {
      const targetPath = path.resolve("testPath1");
      await emitSchemaDefinitionFile(targetPath, schema);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });
  });

  describe("emitSchemaDefinitionFileSync", () => {
    it("should call writing file with schema SDL", async () => {
      const targetPath = path.resolve("testPath2");
      emitSchemaDefinitionFileSync(targetPath, schema);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });
  });

  describe("buildSchema", () => {
    it("should generate schema SDL file on selected file path provided from path.resolve", async () => {
      const targetPath = path.resolve("testPath11");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should generate schema SDL file on selected file path provided from path.join", async () => {
      const targetPath = path.join(__dirname, "schemas", "graphql", "schema.qgl");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      const resolvedTargetPath = path.resolve(targetPath);
      expect(fs.existsSync(resolvedTargetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(resolvedTargetPath).toString());
    });

    it("should generate schema SDL file on selected file path provided in string", async () => {
      const targetPath = "schemas/graphql/schema.qgl";
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      const resolvedTargetPath = path.resolve(targetPath);
      expect(fs.existsSync(resolvedTargetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(resolvedTargetPath).toString());
    });

    it("should generate schema SDL file on selected file path provided from path.resolve", async () => {
      const targetPath = path.resolve("testPath11");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should generate schema SDL file on selected file path provided from path.resolve", async () => {
      const targetPath = path.resolve("testPath11");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should generate schema SDL file in current working dir", async () => {
      const targetPath = path.resolve(process.cwd(), "schema.gql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: true,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should read EmitSchemaFileOptions and apply them in emit", async () => {
      const targetPath = path.resolve("testPath12");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
          path: targetPath,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), "#");
    });

    it("should read EmitSchemaFileOptions and set default path", async () => {
      const targetPath = path.resolve(process.cwd(), "schema.gql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), "#");
    });
  });

  describe("buildSchemaSync", () => {
    it("should synchronously generate schema SDL file on selected file path provided from path.resolve", async () => {
      const targetPath = path.resolve("testPath11");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should synchronously generate schema SDL file on selected file path provided from path.join", async () => {
      const targetPath = path.join(__dirname, "schemas", "graphql", "schema.qgl");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      const resolvedTargetPath = path.resolve(targetPath);
      expect(fs.existsSync(resolvedTargetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(resolvedTargetPath).toString());
    });

    it("should synchronously generate schema SDL file on selected file path provided in string", async () => {
      const targetPath = "schemas/graphql/schema.qgl";
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      const resolvedTargetPath = path.resolve(targetPath);
      expect(fs.existsSync(resolvedTargetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(resolvedTargetPath).toString());
    });

    it("should generate schema SDL file in current working dir", async () => {
      const targetPath = path.resolve(process.cwd(), "schema.gql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: true,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should read EmitSchemaFileOptions and apply them in emit", async () => {
      const targetPath = path.resolve("testPath22");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
          path: targetPath,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), "#");
    });

    it("should read EmitSchemaFileOptions and set default path", async () => {
      const targetPath = path.resolve(process.cwd(), "schema.gql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), "#");
    });
  });
});
