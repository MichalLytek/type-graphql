import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("enums", () => {
  let outputDirPath: string;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-enums");
    await fs.mkdir(outputDirPath, { recursive: true });
  });

  it("should properly generate code for normal enum", async () => {
    const schema = /* prisma */ `
      enum Color {
        RED
        GREEN
        BLUE
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const colorEnumTSFile = await fs.readFile(
      outputDirPath + "/enums/Color.ts",
      { encoding: "utf8" },
    );

    expect(colorEnumTSFile).toMatchSnapshot();
  });

  it("should properly generate code for enum with docs", async () => {
    const schema = /* prisma */ `
      /// Role enum doc
      enum Role {
        // User member comment
        USER
        ADMIN
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const roleEnumTSFile = await fs.readFile(outputDirPath + "/enums/Role.ts", {
      encoding: "utf8",
    });

    expect(roleEnumTSFile).toMatchSnapshot();
  });
});
