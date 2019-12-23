import { promises as fs } from "fs";

import generateCode from "../src/generator/generate-code";
import getPhotonDmmfFromPrismaSchema from "./helpers/dmmf";
import getBaseDirPath from "./helpers/base-dir";

describe("models", () => {
  let baseDirPath: string;

  beforeEach(async () => {
    baseDirPath = getBaseDirPath("models");
    await fs.mkdir(baseDirPath);
  });

  afterEach(async () => {
    await fs.rmdir(baseDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should properly generate object type class for prisma model with different scalar fields types", async () => {
    const schema = /* prisma */ `
      model User {
        intIdField          Int     @id @default(autoincrement())
        stringField         String  @unique
        optionalStringField String?
        intField            Int
        floatField          Float
        booleanField        Boolean
        dateField           DateTime
      }
    `;

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const userModelTSFile = await fs.readFile(baseDirPath + "/models/User.ts", {
      encoding: "utf-8",
    });

    expect(userModelTSFile).toMatchSnapshot("User");
  });

  it("should properly generate object type class for prisma model with enum and alias fields types", async () => {
    const schema = /* prisma */ `
      type Numeric = Float

      enum Sample {
        SAMPLE
      }

      model User {
        intIdField  Int     @id @default(autoincrement())
        aliasField  Numeric
        enumField   Sample
      }
    `;

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const userModelTSFile = await fs.readFile(baseDirPath + "/models/User.ts", {
      encoding: "utf-8",
    });

    expect(userModelTSFile).toMatchSnapshot("User");
  });

  it("should properly generate object type classes for prisma models with cyclic relations", async () => {
    const schema = /* prisma */ `
      model User {
        id     Int    @id @default(autoincrement())
        posts  Post[]
      }
      model Post {
        id     Int  @id @default(autoincrement())
        author User
      }
    `;

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const userModelTSFile = await fs.readFile(baseDirPath + "/models/User.ts", {
      encoding: "utf-8",
    });
    const postModelTSFile = await fs.readFile(baseDirPath + "/models/Post.ts", {
      encoding: "utf-8",
    });

    expect(userModelTSFile).toMatchSnapshot("User");
    expect(postModelTSFile).toMatchSnapshot("Post");
  });

  it("should properly generate object type class for prisma model with descriptions", async () => {
    const schema = /* prisma */ `
      /// User model doc
      model User {
        id           Int    @id @default(autoincrement())
        /// field doc
        stringField  String
        // field comment
        intField     Int
      }
    `;

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const userModelTSFile = await fs.readFile(baseDirPath + "/models/User.ts", {
      encoding: "utf-8",
    });

    expect(userModelTSFile).toMatchSnapshot("User");
  });
});
