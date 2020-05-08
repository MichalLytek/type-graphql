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
    await generateCodeFromSchema(prismaSchema, { outputDirPath });
  });

  it("should expose in GraphQL schema only actions chosen by single resolvers", async () => {
    const { CreateUserResolver, FindManyUserResolver } = require(outputDirPath +
      "/index");
    await buildSchema({
      resolvers: [CreateUserResolver, FindManyUserResolver],
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
