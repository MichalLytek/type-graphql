import { promises as fs } from "fs";

import generateCode from "../../src/generator/generate-code";
import getPhotonDmmfFromPrismaSchema from "../helpers/dmmf";
import getBaseDirPath from "../helpers/base-dir";

describe("relations", () => {
  let baseDirPath: string;

  beforeEach(async () => {
    baseDirPath = getBaseDirPath("relations");
    await fs.mkdir(baseDirPath);
  });

  afterEach(async () => {
    await fs.rmdir(baseDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should properly generate resolvers classes for prisma models with cyclic relations", async () => {
    const schema = /* prisma */ `
      model User {
        id     Int    @id @default(autoincrement())
        posts  Post[]
      }
      model Post {
        uuid   String  @id @default(cuid())
        author User?
      }
    `;

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const userResolverTSFile = await fs.readFile(
      baseDirPath + "/resolvers/relations/User/UserRelationsResolver.ts",
      { encoding: "utf-8" },
    );
    const postResolverTSFile = await fs.readFile(
      baseDirPath + "/resolvers/relations/Post/PostRelationsResolver.ts",
      { encoding: "utf-8" },
    );

    expect(userResolverTSFile).toMatchSnapshot("User");
    expect(postResolverTSFile).toMatchSnapshot("Post");
  });

  it("should properly generate args class for array relation resolvers", async () => {
    const schema = /* prisma */ `
      model User {
        id     Int    @id @default(autoincrement())
        posts  Post[]
      }
      model Post {
        uuid     String  @id @default(cuid())
        content  String
      }
    `;

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const userPostsArgsTSFile = await fs.readFile(
      baseDirPath + "/resolvers/relations/User/args/UserPostsArgs.ts",
      { encoding: "utf-8" },
    );

    expect(userPostsArgsTSFile).toMatchSnapshot("UserPostsArgs");
  });
});
