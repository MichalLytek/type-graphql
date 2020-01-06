import "reflect-metadata";
import { promises as fs } from "fs";
import directoryTree from "directory-tree";
import path from "path";
import util from "util";
import childProcess from "child_process";
import { buildSchema } from "type-graphql";
import { graphql } from "graphql";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { stringifyDirectoryTrees } from "../helpers/structure";

const exec = util.promisify(childProcess.exec);

describe("generator integration", () => {
  let cwdDirPath: string;
  let schema: string;

  beforeEach(async () => {
    cwdDirPath = generateArtifactsDirPath("integration");
    await fs.mkdir(cwdDirPath);

    schema = /* prisma */ `
      datasource db {
        provider = "sqlite"
        url      = "file:./dev.db"
      }

      generator photon {
        provider = "photonjs"
        output   = "./generated/photon"
      }

      generator typegraphql {
        provider = "../../../src/cli/dev.ts"
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
        uuid     String  @id @default(cuid())
        content  String
        author   User
        color    Color
      }
    `;
    await fs.writeFile(path.join(cwdDirPath, "schema.prisma"), schema);
  });

  afterEach(async () => {
    await fs.rmdir(cwdDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should generates TypeGraphQL classes files to output folder by running `prisma2 generate`", async () => {
    const { stderr } = await exec("npx prisma2 generate", {
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
    const { stderr } = await exec("npx prisma2 generate", {
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
    const tsconfigContent = /* json */ `
      {
        "compilerOptions": {
          "target": "es2018",
          "module": "commonjs",
          "strict": true,
          "skipLibCheck": true,
          "esModuleInterop": true,
          "experimentalDecorators": true,
          "emitDecoratorMetadata": true,
          "forceConsistentCasingInFileNames": true
        }
      }
    `;
    const typegraphqlfolderPath = path.join(
      cwdDirPath,
      "generated",
      "type-graphql",
    );

    const prisma2GenerateResult = await exec("npx prisma2 generate", {
      cwd: cwdDirPath,
    });
    await fs.writeFile(
      path.join(typegraphqlfolderPath, "tsconfig.json"),
      tsconfigContent,
    );
    const tscResult = await exec("npx tsc --noEmit", {
      cwd: typegraphqlfolderPath,
    });

    expect(prisma2GenerateResult.stderr).toHaveLength(0);
    expect(tscResult.stdout).toHaveLength(0);
    expect(tscResult.stderr).toHaveLength(0);
  }, 60000);

  it("should properly fetch the data from DB using Photon while queried by GraphQL schema", async () => {
    const prisma2GenerateResult = await exec("npx prisma2 generate", {
      cwd: cwdDirPath,
    });
    // console.log(prisma2GenerateResult);
    expect(prisma2GenerateResult.stderr).toHaveLength(0);

    const liftSaveResult = await exec(
      "npx prisma2 lift save --name='init' --create-db",
      { cwd: cwdDirPath },
    );
    // console.log(liftSaveResult);
    expect(liftSaveResult.stderr).toHaveLength(0);

    const liftUpResult = await exec("npx prisma2 lift up", {
      cwd: cwdDirPath,
    });
    // console.log(liftUpResult);
    expect(liftUpResult.stderr).toHaveLength(0);

    const { Photon } = require(cwdDirPath + "/generated/photon");
    const photon = new Photon();

    await photon.users.create({ data: { name: "test1" } });
    await photon.users.create({
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
    await photon.users.create({ data: { name: "not test" } });

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
        findManyUser(where: {
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
      photon,
    });
    await photon.disconnect();

    expect(errors).toBeUndefined();
    expect(data).toMatchSnapshot("graphql data");
  }, 100000);
});
