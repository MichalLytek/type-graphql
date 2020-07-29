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

  describe("when `distinct` is enabled", () => {
    it("should properly generate args classes and enums for model actions resolvers", async () => {
      const schema = /* prisma */ `
        model User {
          intIdField          Int      @id @default(autoincrement())
          uniqueStringField   String   @unique
          optionalFloatField  Float?
          dateField           DateTime
        }
      `;

      await generateCodeFromSchema(schema, {
        outputDirPath,
        enabledPreviewFeatures: ["distinct"],
      });
      const aggregateUserArgsTSFile = await readGeneratedFile(
        "/resolvers/crud/User/args/AggregateUserArgs.ts",
      );
      const findManyUserArgsTSFile = await readGeneratedFile(
        "/resolvers/crud/User/args/FindManyUserArgs.ts",
      );
      const userDistinctFieldEnumTSFile = await readGeneratedFile(
        "/enums/UserDistinctFieldEnum.ts",
      );
      const enumsIndexTSFile = await readGeneratedFile("/enums/index.ts");

      expect(aggregateUserArgsTSFile).toMatchSnapshot("AggregateUserArgs");
      expect(findManyUserArgsTSFile).toMatchSnapshot("FindManyUserArgs");
      expect(userDistinctFieldEnumTSFile).toMatchSnapshot(
        "UserDistinctFieldEnum",
      );
      expect(enumsIndexTSFile).toMatchSnapshot("enums index");
    });
  });

  describe("when `connectOrCreate` is enabled", () => {
    it("should properly generate input type classes for connectOrCreate", async () => {
      const schema = /* prisma */ `
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
