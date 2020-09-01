import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";
import createReadGeneratedFile, {
  ReadGeneratedFile,
} from "../helpers/read-file";

describe("inputs", () => {
  let outputDirPath: string;
  let readGeneratedFile: ReadGeneratedFile;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-inputs");
    await fs.mkdir(outputDirPath, { recursive: true });
    readGeneratedFile = createReadGeneratedFile(outputDirPath);
  });

  it("should properly generate input type classes for filtering scalar fields", async () => {
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
    const intFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/IntFilter.ts",
    );
    const nestedIntFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NestedIntFilter.ts",
    );
    const stringFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/StringFilter.ts",
    );
    const stringNullableFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/StringNullableFilter.ts",
    );
    const nestedStringNullableFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NestedStringNullableFilter.ts",
    );
    const floatFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/FloatFilter.ts",
    );
    const nestedFloatFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NestedFloatFilter.ts",
    );
    const boolFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/BoolFilter.ts",
    );
    const nestedBoolFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NestedBoolFilter.ts",
    );
    const dateTimeFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/DateTimeFilter.ts",
    );
    const nestedDateTimeFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NestedDateTimeFilter.ts",
    );
    const jsonFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/JsonFilter.ts",
    );
    const nestedJsonFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NestedJsonFilter.ts",
    );
    const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

    expect(intFilterTSFile).toMatchSnapshot("IntFilter");
    expect(nestedIntFilterTSFile).toMatchSnapshot("NestedIntFilter");
    expect(stringFilterTSFile).toMatchSnapshot("StringFilter");
    expect(stringNullableFilterTSFile).toMatchSnapshot("StringNullableFilter");
    expect(nestedStringNullableFilterTSFile).toMatchSnapshot(
      "NestedStringNullableFilter",
    );
    expect(floatFilterTSFile).toMatchSnapshot("FloatFilter");
    expect(nestedFloatFilterTSFile).toMatchSnapshot("NestedFloatFilter");
    expect(boolFilterTSFile).toMatchSnapshot("BoolFilter");
    expect(nestedBoolFilterTSFile).toMatchSnapshot("NestedBoolFilter");
    expect(dateTimeFilterTSFile).toMatchSnapshot("DateTimeFilter");
    expect(nestedDateTimeFilterTSFile).toMatchSnapshot("NestedDateTimeFilter");
    expect(jsonFilterTSFile).toMatchSnapshot("JsonFilter");
    expect(nestedJsonFilterTSFile).toMatchSnapshot("NestedJsonFilter");
    expect(indexTSFile).toMatchSnapshot("index");
  });

  it("should properly generate input type classes for updating scalar fields", async () => {
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
        enumField             Color
        optionalEnumField     Color?
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const sampleModelUpdateInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/SampleModelUpdateInput.ts",
    );
    const sampleModelUpdateManyMutationInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/SampleModelUpdateManyMutationInput.ts",
    );
    const boolFieldUpdateOperationsInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/BoolFieldUpdateOperationsInput.ts",
    );
    const dateTimeFieldUpdateOperationsInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/DateTimeFieldUpdateOperationsInput.ts",
    );
    const floatFieldUpdateOperationsInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/FloatFieldUpdateOperationsInput.ts",
    );
    const intFieldUpdateOperationsInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/IntFieldUpdateOperationsInput.ts",
    );
    const jsonFieldUpdateOperationsInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/JsonFieldUpdateOperationsInput.ts",
    );
    const stringFieldUpdateOperationsInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/StringFieldUpdateOperationsInput.ts",
    );
    const enumColorFieldUpdateOperationsInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/EnumColorFieldUpdateOperationsInput.ts",
    );

    const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

    expect(sampleModelUpdateInputTSFile).toMatchSnapshot(
      "SampleModelUpdateInput",
    );
    expect(sampleModelUpdateManyMutationInputTSFile).toMatchSnapshot(
      "SampleModelUpdateManyMutationInput",
    );
    expect(boolFieldUpdateOperationsInputTSFile).toMatchSnapshot(
      "BoolFieldUpdateOperationsInput",
    );
    expect(dateTimeFieldUpdateOperationsInputTSFile).toMatchSnapshot(
      "DateTimeFieldUpdateOperationsInput",
    );
    expect(floatFieldUpdateOperationsInputTSFile).toMatchSnapshot(
      "FloatFieldUpdateOperationsInput",
    );
    expect(intFieldUpdateOperationsInputTSFile).toMatchSnapshot(
      "IntFieldUpdateOperationsInput",
    );
    expect(jsonFieldUpdateOperationsInputTSFile).toMatchSnapshot(
      "JSONFieldUpdateOperationsInput",
    );
    expect(stringFieldUpdateOperationsInputTSFile).toMatchSnapshot(
      "StringFieldUpdateOperationsInput",
    );
    expect(enumColorFieldUpdateOperationsInputTSFile).toMatchSnapshot(
      "EnumColorFieldUpdateOperationsInput",
    );
    expect(indexTSFile).toMatchSnapshot("index");
  });

  it("should properly generate input type classes for filtering models by fields", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }
      model SampleModel {
        intIdField          Int     @id @default(autoincrement())
        stringField         String  @unique
        optionalStringField String?
        intField            Int
        floatField          Float
        booleanField        Boolean
        dateField           DateTime
        jsonField           Json
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const sampleModelWhereInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/SampleModelWhereInput.ts",
    );
    const sampleModelWhereUniqueInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/SampleModelWhereUniqueInput.ts",
    );
    const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

    expect(sampleModelWhereInputTSFile).toMatchSnapshot(
      "SampleModelWhereInput",
    );
    expect(sampleModelWhereUniqueInputTSFile).toMatchSnapshot(
      "SampleModelWhereUniqueInput",
    );
    expect(indexTSFile).toMatchSnapshot("index");
  });

  it("should properly generate input type classes for filtering models by many to many relation fields", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model FirstModel {
        idField            Int            @id @default(autoincrement())
        uniqueStringField  String         @unique
        floatField         Float
        secondModelsField  SecondModel[]
      }
      model SecondModel {
        idField            Int           @id @default(autoincrement())
        uniqueStringField  String        @unique
        floatField         Float
        firstModelsField   FirstModel[]
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const firstModelWhereInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/FirstModelWhereInput.ts",
    );
    const firstModelWhereUniqueInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/FirstModelWhereUniqueInput.ts",
    );
    const firstModelScalarWhereInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/FirstModelScalarWhereInput.ts",
    );
    const firstModelOrderByInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/FirstModelOrderByInput.ts",
    );
    const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

    expect(firstModelWhereInputTSFile).toMatchSnapshot("FirstModelWhereInput");
    expect(firstModelWhereUniqueInputTSFile).toMatchSnapshot(
      "FirstModelWhereUniqueInput",
    );
    expect(firstModelScalarWhereInputTSFile).toMatchSnapshot(
      "FirstModelScalarWhereInput",
    );
    expect(firstModelOrderByInputTSFile).toMatchSnapshot(
      "FirstModelOrderByInput",
    );
    expect(indexTSFile).toMatchSnapshot("index");
  });

  it("should properly generate input type classes for filtering models by one to many relation fields", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model FirstModel {
        idField            Int            @id @default(autoincrement())
        uniqueStringField  String         @unique
        floatField         Float
        secondModelsField  SecondModel[]
      }
      model SecondModel {
        idField            Int          @id @default(autoincrement())
        uniqueStringField  String       @unique
        floatField         Float
        firstModelFieldId  Int
        firstModelField    FirstModel   @relation(fields: [firstModelFieldId], references: [idField])
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const firstModelWhereInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/FirstModelWhereInput.ts",
    );
    const firstModelWhereUniqueInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/FirstModelWhereUniqueInput.ts",
    );
    const firstModelOrderByInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/FirstModelOrderByInput.ts",
    );
    const firstModelRelationFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/FirstModelRelationFilter.ts",
    );
    const secondModelWhereInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/SecondModelWhereInput.ts",
    );
    const secondModelWhereUniqueInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/SecondModelWhereUniqueInput.ts",
    );
    const secondModelScalarWhereInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/SecondModelScalarWhereInput.ts",
    );
    const secondModelOrderByInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/SecondModelOrderByInput.ts",
    );
    const secondModelListRelationFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/SecondModelListRelationFilter.ts",
    );
    const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

    expect(firstModelWhereInputTSFile).toMatchSnapshot("FirstModelWhereInput");
    expect(firstModelWhereUniqueInputTSFile).toMatchSnapshot(
      "FirstModelWhereUniqueInput",
    );
    expect(firstModelOrderByInputTSFile).toMatchSnapshot(
      "FirstModelOrderByInput",
    );
    expect(firstModelRelationFilterTSFile).toMatchSnapshot(
      "FirstModelRelationFilter",
    );
    expect(secondModelWhereInputTSFile).toMatchSnapshot(
      "SecondModelWhereInput",
    );
    expect(secondModelWhereUniqueInputTSFile).toMatchSnapshot(
      "SecondModelWhereUniqueInput",
    );
    expect(secondModelScalarWhereInputTSFile).toMatchSnapshot(
      "SecondModelScalarWhereInput",
    );
    expect(secondModelOrderByInputTSFile).toMatchSnapshot(
      "SecondModelOrderByInput",
    );
    expect(secondModelListRelationFilterTSFile).toMatchSnapshot(
      "SecondModelListRelationFilter",
    );
    expect(indexTSFile).toMatchSnapshot("index");
  });

  it("should properly generate input type class for filtering by enums values", async () => {
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

      model SampleModel {
        idField    Int    @id @default(autoincrement())
        enumField  Color
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const enumColorFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/EnumColorFilter.ts",
    );
    const nestedEnumColorFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NestedEnumColorFilter.ts",
    );
    const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

    expect(enumColorFilterTSFile).toMatchSnapshot("EnumColorFilter");
    expect(nestedEnumColorFilterTSFile).toMatchSnapshot(
      "NestedEnumColorFilter",
    );
    expect(indexTSFile).toMatchSnapshot("index");
  });

  it("should properly generate input type classes for model with composite unique index", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model Movie {
        directorFirstName String
        directorLastName  String
        director          Director @relation(fields: [directorFirstName, directorLastName], references: [firstName, lastName])
        title             String
        rating            Float

        @@id([directorFirstName, directorLastName, title])
      }

      model Director {
        firstName String
        lastName  String
        age       Int
        movies    Movie[]

        @@id([firstName, lastName])
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const directorWhereInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/DirectorWhereInput.ts",
    );
    const directorWhereUniqueInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/DirectorWhereUniqueInput.ts",
    );
    const directorOrderByInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/DirectorOrderByInput.ts",
    );
    const directorFirstNameLastNameCompoundUniqueInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/FirstNameLastNameCompoundUniqueInput.ts",
    );
    const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

    expect(directorWhereInputTSFile).toMatchSnapshot("DirectorWhereInput");
    expect(directorWhereUniqueInputTSFile).toMatchSnapshot(
      "DirectorWhereUniqueInput",
    );
    expect(directorOrderByInputTSFile).toMatchSnapshot("DirectorOrderByInput");
    expect(directorFirstNameLastNameCompoundUniqueInputTSFile).toMatchSnapshot(
      "FirstNameLastNameCompoundUniqueInput",
    );
    expect(indexTSFile).toMatchSnapshot("index");
  });

  it("should properly generate input type classes for model with id keys with relation", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model Movie {
        directorFirstName String
        directorLastName  String
        director          Director @relation(fields: [directorFirstName, directorLastName], references: [firstName, lastName])
        title             String
        rating            Float

        @@id([directorFirstName, directorLastName, title])
      }

      model Director {
        firstName String
        lastName  String
        age       Int
        movies    Movie[]

        @@id([firstName, lastName])
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const movieWhereInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/MovieWhereInput.ts",
    );
    const movieWhereUniqueInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/MovieWhereUniqueInput.ts",
    );
    const movieScalarWhereInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/MovieScalarWhereInput.ts",
    );
    const movieOrderByInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/MovieOrderByInput.ts",
    );
    const directorFirstNameDirectorLastNameTitleCompoundUniqueInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput.ts",
    );
    const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

    expect(movieWhereInputTSFile).toMatchSnapshot("MovieWhereInput");
    expect(movieWhereUniqueInputTSFile).toMatchSnapshot(
      "MovieWhereUniqueInput",
    );
    expect(movieScalarWhereInputTSFile).toMatchSnapshot(
      "MovieScalarWhereInput",
    );
    expect(movieOrderByInputTSFile).toMatchSnapshot("MovieOrderByInput");
    expect(
      directorFirstNameDirectorLastNameTitleCompoundUniqueInputTSFile,
    ).toMatchSnapshot(
      "DirectorFirstNameDirectorLastNameTitleCompoundUniqueInput",
    );
    expect(indexTSFile).toMatchSnapshot("index");
  });

  describe("when model is renamed", () => {
    it("should properly generate input type classes when model is renamed", async () => {
      const schema = /* prisma */ `
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }

        /// @@TypeGraphQL.type("Example")
        model SampleModel {
          intIdField    Int       @id @default(autoincrement())
          stringField   String    @unique
          floatField    Float
          booleanField  Boolean
          dateField     DateTime
          other         OtherModel @relation(fields: [otherId], references: [id])
          otherId       Int
        }

        model OtherModel {
          id    Int     @id @default(autoincrement())
          name  String
        }
      `;

      await generateCodeFromSchema(schema, { outputDirPath });
      const exampleWhereInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/ExampleWhereInput.ts",
      );
      const exampleWhereUniqueInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/ExampleWhereUniqueInput.ts",
      );
      const exampleOrderByInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/ExampleOrderByInput.ts",
      );
      const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

      expect(exampleWhereInputTSFile).toMatchSnapshot("ExampleWhereInput");
      expect(exampleWhereUniqueInputTSFile).toMatchSnapshot(
        "ExampleWhereUniqueInput",
      );
      expect(exampleOrderByInputTSFile).toMatchSnapshot("ExampleOrderByInput");
      expect(indexTSFile).toMatchSnapshot("index");
    });

    it("should properly generate input type classes for filtering models by many to many relation fields", async () => {
      const schema = /* prisma */ `
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }

        /// @@TypeGraphQL.type("RenamedFirstModel")
        model FirstModel {
          idField            Int            @id @default(autoincrement())
          uniqueStringField  String         @unique
          floatField         Float
          secondModelsField  SecondModel[]
        }
        /// @@TypeGraphQL.type("RenamedSecondModel")
        model SecondModel {
          idField            Int           @id @default(autoincrement())
          uniqueStringField  String        @unique
          floatField         Float
          firstModelsField   FirstModel[]
        }
      `;

      await generateCodeFromSchema(schema, { outputDirPath });
      const renamedFirstModelWhereInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedFirstModelWhereInput.ts",
      );
      const renamedFirstModelWhereUniqueInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedFirstModelWhereUniqueInput.ts",
      );
      const renamedFirstModelScalarWhereInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedFirstModelScalarWhereInput.ts",
      );
      const renamedFirstModelOrderByInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedFirstModelOrderByInput.ts",
      );
      const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

      expect(renamedFirstModelWhereInputTSFile).toMatchSnapshot(
        "RenamedFirstModelWhereInput",
      );
      expect(renamedFirstModelWhereUniqueInputTSFile).toMatchSnapshot(
        "RenamedFirstModelWhereUniqueInput",
      );
      expect(renamedFirstModelScalarWhereInputTSFile).toMatchSnapshot(
        "RenamedFirstModelScalarWhereInput",
      );
      expect(renamedFirstModelOrderByInputTSFile).toMatchSnapshot(
        "RenamedFirstModelOrderByInput",
      );
      expect(indexTSFile).toMatchSnapshot("index");
    });

    it("should properly generate input type classes for filtering models by one to many relation fields", async () => {
      const schema = /* prisma */ `
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }

        /// @@TypeGraphQL.type("RenamedFirstModel")
        model FirstModel {
          idField            Int            @id @default(autoincrement())
          uniqueStringField  String         @unique
          floatField         Float
          secondModelsField  SecondModel[]
        }
        /// @@TypeGraphQL.type("RenamedSecondModel")
        model SecondModel {
          idField            Int          @id @default(autoincrement())
          uniqueStringField  String       @unique
          floatField         Float
          firstModelFieldId  Int
          firstModelField    FirstModel   @relation(fields: [firstModelFieldId], references: [idField])
        }
      `;

      await generateCodeFromSchema(schema, { outputDirPath });
      const renamedFirstModelWhereInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedFirstModelWhereInput.ts",
      );
      const renamedFirstModelWhereUniqueInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedFirstModelWhereUniqueInput.ts",
      );
      const renamedFirstModelOrderByInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedFirstModelOrderByInput.ts",
      );
      const renamedFirstModelRelationFilterTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedFirstModelRelationFilter.ts",
      );
      const renamedSecondModelWhereInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedSecondModelWhereInput.ts",
      );
      const renamedSecondModelWhereUniqueInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedSecondModelWhereUniqueInput.ts",
      );
      const renamedSecondModelScalarWhereInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedSecondModelScalarWhereInput.ts",
      );
      const renamedSecondModelOrderByInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedSecondModelOrderByInput.ts",
      );
      const renamedSecondModelListRelationFilterTSFile = await readGeneratedFile(
        "/resolvers/inputs/RenamedSecondModelListRelationFilter.ts",
      );
      const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

      expect(renamedFirstModelWhereInputTSFile).toMatchSnapshot(
        "RenamedFirstModelWhereInput",
      );
      expect(renamedFirstModelWhereUniqueInputTSFile).toMatchSnapshot(
        "RenamedFirstModelWhereUniqueInput",
      );
      expect(renamedFirstModelOrderByInputTSFile).toMatchSnapshot(
        "RenamedFirstModelOrderByInput",
      );
      expect(renamedFirstModelRelationFilterTSFile).toMatchSnapshot(
        "RenamedFirstModelRelationFilter",
      );
      expect(renamedSecondModelWhereInputTSFile).toMatchSnapshot(
        "RenamedSecondModelWhereInput",
      );
      expect(renamedSecondModelWhereUniqueInputTSFile).toMatchSnapshot(
        "RenamedSecondModelWhereUniqueInput",
      );
      expect(renamedSecondModelScalarWhereInputTSFile).toMatchSnapshot(
        "RenamedSecondModelScalarWhereInput",
      );
      expect(renamedSecondModelOrderByInputTSFile).toMatchSnapshot(
        "RenamedSecondModelOrderByInput",
      );
      expect(renamedSecondModelListRelationFilterTSFile).toMatchSnapshot(
        "RenamedSecondModelListRelationFilter",
      );
      expect(indexTSFile).toMatchSnapshot("index");
    });
  });

  it("should properly generate input type classes when model field is renamed", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model Sample {
        idField         Int     @id @default(autoincrement())
        /// @TypeGraphQL.field("mappedFieldName")
        modelFieldName  String
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const sampleWhereInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/SampleWhereInput.ts",
    );
    const sampleOrderByInputTSFile = await readGeneratedFile(
      "/resolvers/inputs/SampleOrderByInput.ts",
    );
    const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

    expect(sampleWhereInputTSFile).toMatchSnapshot("SampleWhereInput");
    expect(sampleOrderByInputTSFile).toMatchSnapshot("SampleOrderByInput");
    expect(indexTSFile).toMatchSnapshot("index");
  });

  describe("when prisma client is generated into node_modules", () => {
    it("should properly generate prisma client imports in input type class files", async () => {
      const schema = /* prisma */ `
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }

        model Sample {
          idField         Int     @id @default(autoincrement())
          modelFieldName  String
        }
      `;

      await generateCodeFromSchema(schema, {
        outputDirPath,
        absolutePrismaOutputPath: "@prisma/client",
      });
      const sampleWhereInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/SampleWhereInput.ts",
      );
      const indexTSFile = await readGeneratedFile("/resolvers/inputs/index.ts");

      expect(sampleWhereInputTSFile).toMatchSnapshot("SampleWhereInput");
      expect(indexTSFile).toMatchSnapshot("index");
    });
  });
});
