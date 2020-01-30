import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("relations resolvers generation", () => {
  let outputDirPath: string;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-relations");
    await fs.mkdir(outputDirPath, { recursive: true });
  });

  afterEach(async () => {
    await fs.rmdir(outputDirPath, { recursive: true });
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
        /// author field doc
        author User?
      }
    `;

    await generateCodeFromSchema(schema, outputDirPath);
    const userResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/relations/User/UserRelationsResolver.ts",
      { encoding: "utf8" },
    );
    const postResolverTSFile = await fs.readFile(
      outputDirPath + "/resolvers/relations/Post/PostRelationsResolver.ts",
      { encoding: "utf8" },
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

    await generateCodeFromSchema(schema, outputDirPath);
    const userPostsArgsTSFile = await fs.readFile(
      outputDirPath + "/resolvers/relations/User/args/UserPostsArgs.ts",
      { encoding: "utf8" },
    );

    expect(userPostsArgsTSFile).toMatchSnapshot("UserPostsArgs");
  });
});
