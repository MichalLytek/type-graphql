import "reflect-metadata";
import { promises as fs } from "fs";
import { buildSchema } from "type-graphql";
import { graphql, GraphQLSchema } from "graphql";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("crud resolvers execution", () => {
  let outputDirPath: string;
  let graphQLSchema: GraphQLSchema;

  beforeAll(async () => {
    outputDirPath = generateArtifactsDirPath("crud");
    await fs.mkdir(outputDirPath);
    const prismaSchema = /* prisma */ `
      model User {
        intIdField          Int     @id @default(autoincrement())
        uniqueStringField   String  @unique
        optionalStringField String?
        dateField           DateTime
      }
    `;
    await generateCodeFromSchema(prismaSchema, outputDirPath);
    const { UserCrudResolver } = require(outputDirPath +
      "/resolvers/crud/User/UserCrudResolver.ts");

    graphQLSchema = await buildSchema({
      resolvers: [UserCrudResolver],
      validate: false,
    });
  });

  afterAll(async () => {
    await fs.rmdir(outputDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should properly call Photon on `findOne` action", async () => {
    const document = /* graphql */ `
      query {
        findOneUser(where: { uniqueStringField: "uniqueValue" }) {
          intIdField
          dateField
        }
      }
    `;
    const photonMock = {
      users: {
        findOne: jest.fn().mockResolvedValue({
          intIdField: 1,
          dateField: new Date("2019-12-31T14:16:02.572Z"),
        }),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      photon: photonMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("findOneUser mocked response");
    expect(photonMock.users.findOne.mock.calls).toMatchSnapshot(
      "findOneUser call args",
    );
  });

  it("should properly call Photon on `findMany` action", async () => {
    const document = /* graphql */ `
      query {
        findManyUser(
          first: 0
          skip: 0
          orderBy: { intIdField: desc }
          where: { dateField: { lte: "2019-12-31T19:16:02.572Z" } }
        ) {
          intIdField
          dateField
        }
      }
    `;
    const photonMock = {
      users: {
        findMany: jest.fn().mockResolvedValue([
          {
            intIdField: 1,
            dateField: new Date("2019-12-31T14:16:02.572Z"),
          },
        ]),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      photon: photonMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("findManyUser mocked response");
    expect(photonMock.users.findMany.mock.calls).toMatchSnapshot(
      "findManyUser call args",
    );
  });

  it("should properly call Photon on `create` action", async () => {
    const document = /* graphql */ `
      mutation {
        createOneUser(
          data: {
            uniqueStringField: "unique"
            optionalStringField: "optional"
            dateField: "2019-12-31T14:16:02.572Z"
          }
        ) {
          intIdField
          dateField
        }
      }
    `;
    const photonMock = {
      users: {
        create: jest.fn().mockResolvedValue({
          intIdField: 1,
          dateField: new Date("2019-12-31T14:16:02.572Z"),
        }),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      photon: photonMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("createOneUser mocked response");
    expect(photonMock.users.create.mock.calls).toMatchSnapshot(
      "createOneUser call args",
    );
  });

  it("should properly call Photon on `delete` action", async () => {
    const document = /* graphql */ `
      mutation {
        deleteOneUser(
          where: {
            uniqueStringField: "unique"
          }
        ) {
          intIdField
          dateField
        }
      }
    `;
    const photonMock = {
      users: {
        delete: jest.fn().mockResolvedValue({
          intIdField: 1,
          dateField: new Date("2019-12-31T14:16:02.572Z"),
        }),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      photon: photonMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("deleteOneUser mocked response");
    expect(photonMock.users.delete.mock.calls).toMatchSnapshot(
      "deleteOneUser call args",
    );
  });

  it("should properly call Photon on `update` action", async () => {
    const document = /* graphql */ `
      mutation {
        updateOneUser(
          data: {
            dateField: "2019-12-31T14:16:02.572Z",
          }
          where: {
            uniqueStringField: "unique"
          }
        ) {
          intIdField
          dateField
        }
      }
    `;
    const photonMock = {
      users: {
        update: jest.fn().mockResolvedValue({
          intIdField: 1,
          dateField: new Date("2019-12-31T14:16:02.572Z"),
        }),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      photon: photonMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("updateOneUser mocked response");
    expect(photonMock.users.update.mock.calls).toMatchSnapshot(
      "updateOneUser call args",
    );
  });

  it("should properly call Photon on `updateMany` action", async () => {
    const document = /* graphql */ `
      mutation {
        updateManyUser(
          data: {
            optionalStringField: null,
          }
          where: {
            dateField: { lte: "2019-12-31T19:16:02.572Z" }
          }
        ) {
          count
        }
      }
    `;
    const photonMock = {
      users: {
        updateMany: jest.fn().mockResolvedValue({
          count: 3,
        }),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      photon: photonMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("updateManyUser mocked response");
    expect(photonMock.users.updateMany.mock.calls).toMatchSnapshot(
      "updateManyUser call args",
    );
  });

  it("should properly call Photon on `deleteMany` action", async () => {
    const document = /* graphql */ `
      mutation {
        deleteManyUser(
          where: {
            dateField: { lte: "2019-12-31T19:16:02.572Z" }
          }
        ) {
          count
        }
      }
    `;
    const photonMock = {
      users: {
        deleteMany: jest.fn().mockResolvedValue({
          count: 3,
        }),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      photon: photonMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("deleteManyUser mocked response");
    expect(photonMock.users.deleteMany.mock.calls).toMatchSnapshot(
      "deleteManyUser call args",
    );
  });

  it("should properly call Photon on `upsert` action", async () => {
    const document = /* graphql */ `
      mutation {
        upsertOneUser(
          where: {
            uniqueStringField: "unique"
          }
          create: {
            uniqueStringField: "unique"
            optionalStringField: "optional"
            dateField: "2019-12-31T14:16:02.572Z"
          }
          update: {
            optionalStringField: null,
          }
        ) {
          intIdField
          uniqueStringField
          optionalStringField
          dateField
        }
      }
    `;
    const photonMock = {
      users: {
        upsert: jest.fn().mockResolvedValue({
          intIdField: 1,
          uniqueStringField: "unique",
          optionalStringField: "optional",
          dateField: new Date("2019-12-31T14:16:02.572Z"),
        }),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      photon: photonMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("upsertOneUser mocked response");
    expect(photonMock.users.upsert.mock.calls).toMatchSnapshot(
      "upsertOneUser call args",
    );
  });

  // implement test when dmmf update aggregate details
  it.todo("should properly call Photon on `aggregate` action");
});
