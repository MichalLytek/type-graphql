import glob from "glob";

export function findFileNamesFromGlob(globString: string) {
  return glob.sync(globString);
}

export function loadResolversFromGlob(globString: string) {
  const filePaths = findFileNamesFromGlob(globString);
  const modules = filePaths.reduce(
    (merged, fileName) => [...merged, ...Object.values(require(fileName) as Function[])],
    [] as Function[],
  );

  return modules;
}
