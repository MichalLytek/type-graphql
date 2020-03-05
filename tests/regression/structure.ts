import { promises as fs } from "fs";
import directoryTree from "directory-tree";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { stringifyDirectoryTrees } from "../helpers/structure";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("structure", () => {
  let outputDirPath: string;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-structure");
    await fs.mkdir(outputDirPath, { recursive: true });
  });

  it("should generate proper folders structure and file names for complex datamodel", async () => {
    const schema = /* prisma */ `
      enum Color {
        RED
        GREEN
        BLUE
      }

      model User {
        id    Int      @id @default(autoincrement())
        name  String?
        posts Post[]
      }

      model Post {
        uuid    String  @id @default(cuid())
        content String
        author  User
        color   Color
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const directoryStructure = directoryTree(outputDirPath);
    const directoryStructureString =
      "\n[type-graphql]\n" +
      stringifyDirectoryTrees(directoryStructure.children, 2);

    // FIXME: replace with `.toMatchInlineSnapshot()` when it starts working again
    expect(directoryStructureString).toMatchSnapshot("structure");
  });
});
