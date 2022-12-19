import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import fs from "fs";
import path from "path";
import shelljs from "shelljs";

import {
  buildSchema,
  buildSchemaSync,
  emitSchemaDefinitionFile,
  emitSchemaDefinitionFileSync,
  Field,
  ObjectType,
  Query,
  Resolver,
  PrintSchemaOptions,
  defaultPrintSchemaOptions,
} from "../../src";
import * as filesystem from "../../src/helpers/filesystem";

const TEST_DIR = path.resolve(process.cwd(), "tests", "test-output-dir");

describe("Emitting schema definition file", () => {
  let schema: GraphQLSchema;
  let MyResolverClass: any;

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
    jest.restoreAllMocks();
    shelljs.rm("-rf", TEST_DIR);
  });

  function checkSchemaSDL(
    SDL: string,
    { commentDescriptions, sortedSchema }: PrintSchemaOptions = defaultPrintSchemaOptions,
  ) {
    expect(SDL).toContain("THIS FILE WAS GENERATED");
    expect(SDL).toContain("MyObject");
    if (sortedSchema) {
      expect(SDL.indexOf("descriptionProperty")).toBeLessThan(SDL.indexOf("normalProperty"));
    } else {
      expect(SDL.indexOf("descriptionProperty")).toBeGreaterThan(SDL.indexOf("normalProperty"));
    }
    if (commentDescriptions) {
      expect(SDL).toContain(`# Description test`);
    } else {
      expect(SDL).toContain(`"""Description test"""`);
    }
  }

  describe("emitSchemaDefinitionFile", () => {
    it("should write file with schema SDL successfully", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test1", "schema.gql");
      await emitSchemaDefinitionFile(targetPath, schema);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should use provided options to write file with schema SDL", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test1", "schema.gql");
      const options: PrintSchemaOptions = {
        commentDescriptions: true,
        sortedSchema: false,
      };
      await emitSchemaDefinitionFile(targetPath, schema, options);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), options);
    });

    it("should throw error when unknown error occur while writing file with schema SDL", async () => {
      jest.spyOn(filesystem, "fsWriteFile").mockRejectedValueOnce({ code: "TEST ERROR" });
      const targetPath = path.join(TEST_DIR, "schemas", "fail1", "schema.gql");
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
      const targetPath = path.join(TEST_DIR, "schemas", "fail2", "schema.gql");
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
      const targetPath = path.join(TEST_DIR, "schemas", "test2", "schema.gql");
      emitSchemaDefinitionFileSync(targetPath, schema);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should use provided options to write file with schema SDL", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test1", "schema.gql");
      const options: PrintSchemaOptions = {
        commentDescriptions: true,
        sortedSchema: false,
      };
      emitSchemaDefinitionFileSync(targetPath, schema, options);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), options);
    });

    it("should throw error when unknown error occur while writing file with schema SDL", () => {
      jest.spyOn(fs, "writeFileSync").mockImplementationOnce(() => {
        throw { code: "TEST ERROR" };
      });
      const targetPath = path.join(TEST_DIR, "schemas", "fail3", "schema.gql");
      let error;
      try {
        emitSchemaDefinitionFileSync(targetPath, schema);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual({ code: "TEST ERROR" });
      expect(fs.existsSync(targetPath)).toEqual(false);
    });

    it("should throw error when unknown error occur while creating directory with schema SDL", () => {
      jest.spyOn(fs, "mkdirSync").mockImplementationOnce(() => {
        throw { code: "TEST ERROR" };
      });
      const targetPath = path.join(TEST_DIR, "schemas", "fail4", "schema.gql");
      let error;
      try {
        emitSchemaDefinitionFileSync(targetPath, schema);
      } catch (e) {
        error = e;
      }
      expect(error).toEqual({ code: "TEST ERROR" });
      expect(fs.existsSync(targetPath)).toEqual(false);
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
      jest.spyOn(process, "cwd").mockImplementation(() => TEST_DIR);
      const targetPath = path.join(process.cwd(), "schema.gql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: true,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should read EmitSchemaFileOptions and apply them in emit", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test4", "schema.gql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
          path: targetPath,
          sortedSchema: false,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        commentDescriptions: true,
        sortedSchema: false,
      });
    });

    it("should read EmitSchemaFileOptions and set default path and sorting schema", async () => {
      jest.spyOn(process, "cwd").mockImplementation(() => TEST_DIR);
      const targetPath = path.join(process.cwd(), "schema.gql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        ...defaultPrintSchemaOptions,
        commentDescriptions: true,
      });
    });
  });

  describe("buildSchemaSync", () => {
    it("should synchronously generate schema SDL file on selected file path", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test5", "schema.gql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: targetPath,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should generate schema SDL file in current working dir", async () => {
      jest.spyOn(process, "cwd").mockImplementation(() => TEST_DIR);
      const targetPath = path.join(process.cwd(), "schema.gql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: true,
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString());
    });

    it("should read EmitSchemaFileOptions and apply them in emit", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test6", "schema.gql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
          path: targetPath,
          sortedSchema: false,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        commentDescriptions: true,
        sortedSchema: false,
      });
    });

    it("should read EmitSchemaFileOptions and set default path and sorting schema", async () => {
      jest.spyOn(process, "cwd").mockImplementation(() => TEST_DIR);
      const targetPath = path.join(process.cwd(), "schema.gql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: true,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        ...defaultPrintSchemaOptions,
        commentDescriptions: true,
      });
    });
  });
});
