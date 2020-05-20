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
    outputDirPath = generateArtifactsDirPath("functional-crud");
    await fs.mkdir(outputDirPath, { recursive: true });
    const prismaSchema = /* prisma */ `
      model User {
        id           Int       @id @default(autoincrement())
        dateOfBirth  DateTime
        // @@TypeGraphQL.field("firstName")
        name         String
      }
    `;
    await generateCodeFromSchema(prismaSchema, { outputDirPath });
    const { UserCrudResolver } = require(outputDirPath +
      "/resolvers/crud/User/UserCrudResolver.ts");

    graphQLSchema = await buildSchema({
      resolvers: [UserCrudResolver],
      validate: false,
    });
  });

  it("should properly resolve aliased field values from prisma model values", async () => {
    const document = /* graphql */ `
      query {
        user(where: { id: 1 }) {
          id
          dateOfBirth
          firstName
        }
      }
    `;
    const prismaMock = {
      user: {
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          dateOfBirth: new Date("2019-12-31T14:16:02.572Z"),
          name: "John",
        }),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      prisma: prismaMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("user mocked response");
  });
});
