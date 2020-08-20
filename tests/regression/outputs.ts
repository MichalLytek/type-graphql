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
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

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
    const avgAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/SampleAvgAggregateOutputType.ts",
    );
    const sumAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/SampleSumAggregateOutputType.ts",
    );
    const minAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/SampleMinAggregateOutputType.ts",
    );
    const maxAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/SampleMaxAggregateOutputType.ts",
    );
    const batchPayloadTSFile = await readGeneratedFile(
      "/resolvers/outputs/BatchPayload.ts",
    );
    const outputsIndexTSFile = await readGeneratedFile(
      "/resolvers/outputs/index.ts",
    );

    expect(aggregateSampleTSFile).toMatchSnapshot("AggregateSample");
    expect(avgAggregateTSFile).toMatchSnapshot("SampleAvgAggregateOutputType");
    expect(sumAggregateTSFile).toMatchSnapshot("SampleSumAggregateOutputType");
    expect(minAggregateTSFile).toMatchSnapshot("SampleMinAggregateOutputType");
    expect(maxAggregateTSFile).toMatchSnapshot("SampleMaxAggregateOutputType");
    expect(batchPayloadTSFile).toMatchSnapshot("BatchPayload");
    expect(outputsIndexTSFile).toMatchSnapshot("outputs index");
  });

  it("should properly generate aggregate classes for renamed model", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

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
    const avgAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/ExampleAvgAggregateOutputType.ts",
    );
    const sumAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/ExampleSumAggregateOutputType.ts",
    );
    const minAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/ExampleMinAggregateOutputType.ts",
    );
    const maxAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/ExampleMaxAggregateOutputType.ts",
    );
    const outputsIndexTSFile = await readGeneratedFile(
      "/resolvers/outputs/index.ts",
    );

    expect(aggregateExampleTSFile).toMatchSnapshot("AggregateExample");
    expect(avgAggregateTSFile).toMatchSnapshot("ExampleAvgAggregateOutputType");
    expect(sumAggregateTSFile).toMatchSnapshot("ExampleSumAggregateOutputType");
    expect(minAggregateTSFile).toMatchSnapshot("ExampleMinAggregateOutputType");
    expect(maxAggregateTSFile).toMatchSnapshot("ExampleMaxAggregateOutputType");
    expect(outputsIndexTSFile).toMatchSnapshot("outputs index");
  });

  it("should properly generate aggregate classes for model with lowercase name", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model example {
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
    const avgAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/ExampleAvgAggregateOutputType.ts",
    );
    const sumAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/ExampleSumAggregateOutputType.ts",
    );
    const minAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/ExampleMinAggregateOutputType.ts",
    );
    const maxAggregateTSFile = await readGeneratedFile(
      "/resolvers/outputs/ExampleMaxAggregateOutputType.ts",
    );
    const outputsIndexTSFile = await readGeneratedFile(
      "/resolvers/outputs/index.ts",
    );

    expect(aggregateExampleTSFile).toMatchSnapshot("AggregateExample");
    expect(avgAggregateTSFile).toMatchSnapshot("ExampleAvgAggregateOutputType");
    expect(sumAggregateTSFile).toMatchSnapshot("ExampleSumAggregateOutputType");
    expect(minAggregateTSFile).toMatchSnapshot("ExampleMinAggregateOutputType");
    expect(maxAggregateTSFile).toMatchSnapshot("ExampleMaxAggregateOutputType");
    expect(outputsIndexTSFile).toMatchSnapshot("outputs index");
  });
});
