import { DirectoryTree } from "directory-tree";

export function stringifyDirectoryTrees(
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
