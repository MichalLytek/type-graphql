import * as glob from "glob";

export function findFileNamesFromGlob(globString: string) {
  return glob.sync(globString);
}

export function loadResolversFromGlob(globString: string) {
  const filePaths = findFileNamesFromGlob(globString);
  if (!filePaths.length) {
    return console.warn(`No files found for this glob pattern : ${globString}`);
  }
  const modules = filePaths.map(fileName => require(fileName));
}
