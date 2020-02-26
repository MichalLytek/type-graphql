import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("inputs", () => {
  let outputDirPath: string;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-inputs");
    await fs.mkdir(outputDirPath, { recursive: true });
  });

  it("should properly generate input type classes for filtering scalar fields", async () => {
    const schema = /* prisma */ `
      model SampleModel {
        intIdField    Int       @id @default(autoincrement())
        stringField   String
        floatField    Float
        booleanField  Boolean
        dateField     DateTime
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const intFilterTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/IntFilter.ts",
      { encoding: "utf8" },
    );
    const stringFilterTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/StringFilter.ts",
      { encoding: "utf8" },
    );
    const floatFilterTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/FloatFilter.ts",
      { encoding: "utf8" },
    );
    const booleanFilterTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/BooleanFilter.ts",
      { encoding: "utf8" },
    );
    const dateTimeFilterTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/DateTimeFilter.ts",
      { encoding: "utf8" },
    );

    expect(intFilterTSFile).toMatchSnapshot("IntFilter");
    expect(stringFilterTSFile).toMatchSnapshot("StringFilter");
    expect(floatFilterTSFile).toMatchSnapshot("FloatFilter");
    expect(booleanFilterTSFile).toMatchSnapshot("BooleanFilter");
    expect(dateTimeFilterTSFile).toMatchSnapshot("DateTimeFilter");
  });

  it("should properly generate input type classes for filtering models by fields", async () => {
    const schema = /* prisma */ `
      model SampleModel {
        intIdField    Int       @id @default(autoincrement())
        stringField   String    @unique
        floatField    Float
        booleanField  Boolean
        dateField     DateTime
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const sampleModelWhereInputTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/SampleModelWhereInput.ts",
      { encoding: "utf8" },
    );
    const sampleModelWhereUniqueInputTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/SampleModelWhereUniqueInput.ts",
      { encoding: "utf8" },
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
    const firstModelWhereInputTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/FirstModelWhereInput.ts",
      { encoding: "utf8" },
    );
    const firstModelWhereUniqueInputTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/FirstModelWhereUniqueInput.ts",
      { encoding: "utf8" },
    );
    const firstModelScalarWhereInputTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/FirstModelScalarWhereInput.ts",
      { encoding: "utf8" },
    );
    const firstModelOrderByInputTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/FirstModelOrderByInput.ts",
      { encoding: "utf8" },
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
    const colorEnumFilterTSFile = await fs.readFile(
      outputDirPath + "/resolvers/inputs/ColorFilter.ts",
      { encoding: "utf8" },
    );

    expect(colorEnumFilterTSFile).toMatchSnapshot("ColorFilter");
  });
});
