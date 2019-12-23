import { promises as fs } from "fs";

import generateCode from "../src/generator/generate-code";
import getPhotonDmmfFromPrismaSchema from "./helpers/dmmf";
import getBaseDirPath from "./helpers/base-dir";

describe("enums", () => {
  let baseDirPath: string;

  beforeEach(() => {
    baseDirPath = getBaseDirPath("enums");
  });

  afterEach(async () => {
    await fs.rmdir(baseDirPath, { recursive: true });
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

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const colorEnumTSFile = await fs.readFile(baseDirPath + "/enums/color.ts", {
      encoding: "utf-8",
    });

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

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const roleEnumTSFile = await fs.readFile(baseDirPath + "/enums/role.ts", {
      encoding: "utf-8",
    });

    expect(roleEnumTSFile).toMatchSnapshot();
  });
});
