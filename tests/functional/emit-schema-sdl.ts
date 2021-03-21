import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";

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
  Directive,
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

      @Field()
      @Directive(`@upper`)
      directiveProperty: string;
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

  afterEach(done => {
    jest.restoreAllMocks();
    rimraf(TEST_DIR, done);
  });

  function checkSchemaSDL(
    SDL: string,
    {
      commentDescriptions,
      sortedSchema,
      directives,
    }: PrintSchemaOptions = defaultPrintSchemaOptions,
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
    if (directives) {
      expect(SDL).toContain(`directiveProperty: String! @upper`);
    } else {
      expect(SDL).not.toContain(`directiveProperty: String! @upper`);
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
        directives: false,
      };
      await emitSchemaDefinitionFile(targetPath, schema, options);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), options);
    });

    it("should use provided options to write file with schema SDL that support directives", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test1", "schema.gql");
      const options: PrintSchemaOptions = {
        commentDescriptions: false, // Not supported
        sortedSchema: false,
        directives: true,
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
        directives: false,
      };
      emitSchemaDefinitionFileSync(targetPath, schema, options);
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), options);
    });

    it("should use provided options to write file with schema SDL that support directives", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test1", "schema.gql");
      const options: PrintSchemaOptions = {
        commentDescriptions: false,
        sortedSchema: false,
        directives: true, // Not supported
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
          directives: false,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        commentDescriptions: true,
        sortedSchema: false,
        directives: false,
      });
    });

    it("should read EmitSchemaFileOptions with directives enabled and apply them in emit", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test4", "schema.gql");
      await buildSchema({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: false, // Not supported
          path: targetPath,
          sortedSchema: false,
          directives: true,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        commentDescriptions: false, // Not supported
        sortedSchema: false,
        directives: true,
      });
    });

    it("should read EmitSchemaFileOptions and set default path and sorting schema and disable directives", async () => {
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
        directives: false,
      });
    });

    it("should read EmitSchemaFileOptions with directives enabled and apply them in emit", async () => {
      const targetPath = path.join(TEST_DIR, "schemas", "test6", "schema.gql");
      buildSchemaSync({
        resolvers: [MyResolverClass],
        emitSchemaFile: {
          commentDescriptions: false, // Not supported
          path: targetPath,
          sortedSchema: false,
          directives: true,
        },
      });
      expect(fs.existsSync(targetPath)).toEqual(true);
      checkSchemaSDL(fs.readFileSync(targetPath).toString(), {
        commentDescriptions: false, // Not supported
        sortedSchema: false,
        directives: true,
      });
    });

    it("should read EmitSchemaFileOptions and set default path and sorting schema and disable directives", async () => {
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
