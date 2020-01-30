import "reflect-metadata";
import { promises as fs } from "fs";
import { buildSchema } from "type-graphql";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("picking prisma actions", () => {
  let outputDirPath: string;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("functional-picking-actions");
    await fs.mkdir(outputDirPath, { recursive: true });
    const prismaSchema = /* prisma */ `
      model User {
        intIdField          Int     @id @default(autoincrement())
        uniqueStringField   String  @unique
        optionalStringField String?
        dateField           DateTime
      }
    `;
    await generateCodeFromSchema(prismaSchema, outputDirPath);
  });

  afterEach(async () => {
    await fs.rmdir(outputDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should expose in GraphQL schema only actions chosen by single resolvers", async () => {
    const {
      CreateOneUserResolver,
      FindManyUserResolver,
    } = require(outputDirPath + "/index");
    await buildSchema({
      resolvers: [CreateOneUserResolver, FindManyUserResolver],
      validate: false,
      emitSchemaFile: outputDirPath + "/schema.graphql",
    });
    const graphQLSchemaSDL = await fs.readFile(
      outputDirPath + "/schema.graphql",
      { encoding: "utf8" },
    );

    expect(graphQLSchemaSDL).toMatchSnapshot("graphQLSchemaSDL");
  });
});
