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
    const nullableIntFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NullableIntFilter.ts",
    );
    const stringFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/StringFilter.ts",
    );
    const nullableStringFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NullableStringFilter.ts",
    );
    const floatFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/FloatFilter.ts",
    );
    const nullableFloatFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NullableFloatFilter.ts",
    );
    const booleanFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/BooleanFilter.ts",
    );
    const nullableBooleanFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NullableBooleanFilter.ts",
    );
    const dateTimeFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/DateTimeFilter.ts",
    );
    const nullableDateTimeFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NullableDateTimeFilter.ts",
    );
    const jsonFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/JsonFilter.ts",
    );
    const nullableJsonFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/NullableJsonFilter.ts",
    );

    expect(intFilterTSFile).toMatchSnapshot("IntFilter");
    expect(nullableIntFilterTSFile).toMatchSnapshot("NullableIntFilter");
    expect(stringFilterTSFile).toMatchSnapshot("StringFilter");
    expect(nullableStringFilterTSFile).toMatchSnapshot("NullableStringFilter");
    expect(floatFilterTSFile).toMatchSnapshot("FloatFilter");
    expect(nullableFloatFilterTSFile).toMatchSnapshot("NullableFloatFilter");
    expect(booleanFilterTSFile).toMatchSnapshot("BooleanFilter");
    expect(nullableBooleanFilterTSFile).toMatchSnapshot(
      "NullableBooleanFilter",
    );
    expect(dateTimeFilterTSFile).toMatchSnapshot("DateTimeFilter");
    expect(nullableDateTimeFilterTSFile).toMatchSnapshot(
      "NullableDateTimeFilter",
    );
    expect(jsonFilterTSFile).toMatchSnapshot("JsonFilter");
    expect(nullableJsonFilterTSFile).toMatchSnapshot("NullableJsonFilter");
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

    expect(sampleModelWhereInputTSFile).toMatchSnapshot(
      "SampleModelWhereInput",
    );
    expect(sampleModelWhereUniqueInputTSFile).toMatchSnapshot(
      "SampleModelWhereUniqueInput",
    );
  });

  it("should properly generate input type classes for filtering models by relation fields", async () => {
    const schema = /* prisma */ `
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
  });

  it("should properly generate input type class for filtering by enums values", async () => {
    const schema = /* prisma */ `
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
    const colorEnumFilterTSFile = await readGeneratedFile(
      "/resolvers/inputs/ColorFilter.ts",
    );

    expect(colorEnumFilterTSFile).toMatchSnapshot("ColorFilter");
  });

  it("should properly generate input type classes for model with composite unique index", async () => {
    const schema = /* prisma */ `
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

    expect(directorWhereInputTSFile).toMatchSnapshot("DirectorWhereInput");
    expect(directorWhereUniqueInputTSFile).toMatchSnapshot(
      "DirectorWhereUniqueInput",
    );
    expect(directorOrderByInputTSFile).toMatchSnapshot("DirectorOrderByInput");
    expect(directorFirstNameLastNameCompoundUniqueInputTSFile).toMatchSnapshot(
      "FirstNameLastNameCompoundUniqueInput",
    );
  });

  it("should properly generate input type classes for model with id keys with relation", async () => {
    const schema = /* prisma */ `
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
  });

  it("should properly generate input type classes when model is renamed", async () => {
    const schema = /* prisma */ `
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

    expect(exampleWhereInputTSFile).toMatchSnapshot("ExampleWhereInput");
    expect(exampleWhereUniqueInputTSFile).toMatchSnapshot(
      "ExampleWhereUniqueInput",
    );
    expect(exampleOrderByInputTSFile).toMatchSnapshot("ExampleOrderByInput");
  });

  it("should properly generate input type classes when model field is renamed", async () => {
    const schema = /* prisma */ `
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

    expect(sampleWhereInputTSFile).toMatchSnapshot("SampleWhereInput");
    expect(sampleOrderByInputTSFile).toMatchSnapshot("SampleOrderByInput");
  });
});
