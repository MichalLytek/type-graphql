import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import * as fse from "fs-extra";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {
  buildSchema,
  buildSchemaSync,
  emitSchemaDefinitionFile,
  emitSchemaDefinitionFileSync,
  Field,
  ObjectType,
  Query,
  Resolver,
} from "../../src";

const TEST_DIR = path.join(os.tmpdir(), "type-graphql", "test-output");
jest.spyOn(process, "cwd").mockImplementation(() => TEST_DIR);

describe("Emitting schema definition file", () => {
  let schema: GraphQLSchema;
  let MyResolverClass: any;

  beforeEach(done => {
    fse.emptyDir(TEST_DIR, done);
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

  afterEach(done => fse.remove(TEST_DIR, done));

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
      const targetPath = path.join(TEST_DIR, "schemas", "test1", "schema.gql");
      console.log("targetPath", targetPath);
      await emitSchemaDefinitionFile(targetPath, schema);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });
  });

  describe("emitSchemaDefinitionFileSync", () => {
    it("should call writing file with schema SDL", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test2", "schema.gql");
      emitSchemaDefinitionFileSync(targetPath, schema);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });
  });

  describe("buildSchema", () => {
    it("should generate schema SDL file on selected file path", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test3", "schema.gql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should generate schema SDL file in current working dir", async () => {
      const targetPath = path.join(process.cwd(), "schema.gql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: true,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should read EmitSchemaFileOptions and apply them in emit", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test5", "schema.gql");
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
      const targetPath = path.join(process.cwd(), "schema.gql");
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
    it("should synchronously generate schema SDL file on selected file path", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test7", "schema.gql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should generate schema SDL file in current working dir", async () => {
      const targetPath = path.join(process.cwd(), "schema.gql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: true,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should read EmitSchemaFileOptions and apply them in emit", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test9", "schema.gql");
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
      const targetPath = path.join(process.cwd(), "schema.gql");
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
