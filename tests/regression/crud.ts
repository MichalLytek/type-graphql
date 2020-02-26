import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";
import createReadGeneratedFile, {
  ReadGeneratedFile,
} from "../helpers/read-file";

describe("crud", () => {
  let outputDirPath: string;
  let readGeneratedFile: ReadGeneratedFile;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-crud");
    await fs.mkdir(outputDirPath, { recursive: true });
    readGeneratedFile = createReadGeneratedFile(outputDirPath);
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
    const userCrudResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/UserCrudResolver.ts",
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
    const userCrudResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/UserCrudResolver.ts",
    );
    const findOneUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/FindOneUserResolver.ts",
    );

    expect(userCrudResolverTSFile).toMatchSnapshot("UserCrudResolver");
    expect(findOneUserResolverTSFile).toMatchSnapshot("FindOneUserResolver");
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
    const createOneUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/CreateOneUserArgs.ts",
    );
    const deleteManyUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/DeleteManyUserArgs.ts",
    );
    const deleteOneUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/DeleteOneUserArgs.ts",
    );
    const findManyUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/FindManyUserArgs.ts",
    );
    const findOneUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/FindOneUserArgs.ts",
    );
    const updateManyUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/UpdateManyUserArgs.ts",
    );
    const updateOneUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/UpdateOneUserArgs.ts",
    );
    const upsertOneUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/UpsertOneUserArgs.ts",
    );
    const indexTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/index.ts",
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
    const createOneUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/CreateOneUserResolver.ts",
    );
    const deleteManyUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/DeleteManyUserResolver.ts",
    );
    const deleteOneUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/DeleteOneUserResolver.ts",
    );
    const findManyUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/FindManyUserResolver.ts",
    );
    const findOneUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/FindOneUserResolver.ts",
    );
    const updateManyUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/UpdateManyUserResolver.ts",
    );
    const updateOneUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/UpdateOneUserResolver.ts",
    );
    const upsertOneUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/UpsertOneUserResolver.ts",
    );
    const indexTSFile = await readGeneratedFile("/resolvers/crud/index.ts");

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
