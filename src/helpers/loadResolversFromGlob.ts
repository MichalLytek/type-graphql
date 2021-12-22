import glob from "glob";

export function findFileNamesFromGlob(globString: string): string[] {
  return glob.sync(globString);
}

export function loadResolversFromGlob(globString: string): Function[] {
  const filePaths = findFileNamesFromGlob(globString);

  /**
   * Get's all the exported resolvers from found modules
   */
  const modules = filePaths
    .map(fileName => require(fileName))
    .reduce((resolvers, module) => [...resolvers, ...Object.values(module)], []);

  return modules;
}
