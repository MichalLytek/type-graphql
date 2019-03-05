import * as path from "path";
import * as fs from "fs";

function parsePath(targetPath: string) {
  const directoryArray: string[] = [];
  const parsedPath = path.parse(path.resolve(targetPath));
  const splitPath = parsedPath.dir.split(path.sep);
  if (parsedPath.root === "/") {
    splitPath[0] = `/${splitPath[0]}`;
  }
  splitPath.reduce((previous: string, next: string) => {
    const directory = path.join(previous, next);
    directoryArray.push(directory);
    return path.join(directory);
  });
  return directoryArray;
}

function mkdirRecursive(filePath: string) {
  const directoryArray = parsePath(filePath);
  return directoryArray
    .map(directory => {
      return () =>
        new Promise((res, rej) => {
          fs.mkdir(directory, err => {
            if (err && err.code !== "EEXIST") {
              rej(err);
            } else {
              res();
            }
          });
        });
    })
    .reduce((promise, func) => {
      return promise.then(() => func());
    }, Promise.resolve({}));
}

function mkdirRecursiveSync(filePath: string) {
  const directoryArray = parsePath(filePath);
  directoryArray.forEach(directory => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
  });
}

export function outputFile(filePath: string, fileContent: any) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileContent, err => {
      if (err && err.code !== "ENOENT") {
        reject(err);
      } else {
        mkdirRecursive(filePath).then(() => {
          fs.writeFile(filePath, fileContent, error => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
      }
    });
  });
}

export function outputFileSync(filePath: string, fileContent: any) {
  try {
    fs.writeFileSync(filePath, fileContent);
  } catch (e) {
    if (e.code !== "ENOENT") {
      throw e;
    } else {
      mkdirRecursiveSync(filePath);
      fs.writeFileSync(filePath, fileContent);
    }
  }
}
