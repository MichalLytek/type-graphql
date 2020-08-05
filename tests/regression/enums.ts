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
      /// Role enum doc
      enum Role {
        // User member comment
        USER
        ADMIN
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const roleEnumTSFile = await readGeneratedFile("/enums/Role.ts");

    expect(roleEnumTSFile).toMatchSnapshot();
  });

  it("should properly generate sort order enum", async () => {
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

    expect(sortOrderTSFile).toMatchSnapshot("SortOrder");
  });
});
