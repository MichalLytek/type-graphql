import * as glob from "glob";

export function findFileNamesFromGlob(globString: string) {
  return new Promise<string[]>((resolve, reject) => {
    glob(globString, (err, matches) => (err ? reject(err) : resolve(matches)));
  });
}

export async function loadResolversFromGlob(globString: string): Promise<void> {
  const filePaths = await findFileNamesFromGlob(globString);
  const modules = filePaths.map(fileName => require(fileName));
}
