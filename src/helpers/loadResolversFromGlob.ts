import glob from 'glob'

export function findFileNamesFromGlob(globString: string): string[] {
  return glob.sync(globString)
}

export function loadResolversFromGlob(globString: string): void {
  const filePaths = findFileNamesFromGlob(globString)
  filePaths.map(fileName => require(fileName))
}
