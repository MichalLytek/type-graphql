import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("enums", () => {
  let outputDirPath: string;

  beforeEach(() => {
    outputDirPath = generateArtifactsDirPath("enums");
  });

  afterEach(async () => {
    await fs.rmdir(outputDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should properly generate code for normal enum", async () => {
    const schema = /* prisma */ `
      enum Color {
        RED
        GREEN
        BLUE
      }
    `;

    await generateCodeFromSchema(schema, outputDirPath);
    const colorEnumTSFile = await fs.readFile(
      outputDirPath + "/enums/color.ts",
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

    await generateCodeFromSchema(schema, outputDirPath);
    const roleEnumTSFile = await fs.readFile(outputDirPath + "/enums/role.ts", {
      encoding: "utf8",
    });

    expect(roleEnumTSFile).toMatchSnapshot();
  });
});
