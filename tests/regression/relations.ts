import { promises as fs } from "fs";

import generateArtifactsDirPath from "../helpers/artifacts-dir";
import { generateCodeFromSchema } from "../helpers/generate-code";
import createReadGeneratedFile, {
  ReadGeneratedFile,
} from "../helpers/read-file";

describe("relations resolvers generation", () => {
  let outputDirPath: string;
  let readGeneratedFile: ReadGeneratedFile;

  beforeEach(async () => {
    outputDirPath = generateArtifactsDirPath("regression-relations");
    await fs.mkdir(outputDirPath, { recursive: true });
    readGeneratedFile = createReadGeneratedFile(outputDirPath);
  });

  it("should properly generate resolvers classes for prisma models with cyclic relations", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model User {
        id     Int    @id @default(autoincrement())
        posts  Post[]
      }
      model Post {
        uuid      String  @id @default(cuid())
        /// author field doc
        author    User?   @relation(fields: [authorId], references: [id])
        authorId  Int?
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const userResolverTSFile = await readGeneratedFile(
      "/resolvers/relations/User/UserRelationsResolver.ts",
    );
    const postResolverTSFile = await readGeneratedFile(
      "/resolvers/relations/Post/PostRelationsResolver.ts",
    );

    expect(userResolverTSFile).toMatchSnapshot("User");
    expect(postResolverTSFile).toMatchSnapshot("Post");
  });

  it("should properly generate resolver class for single relation resolvers", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model User {
        id       Int      @id @default(autoincrement())
        name     String
        address  Address?
      }
      model Address {
        uuid      String  @id @default(cuid())
        content   String
        user      User    @relation(fields: [userId], references: [id])
        userId    Int
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });

    const userAddressResolverTSFile = await readGeneratedFile(
      "/resolvers/relations/User/UserRelationsResolver.ts",
    );

    expect(userAddressResolverTSFile).toMatchSnapshot("UserRelationsResolver");
  });

  it("should properly generate resolver and args class for array relation resolvers", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model User {
        id     Int     @id @default(autoincrement())
        posts  Post[]
      }
      model Post {
        uuid      String  @id @default(cuid())
        content   String
        author    User    @relation(fields: [authorId], references: [id])
        authorId  Int
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const userPostsArgsTSFile = await readGeneratedFile(
      "/resolvers/relations/User/args/UserPostsArgs.ts",
    );
    const userRelationsResolverTSFile = await readGeneratedFile(
      "/resolvers/relations/User/UserRelationsResolver.ts",
    );

    expect(userPostsArgsTSFile).toMatchSnapshot("UserPostsArgs");
    expect(userRelationsResolverTSFile).toMatchSnapshot(
      "UserRelationsResolver",
    );
  });

  it("should properly generate relation resolver class for model with unique fields", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model Movie {
        directorFirstName String
        directorLastName  String
        director          Director @relation(fields: [directorFirstName, directorLastName], references: [firstName, lastName])
        title             String

        @@id([directorFirstName, directorLastName, title])
      }

      model Director {
        firstName String
        lastName  String
        movies    Movie[]

        @@id([firstName, lastName])
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const directorRelationsResolverTSFile = await readGeneratedFile(
      "/resolvers/relations/Director/DirectorRelationsResolver.ts",
    );

    expect(directorRelationsResolverTSFile).toMatchSnapshot(
      "DirectorRelationsResolver",
    );
  });

  it("should properly generate relation resolver class for model with multi id keys with relation", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model Movie {
        directorFirstName String
        directorLastName  String
        director          Director @relation(fields: [directorFirstName, directorLastName], references: [firstName, lastName])
        title             String

        @@id([directorFirstName, directorLastName, title])
      }

      model Director {
        firstName String
        lastName  String
        movies    Movie[]

        @@id([firstName, lastName])
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });

    const movieRelationsResolverTSFile = await readGeneratedFile(
      "/resolvers/relations/Movie/MovieRelationsResolver.ts",
    );

    expect(movieRelationsResolverTSFile).toMatchSnapshot(
      "MovieRelationsResolver",
    );
  });

  it("should properly generate relation resolvers classes for models with renamed relation fields", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model User {
        id     Int    @id @default(autoincrement())
        /// @TypeGraphQL.field(name: "userPosts")
        posts  Post[]
      }
      model Post {
        uuid      String  @id @default(cuid())
        /// author field doc
        /// @TypeGraphQL.field(name: "postAuthor")
        author    User?   @relation(fields: [authorId], references: [id])
        authorId  Int?
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const userResolverTSFile = await readGeneratedFile(
      "/resolvers/relations/User/UserRelationsResolver.ts",
    );
    const postResolverTSFile = await readGeneratedFile(
      "/resolvers/relations/Post/PostRelationsResolver.ts",
    );

    expect(userResolverTSFile).toMatchSnapshot("UserRelationsResolver");
    expect(postResolverTSFile).toMatchSnapshot("PostRelationsResolver");
  });

  it("should properly generate relation resolvers classes for models with omitted relation field", async () => {
    const schema = /* prisma */ `
      datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
      }

      model User {
        id           Int    @id @default(autoincrement())
        posts        Post[]  @relation("posts")
        /// @TypeGraphQL.omit(output: true)
        editorPosts  Post[]  @relation("editorPosts")
      }
      model Post {
        uuid      String  @id @default(cuid())
        author    User?   @relation(fields: [authorId], references: [id], name: "posts")
        authorId  Int?
        /// @TypeGraphQL.omit(output: true)
        editor    User?   @relation(fields: [editorId], references: [id], name: "editorPosts")
        /// @TypeGraphQL.omit(output: true)
        editorId  Int?
      }
    `;

    await generateCodeFromSchema(schema, { outputDirPath });
    const userResolverTSFile = await readGeneratedFile(
      "/resolvers/relations/User/UserRelationsResolver.ts",
    );
    const postResolverTSFile = await readGeneratedFile(
      "/resolvers/relations/Post/PostRelationsResolver.ts",
    );

    expect(userResolverTSFile).toMatchSnapshot("UserRelationsResolver");
    expect(postResolverTSFile).toMatchSnapshot("PostRelationsResolver");
  });
});
