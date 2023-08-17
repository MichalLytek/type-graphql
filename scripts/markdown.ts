#!/usr/bin/env ts-node

import fs from "node:fs";
import path from "node:path";
import * as glob from "glob";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

function toUrlPath(
  filePath: string,
  relativePath: string,
  rootPath: string,
  basePath: string,
): string {
  return path.resolve(path.dirname(filePath), relativePath).replace(rootPath, basePath);
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const enum ANALYZE {
  DOCS = "docs",
  README = "readme",
}

const gitHubUrl = `https://github.com/MichalLytek/type-graphql/tree`;
const gitHubUrlRaw = `https://raw.githubusercontent.com/MichalLytek/type-graphql`;
const rootPath = path.resolve(`${__dirname}/..`);
const argv = yargs(hideBin(process.argv))
  .strict()
  .env("TYPE_GRAPHQL")
  .usage("Markdown\n\nUsage: $0 [options]")
  .example([
    ["$0", "Use 'master' as Git reference"],
    ["$0 --ref v1.2.3", "Use 'v1.2.3' as Git reference"],
    ["TYPE_GRAPHQL_REF=v1.2.3 $0", "Use 'v1.2.3' as Git reference"],
    [`$0 --on ${ANALYZE.README}`, `Analyze '${ANALYZE.README}'`],
    [
      `$0 --on ${ANALYZE.README} ${ANALYZE.DOCS}`,
      `Analyze '${ANALYZE.README}' and '${ANALYZE.DOCS}'`,
    ],
  ])
  .option("ref", {
    type: "string",
    default: "master",
    description: "Git reference",
  })
  .option("on", {
    type: "array",
    default: [] as ANALYZE[],
    requiresArg: true,
    choices: [ANALYZE.DOCS, ANALYZE.README],
    description: "Analysis to be performed",
  })
  .check(({ ref, on }) => {
    if (!/^v[0-9]+.[0-9]+.[0-9]+(-(alpha|beta|rc)\.[0-9]+)*$/.test(ref)) {
      throw new Error(`Invalid Git reference '${ref}'`);
    }
    if (on.length === 0) {
      throw new Error(`Empty analysis`);
    }

    return true;
  })
  .parseSync();
const gitHubUrlRef = `${gitHubUrl}/${argv.ref}`;
const gitHubUrlRawRef = `${gitHubUrlRaw}/${argv.ref}`;

// README.md
if (argv.on.includes(ANALYZE.README)) {
  const readmeFile = path.resolve(`${rootPath}/README.md`);

  const readme = fs
    .readFileSync(readmeFile, { encoding: "utf8", flag: "r" })
    .replace(
      /!\[([^\]]*)\]\(((?:\.\/|\.\.\/).*?)\)/gm, // ![altText](relativePath)
      (_, altText, relativePath) =>
        `![${altText}](${toUrlPath(readmeFile, relativePath, rootPath, gitHubUrlRawRef)})`,
    )
    .replace(
      /<img([^>]*)\ssrc="((?:\.\/|\.\.\/)[^">]+)"/gm, // <img attributes src="relativePath"
      (_, attributes, relativePath) =>
        `<img${attributes} src="${toUrlPath(readmeFile, relativePath, rootPath, gitHubUrlRawRef)}"`,
    )
    .replace(
      /(?!\\!)\[([^\]]*)\]\(((?:\.\/|\.\.\/).*?)\)/gm, // [linkText](relativePath)
      (_, linkText, relativePath) =>
        `[${linkText}](${toUrlPath(readmeFile, relativePath, rootPath, gitHubUrlRef)})`,
    )
    .replace(
      /<a([^>]*)\shref="((?:\.\/|\.\.\/)[^">]+)"/gm, // <a attributes href="relativePath"
      (_, attributes, relativePath) =>
        `<a${attributes} href="${toUrlPath(readmeFile, relativePath, rootPath, gitHubUrlRef)}"`,
    );

  fs.writeFileSync(readmeFile, readme, { encoding: "utf8", flag: "w" });
}

// docs/**/*.md
if (argv.on.includes(ANALYZE.DOCS)) {
  const docFiles = glob.globSync(`${rootPath}/docs/**/*.md`, { absolute: true });
  const gitHubUrlRefMasterEscaped = escapeRegExp(`${gitHubUrl}/master`);

  for (const docFile of docFiles) {
    const doc = fs
      .readFileSync(docFile, { encoding: "utf8", flag: "r" })
      .replace(
        new RegExp(`(?!\\!)\\[([^\\]]*)\\]\\(${gitHubUrlRefMasterEscaped}\\/?(.*?)\\)`, "gm"), // [linkText](gitHub/relativePath)
        (_, linkText, relativePath) => `[${linkText}](${gitHubUrlRef}/${relativePath})`,
      )
      .replace(
        new RegExp(`<a([^>]*)\\shref="${gitHubUrlRefMasterEscaped}\\/?([^">]+)"`, "gm"), // <a attributes href="gitHub/relativePath"
        (_, attributes, relativePath) => `<a${attributes} href="${gitHubUrlRef}/${relativePath}"`,
      );

    fs.writeFileSync(docFile, doc, { encoding: "utf8", flag: "w" });
  }
}
