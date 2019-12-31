import { promises as fs } from "fs";
import directoryTree from "directory-tree";
import path from "path";
import util from "util";
import childProcess from "child_process";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { stringifyDirectoryTrees } from "../helpers/structure";

const exec = util.promisify(childProcess.exec);

describe("generator integration", () => {
  let cwdDirPath: string;

  beforeEach(async () => {
    cwdDirPath = generateArtifactsDirPath("integration");
    await fs.mkdir(cwdDirPath);
  });

  afterEach(async () => {
    await fs.rmdir(cwdDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should generates TypeGraphQL classes files to output folder by running `prisma2 generate`", async () => {
    const schema = /* prisma */ `
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
});
