import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";
import createReadGeneratedFile, {
  ReadGeneratedFile,
} from "../helpers/read-file";

describe("outputs", () => {
  let outputDirPath: string;
  let readGeneratedFile: ReadGeneratedFile;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-outputs");
    await fs.mkdir(outputDirPath, { recursive: true });
    readGeneratedFile = createReadGeneratedFile(outputDirPath);
  });

  it("should properly generate output type classes", async () => {
    const schema = /* prisma */ `
      model Sample {
        intIdField    Int       @id @default(autoincrement())
        stringField   String
        floatField    Float
        booleanField  Boolean
        dateField     DateTime
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const aggregateSampleTSFile = await readGeneratedFile(
      "/resolvers/outputs/AggregateSample.ts",
    );
    const batchPayloadTSFile = await readGeneratedFile(
      "/resolvers/outputs/BatchPayload.ts",
    );

    expect(aggregateSampleTSFile).toMatchSnapshot("AggregateSample");
    expect(batchPayloadTSFile).toMatchSnapshot("BatchPayload");
  });

  it("should properly generate args type classes for aggregate", async () => {
    const schema = /* prisma */ `
      model Sample {
        intIdField    Int       @id @default(autoincrement())
        stringField   String
        floatField    Float
        booleanField  Boolean
        dateField     DateTime
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const aggregateSampleTSFile = await readGeneratedFile(
      "/resolvers/outputs/args/AggregateSampleCountArgs.ts",
    );

    expect(aggregateSampleTSFile).toMatchSnapshot("AggregateSampleCountArgs");
  });
});
