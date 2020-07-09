import "reflect-metadata";
import { promises as fs } from "fs";
import directoryTree from "directory-tree";
import path from "path";
import util from "util";
import childProcess from "child_process";
import { buildSchema } from "type-graphql";
import { graphql } from "graphql";
import pg from "pg";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { stringifyDirectoryTrees } from "../helpers/structure";

const exec = util.promisify(childProcess.exec);

describe("generator integration", () => {
  let cwdDirPath: string;
  let schema: string;

  beforeEach(async () => {
    cwdDirPath = generateArtifactsDirPath("functional-integration");
    await fs.mkdir(cwdDirPath, { recursive: true });

    schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      generator client {
        provider = "prisma-client-js"
        output   = "./generated/client"
      }

      generator typegraphql {
        provider = "node ../../../src/cli/dev.ts"
        output   = "./generated/type-graphql"
      }

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
        uuid      String  @id @default(cuid())
        content   String
        author    User    @relation(fields: [authorId], references: [id])
        authorId  Int
        color     Color
      }
    `;
    await fs.writeFile(path.join(cwdDirPath, "schema.prisma"), schema);
    await fs.writeFile(
      path.join(cwdDirPath, ".env"),
      `DATABASE_URL=${process.env.TEST_DATABASE_URL}`,
    );
  });

  it("should generates TypeGraphQL classes files to output folder by running `prisma generate`", async () => {
    const { stderr } = await exec("npx prisma generate", {
      cwd: cwdDirPath,
    });

    const directoryStructure = directoryTree(
      cwdDirPath + "/generated/type-graphql",
    );
    const directoryStructureString =
      "\n[type-graphql]\n" +
      stringifyDirectoryTrees(directoryStructure.children, 2);

    expect(stderr).toHaveLength(0);
    expect(directoryStructureString).toMatchSnapshot("files structure");
  }, 60000);

  it("should be able to use generate TypeGraphQL classes files to generate GraphQL schema", async () => {
    const { stderr } = await exec("npx prisma generate", {
      cwd: cwdDirPath,
    });
    const {
      UserCrudResolver,
      PostCrudResolver,
      UserRelationsResolver,
      PostRelationsResolver,
    } = require(cwdDirPath + "/generated/type-graphql");
    await buildSchema({
      resolvers: [
        UserCrudResolver,
        PostCrudResolver,
        UserRelationsResolver,
        PostRelationsResolver,
      ],
      validate: false,
      emitSchemaFile: cwdDirPath + "/schema.graphql",
    });
    const graphQLSchemaSDL = await fs.readFile(cwdDirPath + "/schema.graphql", {
      encoding: "utf8",
    });

    expect(stderr).toHaveLength(0);
    expect(graphQLSchemaSDL).toMatchSnapshot("graphQLSchemaSDL");
  }, 60000);

  it("should be able to generate TypeGraphQL classes files without any type errors", async () => {
    const tsconfigContent = {
      compilerOptions: {
        target: "es2019",
        module: "commonjs",
        lib: ["es2019"],
        strict: true,
        skipLibCheck: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        forceConsistentCasingInFileNames: true,
      },
    };
    const typegraphqlfolderPath = path.join(
      cwdDirPath,
      "generated",
      "type-graphql",
    );

    const prismaGenerateResult = await exec("npx prisma generate", {
      cwd: cwdDirPath,
    });
    await fs.writeFile(
      path.join(typegraphqlfolderPath, "tsconfig.json"),
      JSON.stringify(tsconfigContent),
    );
    const tscResult = await exec("npx tsc --noEmit", {
      cwd: typegraphqlfolderPath,
    });

    expect(prismaGenerateResult.stderr).toHaveLength(0);
    expect(tscResult.stdout).toHaveLength(0);
    expect(tscResult.stderr).toHaveLength(0);
  }, 60000);

  it("should properly fetch the data from DB using PrismaClient while queried by GraphQL schema", async () => {
    const prismaGenerateResult = await exec("npx prisma generate", {
      cwd: cwdDirPath,
    });
    // console.log(prismaGenerateResult);
    expect(prismaGenerateResult.stderr).toHaveLength(0);

    // drop database before migrate
    const originalDatabaseUrl = process.env.TEST_DATABASE_URL!;
    const [dbName, ...databaseUrlParts] = originalDatabaseUrl
      .split("/")
      .reverse();
    const databaseUrl = databaseUrlParts.reverse().join("/") + "/postgres";
    const pgClient = new pg.Client({
      connectionString: databaseUrl,
    });
    await pgClient.connect();
    await pgClient.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    await pgClient.end();

    const migrateSaveResult = await exec(
      "npx prisma migrate save --experimental --name='init' --create-db",
      { cwd: cwdDirPath },
    );
    // console.log(migrateSaveResult);
    expect(migrateSaveResult.stderr).toHaveLength(0);

    const migrateUpResult = await exec("npx prisma migrate up --experimental", {
      cwd: cwdDirPath,
    });
    // console.log(migrateUpResult);
    expect(migrateUpResult.stderr).toHaveLength(0);

    const { PrismaClient } = require(cwdDirPath + "/generated/client");
    const prisma = new PrismaClient();

    await prisma.user.create({ data: { name: "test1" } });
    await prisma.user.create({
      data: {
        name: "test2",
        posts: {
          create: [
            {
              color: "RED",
              content: "post content",
            },
          ],
        },
      },
    });
    await prisma.user.create({ data: { name: "not test" } });

    const {
      UserCrudResolver,
      PostCrudResolver,
      UserRelationsResolver,
      PostRelationsResolver,
    } = require(cwdDirPath + "/generated/type-graphql");
    const graphQLSchema = await buildSchema({
      resolvers: [
        UserCrudResolver,
        PostCrudResolver,
        UserRelationsResolver,
        PostRelationsResolver,
      ],
      validate: false,
    });

    const query = /* graphql */ `
      query {
        users(where: {
          name: {
            startsWith: "test"
          }
        }) {
          id
          name
          posts {
            content
            color
            author {
              name
            }
          }
        }
      }
    `;
    const { data, errors } = await graphql(graphQLSchema, query, null, {
      prisma,
    });
    await prisma.disconnect();

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("graphql data");
  }, 100000);
});
