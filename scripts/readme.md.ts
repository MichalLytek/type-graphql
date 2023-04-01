import fs from "node:fs";
import path from "node:path";

const gitHubImagesUrl = "https://raw.githubusercontent.com/MichalLytek/type-graphql/master/images";
const readmeMdFile = path.resolve(__dirname, "../README.md");

if (!fs.existsSync(readmeMdFile)) {
  throw new Error(`README.md '${readmeMdFile}' does not exists`);
}

const readme = fs
  .readFileSync(readmeMdFile, { encoding: "utf8", flag: "r" })
  .replace(/!\[([^\]]*)\]\((\.\/)?images\/(.*?)\)/gm, `![$1](${gitHubImagesUrl}/$3)`) // ![alt](path)
  .replace(/<img[^>]+src="(\.\/)?images\/([^">]+)"/gm, `<img src="${gitHubImagesUrl}/$2"`); // <img src="path"

fs.writeFileSync(readmeMdFile, readme, { encoding: "utf8", flag: "w" });
