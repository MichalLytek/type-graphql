import { promises as fs } from "fs";

import generateCode from "../../src/generator/generate-code";
import getPhotonDmmfFromPrismaSchema from "../helpers/dmmf";
import getBaseDirPath from "../helpers/base-dir";

describe("crud", () => {
  let baseDirPath: string;

  beforeEach(async () => {
    baseDirPath = getBaseDirPath("crud");
    await fs.mkdir(baseDirPath);
  });

  afterEach(async () => {
    await fs.rmdir(baseDirPath, { recursive: true });
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

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const userCrudResolverTSFile = await fs.readFile(
      baseDirPath + "/resolvers/crud/User/UserCrudResolver.ts",
      { encoding: "utf-8" },
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

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const createOneUserArgsTSFile = await fs.readFile(
      baseDirPath + "/resolvers/crud/User/args/CreateOneUserArgs.ts",
      { encoding: "utf-8" },
    );
    const deleteOneUserArgsTSFile = await fs.readFile(
      baseDirPath + "/resolvers/crud/User/args/DeleteOneUserArgs.ts",
      { encoding: "utf-8" },
    );
    const findManyUserArgsTSFile = await fs.readFile(
      baseDirPath + "/resolvers/crud/User/args/FindManyUserArgs.ts",
      { encoding: "utf-8" },
    );
    const findOneUserArgsTSFile = await fs.readFile(
      baseDirPath + "/resolvers/crud/User/args/FindOneUserArgs.ts",
      { encoding: "utf-8" },
    );
    const updateManyUserArgsTSFile = await fs.readFile(
      baseDirPath + "/resolvers/crud/User/args/UpdateManyUserArgs.ts",
      { encoding: "utf-8" },
    );
    const updateOneUserArgsTSFile = await fs.readFile(
      baseDirPath + "/resolvers/crud/User/args/UpdateOneUserArgs.ts",
      { encoding: "utf-8" },
    );
    const upsertOneUserArgsTSFile = await fs.readFile(
      baseDirPath + "/resolvers/crud/User/args/UpsertOneUserArgs.ts",
      { encoding: "utf-8" },
    );
    const indexTSFile = await fs.readFile(
      baseDirPath + "/resolvers/crud/User/args/index.ts",
      { encoding: "utf-8" },
    );

    expect(createOneUserArgsTSFile).toMatchSnapshot("CreateOneUserArgs");
    expect(deleteOneUserArgsTSFile).toMatchSnapshot("DeleteOneUserArgs");
    expect(findManyUserArgsTSFile).toMatchSnapshot("FindManyUserArgs");
    expect(findOneUserArgsTSFile).toMatchSnapshot("FindOneUserArgs");
    expect(updateManyUserArgsTSFile).toMatchSnapshot("UpdateManyUserArgs");
    expect(updateOneUserArgsTSFile).toMatchSnapshot("UpdateOneUserArgs");
    expect(upsertOneUserArgsTSFile).toMatchSnapshot("UpsertOneUserArgs");
    expect(indexTSFile).toMatchSnapshot("Index");
  });
});
