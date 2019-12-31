import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("crud", () => {
  let outputDirPath: string;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("crud");
    await fs.mkdir(outputDirPath);
  });

  afterEach(async () => {
    await fs.rmdir(outputDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should properly generate resolver class for single prisma model", async () => {
    const schema = /* prisma */ `
      model User {
        intIdField          Int     @id @default(autoincrement())
        uniqueStringField   String  @unique
        optionalStringField String?
        dateField           DateTime
      }
    `;

    await generateCodeFromSchema(schema, outputDirPath);
    const userCrudResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/UserCrudResolver.ts",
      { encoding: "utf8" },
    );

    expect(userCrudResolverTSFile).toMatchSnapshot("UserCrudResolver");
  });

  it("should properly generate args classes for every method of crud resolver", async () => {
    const schema = /* prisma */ `
      model User {
        intIdField          Int     @id @default(autoincrement())
        uniqueStringField   String  @unique
        optionalStringField String?
        dateField           DateTime
      }
    `;

    await generateCodeFromSchema(schema, outputDirPath);
    const createOneUserArgsTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/args/CreateOneUserArgs.ts",
      { encoding: "utf8" },
    );
    const deleteManyUserArgsTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/args/DeleteManyUserArgs.ts",
      { encoding: "utf8" },
    );
    const deleteOneUserArgsTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/args/DeleteOneUserArgs.ts",
      { encoding: "utf8" },
    );
    const findManyUserArgsTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/args/FindManyUserArgs.ts",
      { encoding: "utf8" },
    );
    const findOneUserArgsTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/args/FindOneUserArgs.ts",
      { encoding: "utf8" },
    );
    const updateManyUserArgsTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/args/UpdateManyUserArgs.ts",
      { encoding: "utf8" },
    );
    const updateOneUserArgsTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/args/UpdateOneUserArgs.ts",
      { encoding: "utf8" },
    );
    const upsertOneUserArgsTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/args/UpsertOneUserArgs.ts",
      { encoding: "utf8" },
    );
    const indexTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/args/index.ts",
      { encoding: "utf8" },
    );

    expect(createOneUserArgsTSFile).toMatchSnapshot("CreateOneUserArgs");
    expect(deleteManyUserArgsTSFile).toMatchSnapshot("DeleteManyUserArgs");
    expect(deleteOneUserArgsTSFile).toMatchSnapshot("DeleteOneUserArgs");
    expect(findManyUserArgsTSFile).toMatchSnapshot("FindManyUserArgs");
    expect(findOneUserArgsTSFile).toMatchSnapshot("FindOneUserArgs");
    expect(updateManyUserArgsTSFile).toMatchSnapshot("UpdateManyUserArgs");
    expect(updateOneUserArgsTSFile).toMatchSnapshot("UpdateOneUserArgs");
    expect(upsertOneUserArgsTSFile).toMatchSnapshot("UpsertOneUserArgs");
    expect(indexTSFile).toMatchSnapshot("Index");
  });
});
