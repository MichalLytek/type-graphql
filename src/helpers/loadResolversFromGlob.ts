import glob from "glob";

export function findFileNamesFromGlob(globString: string) {
  return glob.sync(globString);
}

export function loadResolversFromGlob(globString: string) {
  const filePaths = findFileNamesFromGlob(globString);
  // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-unused-vars
  const modules = filePaths.map(fileName => require(fileName));
}
