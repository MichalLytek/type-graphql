import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";

describe("models", () => {
  let outputDirPath: string;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-models");
    await fs.mkdir(outputDirPath, { recursive: true });
  });

  afterEach(async () => {
    await fs.rmdir(outputDirPath, { recursive: true });
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

    await generateCodeFromSchema(schema, outputDirPath);
    const userModelTSFile = await fs.readFile(
      outputDirPath + "/models/User.ts",
      { encoding: "utf8" },
    );

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

    await generateCodeFromSchema(schema, outputDirPath);
    const userModelTSFile = await fs.readFile(
      outputDirPath + "/models/User.ts",
      { encoding: "utf8" },
    );

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

    await generateCodeFromSchema(schema, outputDirPath);
    const userModelTSFile = await fs.readFile(
      outputDirPath + "/models/User.ts",
      { encoding: "utf8" },
    );
    const postModelTSFile = await fs.readFile(
      outputDirPath + "/models/Post.ts",
      { encoding: "utf8" },
    );

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
        /// relation doc
        posts        Post[]
      }

      model Post {
        id  Int  @id @default(autoincrement())
      }
    `;

    await generateCodeFromSchema(schema, outputDirPath);
    const userModelTSFile = await fs.readFile(
      outputDirPath + "/models/User.ts",
      { encoding: "utf8" },
    );

    expect(userModelTSFile).toMatchSnapshot("User");
  });
});
