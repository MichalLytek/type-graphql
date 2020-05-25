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
    const outputsIndexTSFile = await readGeneratedFile(
      "/resolvers/outputs/index.ts",
    );

    expect(aggregateSampleTSFile).toMatchSnapshot("AggregateSample");
    expect(batchPayloadTSFile).toMatchSnapshot("BatchPayload");
    expect(outputsIndexTSFile).toMatchSnapshot("outputs index");
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
    const outputsArgsIndexTSFile = await readGeneratedFile(
      "/resolvers/outputs/args/index.ts",
    );

    expect(aggregateSampleTSFile).toMatchSnapshot("AggregateSampleCountArgs");
    expect(outputsArgsIndexTSFile).toMatchSnapshot("outputs args index");
  });

  it("should properly generate aggregate classes for renamed model", async () => {
    const schema = /* prisma */ `
      /// @@TypeGraphQL.type("Example")
      model Sample {
        intIdField    Int       @id @default(autoincrement())
        stringField   String
        floatField    Float
        booleanField  Boolean
        dateField     DateTime
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const aggregateExampleTSFile = await readGeneratedFile(
      "/resolvers/outputs/AggregateExample.ts",
    );
    const aggregateExampleCountArgsTSFile = await readGeneratedFile(
      "/resolvers/outputs/args/AggregateExampleCountArgs.ts",
    );
    const outputsIndexTSFile = await readGeneratedFile(
      "/resolvers/outputs/index.ts",
    );
    const outputsArgsIndexTSFile = await readGeneratedFile(
      "/resolvers/outputs/args/index.ts",
    );

    expect(aggregateExampleTSFile).toMatchSnapshot("AggregateExample");
    expect(aggregateExampleCountArgsTSFile).toMatchSnapshot(
      "AggregateExampleCountArgs",
    );
    expect(outputsIndexTSFile).toMatchSnapshot("outputs index");
    expect(outputsArgsIndexTSFile).toMatchSnapshot("outputs args index");
  });
});
