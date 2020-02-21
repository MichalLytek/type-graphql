import "reflect-metadata";
import { promises as fs } from "fs";
import { buildSchema, Query, Resolver } from "type-graphql";
import { graphql, GraphQLSchema } from "graphql";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("relations resolvers execution", () => {
  let outputDirPath: string;
  let graphQLSchema: GraphQLSchema;

  beforeAll(async () => {
    outputDirPath = generateArtifactsDirPath("functional-relations");
    await fs.mkdir(outputDirPath, { recursive: true });
    const prismaSchema = /* prisma */ `
      enum Color {
        RED
        GREEN
        BLUE
      }

      model User {
        id     Int      @id @default(autoincrement())
        name   String?
        posts  Post[]
      }

      model Post {
        uuid     String  @id @default(cuid())
        content  String
        author   User
        color    Color
      }
    `;
    await generateCodeFromSchema(prismaSchema, { outputDirPath });
    const {
      UserRelationsResolver,
      PostRelationsResolver,
      User,
      Post,
    } = require(outputDirPath);
    @Resolver()
    class CustomResolver {
      @Query(returns => [User])
      users(): any[] {
        return [
          {
            id: 1,
            name: "Test 1",
          },
          {
            id: 2,
            name: "Test 2",
          },
        ];
      }
      @Query(returns => [Post])
      posts(): any[] {
        return [
          {
            uuid: "b0c0d78e-4dff-4cdd-ba23-9b417dc684e2",
            color: "RED",
          },
          {
            uuid: "72c8a188-3d46-45b3-b23f-7d420aa282f1",
            color: "BLUE",
          },
        ];
      }
    }

    graphQLSchema = await buildSchema({
      resolvers: [CustomResolver, UserRelationsResolver, PostRelationsResolver],
      validate: false,
    });
  });

  afterAll(async () => {
    await fs.rmdir(outputDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should properly call PrismaClient on fetching array relations", async () => {
    const document = /* graphql */ `
      query {
        users {
          name
          posts {
            uuid
            color
          }
        }
      }
    `;
    const prismaMock = {
      user: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
          },
          {
            id: 2,
            posts: [
              {
                uuid: "b0c0d78e-4dff-4cdd-ba23-9b417dc684e2",
                color: "RED",
              },
              {
                uuid: "72c8a188-3d46-45b3-b23f-7d420aa282f1",
                color: "BLUE",
              },
            ],
          },
        ]),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      prisma: prismaMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("users with posts mocked response");
    expect(prismaMock.user.findMany.mock.calls).toMatchSnapshot(
      "findManyUser relations call args",
    );
  });

  it("should properly call PrismaClient on fetching array relations with args", async () => {
    const document = /* graphql */ `
      query {
        users {
          name
          posts(skip: 1, first: 1, where: {
            content: {
              startsWith: "test"
            }
          }) {
            uuid
            color
          }
        }
      }
    `;
    const prismaMock = {
      user: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 1,
          },
          {
            id: 2,
            posts: [
              {
                uuid: "b0c0d78e-4dff-4cdd-ba23-9b417dc684e2",
                color: "RED",
              },
              {
                uuid: "72c8a188-3d46-45b3-b23f-7d420aa282f1",
                color: "BLUE",
              },
            ],
          },
        ]),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      prisma: prismaMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("users with posts mocked response");
    expect(prismaMock.user.findMany.mock.calls).toMatchSnapshot(
      "findManyUser relations call args",
    );
  });

  it("should properly call PrismaClient on fetching single relation", async () => {
    const document = /* graphql */ `
      query {
        posts {
          uuid
          color
          author {
            id
            name
          }
        }
      }
    `;
    const prismaMock = {
      post: {
        findMany: jest.fn().mockResolvedValue([
          {
            uuid: "b0c0d78e-4dff-4cdd-ba23-9b417dc684e2",
            author: {
              id: 1,
              name: "Test 1",
            },
          },
          {
            uuid: "72c8a188-3d46-45b3-b23f-7d420aa282f1",
            author: {
              id: 1,
              name: "Test 1",
            },
          },
        ]),
      },
    };

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      prisma: prismaMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("posts with authors mocked response");
    expect(prismaMock.post.findMany.mock.calls).toMatchSnapshot(
      "findManyPost relations call args",
    );
  });
});
