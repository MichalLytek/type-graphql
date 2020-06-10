import "reflect-metadata";
import { promises as fs } from "fs";
import { buildSchema, Query, Resolver, Args, Ctx } from "type-graphql";
import { graphql } from "graphql";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("custom resolvers execution", () => {
  let outputDirPath: string;

  beforeAll(async () => {
    outputDirPath = generateArtifactsDirPath("functional-custom-resolvers");
    await fs.mkdir(outputDirPath, { recursive: true });
    const prismaSchema = /* prisma */ `
      enum Color {
        RED
        GREEN
        BLUE
      }

      model Post {
        uuid     String  @id @default(cuid())
        content  String
        color    Color
      }
    `;
    await generateCodeFromSchema(prismaSchema, { outputDirPath });
  });

  it("should be possible to use generated inputs, args and types to build own resolvers", async () => {
    const { Post, FindManyPostArgs } = require(outputDirPath);
    @Resolver()
    class CustomResolver {
      @Query(_returns => [Post])
      async customFindManyPost(
        @Args(_type => FindManyPostArgs) args: any,
        @Ctx() { prisma }: any,
      ) {
        return await prisma.post.findMany(args);
      }
    }
    const document = /* graphql */ `
      query {
        customFindManyPost(
          take: 1
          skip: 1
          where: {
            content: { startsWith: "Test" }
          }
          orderBy: {
            color: desc
          }
        ) {
          uuid
          color
        }
      }
    `;
    const prismaMock = {
      post: {
        findMany: jest.fn().mockResolvedValue([
          {
            uuid: "b0c0d78e-4dff-4cdd-ba23-9b417dc684e2",
            color: "RED",
          },
          {
            uuid: "72c8a188-3d46-45b3-b23f-7d420aa282f1",
            color: "BLUE",
          },
        ]),
      },
    };

    const graphQLSchema = await buildSchema({
      resolvers: [CustomResolver],
      validate: false,
      emitSchemaFile: outputDirPath + "/schema.graphql",
    });
    const graphQLSchemaSDL = await fs.readFile(
      outputDirPath + "/schema.graphql",
      { encoding: "utf8" },
    );

    const { data, errors } = await graphql(graphQLSchema, document, null, {
      prisma: prismaMock,
    });

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("custom posts resolver mocked response");
    expect(prismaMock.post.findMany.mock.calls).toMatchSnapshot(
      "findManyPost call args",
    );
    expect(graphQLSchemaSDL).toMatchSnapshot("graphQLSchemaSDL");
  });
});
