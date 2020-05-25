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

  it("should properly generate resolver class when cannot pluralize model name", async () => {
    const schema = /* prisma */ `
      model Staff {
        intIdField          Int     @id @default(autoincrement())
        uniqueStringField   String  @unique
        optionalStringField String?
        dateField           DateTime
      }
    `;

    await generateCodeFromSchema(schema, {
      outputDirPath,
    });
    const staffCrudResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/Staff/StaffCrudResolver.ts",
    );

    expect(staffCrudResolverTSFile).toMatchSnapshot("StaffCrudResolver");
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
    const createUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/CreateUserArgs.ts",
    );
    const deleteManyUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/DeleteManyUserArgs.ts",
    );
    const deleteUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/DeleteUserArgs.ts",
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
    const updateUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/UpdateUserArgs.ts",
    );
    const upsertUserArgsTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/UpsertUserArgs.ts",
    );
    const indexTSFile = await readGeneratedFile(
      "/resolvers/crud/User/args/index.ts",
    );

    expect(createUserArgsTSFile).toMatchSnapshot("CreateUserArgs");
    expect(deleteManyUserArgsTSFile).toMatchSnapshot("DeleteManyUserArgs");
    expect(deleteUserArgsTSFile).toMatchSnapshot("DeleteUserArgs");
    expect(findManyUserArgsTSFile).toMatchSnapshot("FindManyUserArgs");
    expect(findOneUserArgsTSFile).toMatchSnapshot("FindOneUserArgs");
    expect(updateManyUserArgsTSFile).toMatchSnapshot("UpdateManyUserArgs");
    expect(updateUserArgsTSFile).toMatchSnapshot("UpdateUserArgs");
    expect(upsertUserArgsTSFile).toMatchSnapshot("UpsertUserArgs");
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
    const createUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/CreateUserResolver.ts",
    );
    const deleteManyUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/DeleteManyUserResolver.ts",
    );
    const deleteUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/DeleteUserResolver.ts",
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
    const updateUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/UpdateUserResolver.ts",
    );
    const upsertUserResolverTSFile = await readGeneratedFile(
      "/resolvers/crud/User/UpsertUserResolver.ts",
    );
    const indexTSFile = await readGeneratedFile("/resolvers/crud/index.ts");

    expect(createUserResolverTSFile).toMatchSnapshot("CreateOneUserResolver");
    expect(deleteManyUserResolverTSFile).toMatchSnapshot(
      "DeleteManyUserResolver",
    );
    expect(deleteUserResolverTSFile).toMatchSnapshot("DeleteUserResolver");
    expect(findManyUserResolverTSFile).toMatchSnapshot("FindManyUserResolver");
    expect(findOneUserResolverTSFile).toMatchSnapshot("FindOneUserResolver");
    expect(updateManyUserResolverTSFile).toMatchSnapshot(
      "UpdateManyUserResolver",
    );
    expect(updateUserResolverTSFile).toMatchSnapshot("UpdateUserResolver");
    expect(upsertUserResolverTSFile).toMatchSnapshot("UpsertUserResolver");
    expect(indexTSFile).toMatchSnapshot("Index");
  });

  describe("when model is renamed", () => {
    it("should properly generate resolver class for single prisma model", async () => {
      const schema = /* prisma */ `
        /// @@TypeGraphQL.type("Client")
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
      const clientCrudResolverTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/ClientCrudResolver.ts",
      );

      expect(clientCrudResolverTSFile).toMatchSnapshot("ClientCrudResolver");
    });

    it("should properly generate args classes for every method of crud resolver", async () => {
      const schema = /* prisma */ `
        /// @@TypeGraphQL.type("Client")
        model User {
          intIdField          Int     @id @default(autoincrement())
          uniqueStringField   String  @unique
          optionalStringField String?
          dateField           DateTime
        }
      `;

      await generateCodeFromSchema(schema, { outputDirPath });
      const createClientArgsTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/args/CreateClientArgs.ts",
      );
      const deleteManyClientArgsTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/args/DeleteManyClientArgs.ts",
      );
      const deleteClientArgsTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/args/DeleteClientArgs.ts",
      );
      const findManyClientArgsTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/args/FindManyClientArgs.ts",
      );
      const findOneClientArgsTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/args/FindOneClientArgs.ts",
      );
      const updateManyClientArgsTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/args/UpdateManyClientArgs.ts",
      );
      const updateClientArgsTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/args/UpdateClientArgs.ts",
      );
      const upsertClientArgsTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/args/UpsertClientArgs.ts",
      );
      const indexTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/args/index.ts",
      );

      expect(createClientArgsTSFile).toMatchSnapshot("CreateClientArgs");
      expect(deleteManyClientArgsTSFile).toMatchSnapshot(
        "DeleteManyClientArgs",
      );
      expect(deleteClientArgsTSFile).toMatchSnapshot("DeleteClientArgs");
      expect(findManyClientArgsTSFile).toMatchSnapshot("FindManyClientArgs");
      expect(findOneClientArgsTSFile).toMatchSnapshot("FindOneClientArgs");
      expect(updateManyClientArgsTSFile).toMatchSnapshot(
        "UpdateManyClientArgs",
      );
      expect(updateClientArgsTSFile).toMatchSnapshot("UpdateClientArgs");
      expect(upsertClientArgsTSFile).toMatchSnapshot("UpsertClientArgs");
      expect(indexTSFile).toMatchSnapshot("Index");
    });

    it("should properly generate actions resolver classes for prisma model", async () => {
      const schema = /* prisma */ `
        /// @@TypeGraphQL.type("Client")
        model User {
          intIdField          Int     @id @default(autoincrement())
          uniqueStringField   String  @unique
          optionalStringField String?
          dateField           DateTime
        }
      `;

      await generateCodeFromSchema(schema, { outputDirPath });
      const createClientResolverTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/CreateClientResolver.ts",
      );
      const deleteManyClientResolverTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/DeleteManyClientResolver.ts",
      );
      const deleteClientResolverTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/DeleteClientResolver.ts",
      );
      const findManyClientResolverTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/FindManyClientResolver.ts",
      );
      const findOneClientResolverTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/FindOneClientResolver.ts",
      );
      const updateManyClientResolverTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/UpdateManyClientResolver.ts",
      );
      const updateClientResolverTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/UpdateClientResolver.ts",
      );
      const upsertClientResolverTSFile = await readGeneratedFile(
        "/resolvers/crud/Client/UpsertClientResolver.ts",
      );
      const indexTSFile = await readGeneratedFile("/resolvers/crud/index.ts");

      expect(createClientResolverTSFile).toMatchSnapshot(
        "CreateOneClientResolver",
      );
      expect(deleteManyClientResolverTSFile).toMatchSnapshot(
        "DeleteManyClientResolver",
      );
      expect(deleteClientResolverTSFile).toMatchSnapshot(
        "DeleteClientResolver",
      );
      expect(findManyClientResolverTSFile).toMatchSnapshot(
        "FindManyClientResolver",
      );
      expect(findOneClientResolverTSFile).toMatchSnapshot(
        "FindOneClientResolver",
      );
      expect(updateManyClientResolverTSFile).toMatchSnapshot(
        "UpdateManyClientResolver",
      );
      expect(updateClientResolverTSFile).toMatchSnapshot(
        "UpdateClientResolver",
      );
      expect(upsertClientResolverTSFile).toMatchSnapshot(
        "UpsertClientResolver",
      );
      expect(indexTSFile).toMatchSnapshot("Index");
    });
  });
});
