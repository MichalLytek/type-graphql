import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

export const fsMkdir = promisify(fs.mkdir)
export const fsWriteFile = promisify(fs.writeFile)

export function parsePath(targetPath: string): string[] {
  const directories: string[] = []
  const parsedPath = path.parse(path.resolve(targetPath))
  const splitPath = parsedPath.dir.split(path.sep)
  if (parsedPath.root === '/') {
    splitPath[0] = `/${splitPath[0]}`
  }
  splitPath.reduce((previous: string, next: string) => {
    const directory = path.join(previous, next)
    directories.push(directory)
    return path.join(directory)
  })
  return directories
}

export async function mkdirRecursive(filePath: string): Promise<void> {
  const directories = parsePath(filePath)
  for (const directory of directories) {
    try {
      await fsMkdir(directory)
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err
      }
    }
  }
}

export function mkdirRecursiveSync(filePath: string): void {
  const directories = parsePath(filePath)
  for (const directory of directories) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory)
    }
  }
}

export async function outputFile(filePath: string, fileContent: any): Promise<void> {
  try {
    await fsWriteFile(filePath, fileContent)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
    await mkdirRecursive(filePath)
    await fsWriteFile(filePath, fileContent)
  }
}

export function outputFileSync(filePath: string, fileContent: any): void {
  try {
    fs.writeFileSync(filePath, fileContent)
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e
    }
    mkdirRecursiveSync(filePath)
    fs.writeFileSync(filePath, fileContent)
  }
}
