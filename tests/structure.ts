import { promises as fs } from "fs";
import directoryTree, { DirectoryTree } from "directory-tree";

import generateCode from "../src/generator/generate-code";
import getPhotonDmmfFromPrismaSchema from "./helpers/dmmf";
import getBaseDirPath from "./helpers/base-dir";

function stringifyDirectoryTrees(
  directoryStructure: DirectoryTree[] | undefined,
  indent = 0,
): string {
  if (!directoryStructure) {
    return "";
  }
  return directoryStructure.reduce(
    (directoryStructureString, child) =>
      directoryStructureString +
      " ".repeat(indent) +
      getDirNodeNameString(child) +
      "\n" +
      stringifyDirectoryTrees(child.children, indent + 2),
    "",
  );
}

const getDirNodeNameString = (node: DirectoryTree) =>
  node.extension ? node.name : `[${node.name}]`;

describe("structure", () => {
  let baseDirPath: string;

  beforeEach(() => {
    baseDirPath = getBaseDirPath("structure");
  });

  afterEach(async () => {
    await fs.rmdir(baseDirPath, { recursive: true });
    await new Promise(r => setTimeout(r, 100));
  });

  it("should generate proper folders structure and file names for complex datamodel", async () => {
    const schema = /* prisma */ `
      enum Color {
        RED
        GREEN
        BLUE
      }

      model User {
        id     Int      @id @default(autoincrement())
        name   String?
        posts  Post[]
      }

      model Post {
        uuid      String  @id @default(cuid())
        content   String
        author    User
        color     Color
      }
    `;

    await generateCode(
      await getPhotonDmmfFromPrismaSchema(schema),
      baseDirPath,
    );
    const directoryStructure = directoryTree(baseDirPath);
    const directoryStructureString =
      "\n[type-graphql]\n" +
      stringifyDirectoryTrees(directoryStructure.children, 2);

    expect(directoryStructureString).toMatchInlineSnapshot(`
      "
      [type-graphql]
        [enums]
          Color.ts
          index.ts
          OrderByArg.ts
        index.ts
        [models]
          index.ts
          Post.ts
          User.ts
        [resolvers]
          [crud]
            index.ts
            [Post]
              [args]
                CreateOnePostArgs.ts
                DeleteOnePostArgs.ts
                FindManyPostArgs.ts
                FindOnePostArgs.ts
                index.ts
                UpdateManyPostArgs.ts
                UpdateOnePostArgs.ts
                UpsertOnePostArgs.ts
              PostCrudResolver.ts
            [User]
              [args]
                CreateOneUserArgs.ts
                DeleteOneUserArgs.ts
                FindManyUserArgs.ts
                FindOneUserArgs.ts
                index.ts
                UpdateManyUserArgs.ts
                UpdateOneUserArgs.ts
                UpsertOneUserArgs.ts
              UserCrudResolver.ts
          [inputs]
            ColorFilter.ts
            index.ts
            IntFilter.ts
            NullableStringFilter.ts
            PostCreateInput.ts
            PostCreateManyWithoutPostsInput.ts
            PostCreateWithoutAuthorInput.ts
            PostFilter.ts
            PostOrderByInput.ts
            PostScalarWhereInput.ts
            PostUpdateInput.ts
            PostUpdateManyDataInput.ts
            PostUpdateManyMutationInput.ts
            PostUpdateManyWithoutAuthorInput.ts
            PostUpdateManyWithWhereNestedInput.ts
            PostUpdateWithoutAuthorDataInput.ts
            PostUpdateWithWhereUniqueWithoutAuthorInput.ts
            PostUpsertWithWhereUniqueWithoutAuthorInput.ts
            PostWhereInput.ts
            PostWhereUniqueInput.ts
            StringFilter.ts
            UserCreateInput.ts
            UserCreateOneWithoutAuthorInput.ts
            UserCreateWithoutPostsInput.ts
            UserOrderByInput.ts
            UserUpdateInput.ts
            UserUpdateManyMutationInput.ts
            UserUpdateOneRequiredWithoutPostsInput.ts
            UserUpdateWithoutPostsDataInput.ts
            UserUpsertWithoutPostsInput.ts
            UserWhereInput.ts
            UserWhereUniqueInput.ts
          [outputs]
            AggregatePost.ts
            AggregateUser.ts
            BatchPayload.ts
            index.ts
          [relations]
            index.ts
            [Post]
              PostRelationsResolver.ts
            [User]
              [args]
                index.ts
                UserPostsArgs.ts
              UserRelationsResolver.ts
      "
    `);
  });
});
