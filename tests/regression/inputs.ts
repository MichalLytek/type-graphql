import { promises as fs } from "fs";

import generateCode from "../../src/generator/generate-code";
import getPhotonDmmfFromPrismaSchema from "../helpers/dmmf";
import getBaseDirPath from "../helpers/base-dir";

describe("inputs", () => {
  let baseDirPath: string;

  beforeEach(async () => {
    baseDirPath = getBaseDirPath("inputs");
    await fs.mkdir(baseDirPath);
  });

  afterEach(async () => {
    await fs.rmdir(baseDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
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

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const intFilterTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/IntFilter.ts",
      { encoding: "utf-8" },
    );
    const stringFilterTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/StringFilter.ts",
      { encoding: "utf-8" },
    );
    const floatFilterTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/FloatFilter.ts",
      { encoding: "utf-8" },
    );
    const booleanFilterTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/BooleanFilter.ts",
      { encoding: "utf-8" },
    );
    const dateTimeFilterTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/DateTimeFilter.ts",
      { encoding: "utf-8" },
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

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const sampleModelWhereInputTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/SampleModelWhereInput.ts",
      { encoding: "utf-8" },
    );
    const sampleModelWhereUniqueInputTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/SampleModelWhereUniqueInput.ts",
      { encoding: "utf-8" },
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

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const firstModelWhereInputTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/FirstModelWhereInput.ts",
      { encoding: "utf-8" },
    );
    const firstModelWhereUniqueInputTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/FirstModelWhereUniqueInput.ts",
      { encoding: "utf-8" },
    );
    const firstModelScalarWhereInputTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/FirstModelScalarWhereInput.ts",
      { encoding: "utf-8" },
    );
    const firstModelOrderByInputTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/FirstModelOrderByInput.ts",
      { encoding: "utf-8" },
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

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const colorEnumFilterTSFile = await fs.readFile(
      baseDirPath + "/resolvers/inputs/ColorFilter.ts",
      { encoding: "utf-8" },
    );

    expect(colorEnumFilterTSFile).toMatchSnapshot("ColorFilter");
  });
});
