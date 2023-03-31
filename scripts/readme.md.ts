import fs from "node:fs";
import path from "node:path";

const README_MD_FILE = path.join(__dirname, "../README.md");
const GITHUB_IMAGES_URL =
  "https://raw.githubusercontent.com/MichalLytek/type-graphql/master/images";

if (!fs.existsSync(README_MD_FILE)) {
  throw new Error(`README.md '${README_MD_FILE}' does not exists`);
}

const readme = fs
  .readFileSync(README_MD_FILE, { encoding: "utf8", flag: "r" })
  .replace(/!\[([^\]]*)\]\((\.\/)?images\/(.*?)\)/gm, `![$1](${GITHUB_IMAGES_URL}/$3)`) // ![alt](path)
  .replace(/<img[^>]+src="(\.\/)?images\/([^">]+)"/gm, `<img src="${GITHUB_IMAGES_URL}/$2"`); // <img src="path"

fs.writeFileSync(README_MD_FILE, readme, { encoding: "utf8", flag: "w" });
