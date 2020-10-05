import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";
import createReadGeneratedFile, {
  ReadGeneratedFile,
} from "../helpers/read-file";

describe("enums", () => {
  let outputDirPath: string;
  let readGeneratedFile: ReadGeneratedFile;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-enums");
    await fs.mkdir(outputDirPath, { recursive: true });
    readGeneratedFile = createReadGeneratedFile(outputDirPath);
  });

  it("should properly generate code for normal enum", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      enum Color {
        RED
        GREEN
        BLUE
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const colorEnumTSFile = await readGeneratedFile("/enums/Color.ts");

    expect(colorEnumTSFile).toMatchSnapshot();
  });

  it("should properly generate code for enum with docs", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      /// Role enum doc
      enum Role {
        // User member comment
        USER
        ADMIN
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const roleEnumTSFile = await readGeneratedFile("/enums/Role.ts");
    const enumsIndexTSFile = await readGeneratedFile("/enums/index.ts");

    expect(roleEnumTSFile).toMatchSnapshot();
    expect(enumsIndexTSFile).toMatchSnapshot("enums index");
  });

  it("should properly generate standard prisma enums", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model SampleModel {
        intIdField            Int     @id @default(autoincrement())
        stringField           String  @unique
        optionalStringField   String?
        intField              Int
        optionalIntField      Int?
        floatField            Float
        optionalFloatField    Float?
        booleanField          Boolean
        optionalBooleanField  Boolean?
        dateField             DateTime
        optionalDateField     DateTime?
        jsonField             Json
        optionalJsonField     Json?
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const sortOrderTSFile = await readGeneratedFile("/enums/SortOrder.ts");
    const queryModeTSFile = await readGeneratedFile("/enums/QueryMode.ts");
    const enumsIndexTSFile = await readGeneratedFile("/enums/index.ts");

    expect(sortOrderTSFile).toMatchSnapshot("SortOrder");
    expect(queryModeTSFile).toMatchSnapshot("QueryMode");
    expect(enumsIndexTSFile).toMatchSnapshot("enums index");
  });

  it("should properly generate model distinct field enum", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }
      model SampleModel {
        intIdField   Int     @id @default(autoincrement())
        stringField  String  @unique
        intField     Int
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const sampleModelDistinctFieldEnumTSFile = await readGeneratedFile(
      "/enums/SampleModelDistinctFieldEnum.ts",
    );
    const enumsIndexTSFile = await readGeneratedFile("/enums/index.ts");

    expect(sampleModelDistinctFieldEnumTSFile).toMatchSnapshot(
      "SampleModelDistinctFieldEnum",
    );
    expect(enumsIndexTSFile).toMatchSnapshot("enums index");
  });

  it("should properly generate model distinct enum when model is renamed", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }
      /// @@TypeGraphQL.type(name: "ExampleModel")
      model SampleModel {
        intIdField   Int     @id @default(autoincrement())
        stringField  String  @unique
        intField     Int
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const exampleModelDistinctFieldEnumTSFile = await readGeneratedFile(
      "/enums/ExampleModelDistinctFieldEnum.ts",
    );
    const enumsIndexTSFile = await readGeneratedFile("/enums/index.ts");

    expect(exampleModelDistinctFieldEnumTSFile).toMatchSnapshot(
      "ExampleModelDistinctFieldEnum",
    );
    expect(enumsIndexTSFile).toMatchSnapshot("enums index");
  });

  it("should properly generate model distinct enum when model field is renamed", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }
      model SampleModel {
        intIdField   Int     @id @default(autoincrement())
        /// @TypeGraphQL.field(name: "mappedFieldName")
        stringField  String  @unique
        intField     Int
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const sampleModelDistinctFieldEnumTSFile = await readGeneratedFile(
      "/enums/SampleModelDistinctFieldEnum.ts",
    );
    const enumsIndexTSFile = await readGeneratedFile("/enums/index.ts");

    expect(sampleModelDistinctFieldEnumTSFile).toMatchSnapshot(
      "SampleModelDistinctFieldEnum",
    );
    expect(enumsIndexTSFile).toMatchSnapshot("enums index");
  });
});
