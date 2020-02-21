import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("crud", () => {
  let outputDirPath: string;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-crud");
    await fs.mkdir(outputDirPath, { recursive: true });
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

    await generateCodeFromSchema(schema, { outputDirPath });
    const userCrudResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/UserCrudResolver.ts",
      { encoding: "utf8" },
    );

    expect(userCrudResolverTSFile).toMatchSnapshot("UserCrudResolver");
  });

  it("should properly generate resolver class when useOriginalMapping is used", async () => {
    const schema = /* prisma */ `
      model User {
        intIdField          Int     @id @default(autoincrement())
        uniqueStringField   String  @unique
        optionalStringField String?
        dateField           DateTime
      }
    `;

    await generateCodeFromSchema(schema, {
      outputDirPath,
      useOriginalMapping: true,
    });
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

    await generateCodeFromSchema(schema, { outputDirPath });
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

  it("should properly generate actions resolver classes for prisma model", async () => {
    const schema = /* prisma */ `
      model User {
        intIdField          Int     @id @default(autoincrement())
        uniqueStringField   String  @unique
        optionalStringField String?
        dateField           DateTime
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const createOneUserArgsTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/CreateOneUserResolver.ts",
      { encoding: "utf8" },
    );
    const deleteManyUserResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/DeleteManyUserResolver.ts",
      { encoding: "utf8" },
    );
    const deleteOneUserResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/DeleteOneUserResolver.ts",
      { encoding: "utf8" },
    );
    const findManyUserResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/FindManyUserResolver.ts",
      { encoding: "utf8" },
    );
    const findOneUserResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/FindOneUserResolver.ts",
      { encoding: "utf8" },
    );
    const updateManyUserResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/UpdateManyUserResolver.ts",
      { encoding: "utf8" },
    );
    const updateOneUserResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/UpdateOneUserResolver.ts",
      { encoding: "utf8" },
    );
    const upsertOneUserResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/User/UpsertOneUserResolver.ts",
      { encoding: "utf8" },
    );
    const indexTSFile = await fs.readFile(
      outputDirPath + "/resolvers/crud/index.ts",
      { encoding: "utf8" },
    );

    expect(createOneUserArgsTSFile).toMatchSnapshot("CreateOneUserResolver");
    expect(deleteManyUserResolverTSFile).toMatchSnapshot(
      "DeleteManyUserResolver",
    );
    expect(deleteOneUserResolverTSFile).toMatchSnapshot(
      "DeleteOneUserResolver",
    );
    expect(findManyUserResolverTSFile).toMatchSnapshot("FindManyUserResolver");
    expect(findOneUserResolverTSFile).toMatchSnapshot("FindOneUserResolver");
    expect(updateManyUserResolverTSFile).toMatchSnapshot(
      "UpdateManyUserResolver",
    );
    expect(updateOneUserResolverTSFile).toMatchSnapshot(
      "UpdateOneUserResolver",
    );
    expect(upsertOneUserResolverTSFile).toMatchSnapshot(
      "UpsertOneUserResolver",
    );
    expect(indexTSFile).toMatchSnapshot("Index");
  });
});
