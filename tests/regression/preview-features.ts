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

  describe("when distinct api is enabled", () => {
    it("should properly generate args classes for every method of crud resolver", async () => {
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
});
