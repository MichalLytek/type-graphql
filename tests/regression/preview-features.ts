import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";
import createReadGeneratedFile, {
  ReadGeneratedFile,
} from "../helpers/read-file";

describe("preview features", () => {
  let outputDirPath: string;
  let readGeneratedFile: ReadGeneratedFile;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("preview-features");
    await fs.mkdir(outputDirPath, { recursive: true });
    readGeneratedFile = createReadGeneratedFile(outputDirPath);
  });

  describe("when `connectOrCreate` is enabled", () => {
    it("should properly generate input type classes for connectOrCreate", async () => {
      const schema = /* prisma */ `
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }

        model User {
          id          Int     @id @default(autoincrement())
          name        String
          postsField  Post[]
        }
        model Post {
          id        Int     @id @default(autoincrement())
          title     String
          authorId  Int
          author    User    @relation(fields: [authorId], references: [id])
        }
      `;

      await generateCodeFromSchema(schema, {
        outputDirPath,
        enabledPreviewFeatures: ["connectOrCreate"],
      });
      const userUpdateOneRequiredWithoutPostsFieldInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/UserUpdateOneRequiredWithoutPostsFieldInput.ts",
      );
      const userCreateOrConnectWithoutpostInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/UserCreateOrConnectWithoutPostInput.ts",
      );
      const userCreateOneWithoutPostsFieldInputTSFile = await readGeneratedFile(
        "/resolvers/inputs/UserCreateOneWithoutPostsFieldInput.ts",
      );
      const inputsIndexTSFile = await readGeneratedFile(
        "/resolvers/inputs/index.ts",
      );

      expect(userUpdateOneRequiredWithoutPostsFieldInputTSFile).toMatchSnapshot(
        "UserUpdateOneRequiredWithoutPostsFieldInput",
      );
      expect(userCreateOrConnectWithoutpostInputTSFile).toMatchSnapshot(
        "UserCreateOrConnectWithoutPostInput",
      );
      expect(userCreateOneWithoutPostsFieldInputTSFile).toMatchSnapshot(
        "UserCreateOneWithoutPostsFieldInput",
      );
      expect(inputsIndexTSFile).toMatchSnapshot("inputs index");
    });
  });
});
