import { getDMMF, DMMF } from "@prisma/client/runtime";
import fs from "fs";

import { getDatamodel } from "./getDatamodel";

export async function writeDmmf(cwd: string, dmmfJSONPath: string) {
  try {
    const datamodel = await getDatamodel(cwd);
    const dmmf: DMMF.Document = await getDMMF({ datamodel, cwd });
    console.log("Writing dmmf...");
    fs.writeFileSync(dmmfJSONPath, JSON.stringify(dmmf, null, 2));
  } catch (err) {
    console.error("something went wrong:", err);
  }
}
