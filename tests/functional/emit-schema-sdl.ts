import "reflect-metadata";
import fs from "node:fs";
import path from "node:path";
import { type GraphQLSchema } from "graphql";
import shelljs from "shelljs";
import {
  Field,
  ObjectType,
  type PrintSchemaOptions,
  Query,
  Resolver,
  buildSchema,
  buildSchemaSync,
  defaultPrintSchemaOptions,
  emitSchemaDefinitionFile,
  emitSchemaDefinitionFileSync,
} from "type-graphql";
import * as filesystem from "@/helpers/filesystem";
import { expectToThrow } from "../helpers/expectToThrow";

const TEST_DIR = path.resolve(process.cwd(), "tests", "test-output-dir");

describe("Emitting schema definition file", () => {
  let schema: GraphQLSchema;
  let MyResolverClass: any;

  beforeAll(async () => {
    @ObjectType()
    class MyObject {
      @Field()
      normalProperty!: string;

      @Field({ description: "Description test" })
      descriptionProperty!: boolean;
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
    jest.restoreAllMocks();
    shelljs.rm("-rf", TEST_DIR);
  });

  function checkSchemaSDL(
    SDL: string,
    { sortedSchema }: PrintSchemaOptions = defaultPrintSchemaOptions,
  ) {
    expect(SDL).toContain("THIS FILE WAS GENERATED");
    expect(SDL).toContain("MyObject");
    if (sortedSchema) {
      expect(SDL.indexOf("descriptionProperty")).toBeLessThan(SDL.indexOf("normalProperty"));
    } else {
      expect(SDL.indexOf("descriptionProperty")).toBeGreaterThan(SDL.indexOf("normalProperty"));
    }
    expect(SDL).toContain(`"""Description test"""`);
  }

  describe("emitSchemaDefinitionFile", () => {
    it("should write file with schema SDL successfully", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test1", "schema.graphql");
      await emitSchemaDefinitionFile(targetPath, schema);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should use provided options to write file with schema SDL", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test1", "schema.graphql");
      const options: PrintSchemaOptions = {
        sortedSchema: false,
      };
      await emitSchemaDefinitionFile(targetPath, schema, options);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), options);
    });

    it("should throw error when unknown error occur while writing file with schema SDL", async () => {
      jest.spyOn(filesystem, "fsWriteFile").mockRejectedValueOnce({ code: "TEST ERROR" });
      const targetPath = path.join(TEST_DIR, "schemas", "fail1", "schema.graphql");
      let error;
      try {
        await emitSchemaDefinitionFile(targetPath, schema);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual({ code: "TEST ERROR" });
      expect(fs.existsSync(targetPath)).toEqual(false);
    });

    it("should throw error when unknown error occur while creating directory with schema SDL", async () => {
      jest.spyOn(filesystem, "fsMkdir").mockRejectedValueOnce({ code: "TEST ERROR" });
      const targetPath = path.join(TEST_DIR, "schemas", "fail2", "schema.graphql");
      let error;
      try {
        await emitSchemaDefinitionFile(targetPath, schema);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual({ code: "TEST ERROR" });
      expect(fs.existsSync(targetPath)).toEqual(false);
    });
  });

  describe("emitSchemaDefinitionFileSync", () => {
    it("should write file with schema SDL successfully", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test2", "schema.graphql");
      emitSchemaDefinitionFileSync(targetPath, schema);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should use provided options to write file with schema SDL", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test1", "schema.graphql");
      const options: PrintSchemaOptions = {
        sortedSchema: false,
      };
      emitSchemaDefinitionFileSync(targetPath, schema, options);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), options);
    });

    it("should throw error when unknown error occur while writing file with schema SDL", async () => {
      jest.spyOn(fs, "writeFileSync").mockImplementationOnce(() => {
        throw new Error("TYPE_GRAPHQL_WRITE_FILE_SYNC_ERROR");
      });
      const targetPath = path.join(TEST_DIR, "schemas", "fail3", "schema.graphql");
      const error = await expectToThrow(() => emitSchemaDefinitionFileSync(targetPath, schema));

      expect(error.message).toStrictEqual("TYPE_GRAPHQL_WRITE_FILE_SYNC_ERROR");
      expect(fs.existsSync(targetPath)).toEqual(false);
    });

    it("should throw error when unknown error occur while creating directory with schema SDL", async () => {
      jest.spyOn(fs, "mkdirSync").mockImplementationOnce(() => {
        throw new Error("TYPE_GRAPHQL_MKDIR_SYNC_ERROR");
      });
      const targetPath = path.join(TEST_DIR, "schemas", "fail4", "schema.graphql");
      const error = await expectToThrow(() => emitSchemaDefinitionFileSync(targetPath, schema));

      expect(error.message).toStrictEqual("TYPE_GRAPHQL_MKDIR_SYNC_ERROR");
      expect(fs.existsSync(targetPath)).toEqual(false);
    });
  });

  describe("buildSchema", () => {
    it("should generate schema SDL file on selected file path", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test3", "schema.graphql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should generate schema SDL file in current working dir", async () => {
      jest.spyOn(process, "cwd").mockImplementation(() => TEST_DIR);
      const targetPath = path.join(process.cwd(), "schema.graphql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: true,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should read EmitSchemaFileOptions and apply them in emit", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test4", "schema.graphql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          path: targetPath,
          sortedSchema: false,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        sortedSchema: false,
      });
    });

    it("should read EmitSchemaFileOptions and set default path and sorting schema", async () => {
      jest.spyOn(process, "cwd").mockImplementation(() => TEST_DIR);
      const targetPath = path.join(process.cwd(), "schema.graphql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: {},
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        ...defaultPrintSchemaOptions,
      });
    });
  });

  describe("buildSchemaSync", () => {
    it("should synchronously generate schema SDL file on selected file path", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test5", "schema.graphql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should generate schema SDL file in current working dir", async () => {
      jest.spyOn(process, "cwd").mockImplementation(() => TEST_DIR);
      const targetPath = path.join(process.cwd(), "schema.graphql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: true,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should read EmitSchemaFileOptions and apply them in emit", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test6", "schema.graphql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          path: targetPath,
          sortedSchema: false,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        sortedSchema: false,
      });
    });

    it("should read EmitSchemaFileOptions and set default path and sorting schema", async () => {
      jest.spyOn(process, "cwd").mockImplementation(() => TEST_DIR);
      const targetPath = path.join(process.cwd(), "schema.graphql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: {},
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        ...defaultPrintSchemaOptions,
      });
    });
  });
});
