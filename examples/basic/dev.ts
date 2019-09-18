import path from "path";

// import { writeDmmf } from "../../src/dev/writeDmmf";
// import { logDmmf } from "../../src/dev/logDmmf";
import { generateCode } from "../../src/dev/generateCode";

const dmmfJSONPath = path.resolve(
  __dirname,
  "prisma/generated/type-graphql/photon-dmmf.json",
);
const outputTSFilePath = path.resolve(
  __dirname,
  "prisma/generated/type-graphql/index.ts",
);

(async () => {
  // await writeDmmf("./prisma", dataModelJSONPath);
  // await logDmmf("./prisma");
  await generateCode(dmmfJSONPath, outputTSFilePath);
})();
