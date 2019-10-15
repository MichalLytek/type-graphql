import path from "path";

import { writeDmmf } from "../src/dev/writeDmmf";
// import { logDmmf } from "../../src/dev/logDmmf";
import generate from "../src/dev/generate";

const dmmfJSONPath = path.resolve(
  __dirname,
  "prisma/generated/type-graphql/photon-dmmf.json",
);
const outputTSDirPath = path.resolve(
  __dirname,
  "prisma/generated/type-graphql",
);

(async () => {
  await writeDmmf("./prisma", dmmfJSONPath);
  // await logDmmf("./prisma");
  await generate(dmmfJSONPath, outputTSDirPath);
})();
