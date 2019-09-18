import { getDMMF } from "@prisma/photon";
import fs from "fs";

import { getDatamodel } from "./getDatamodel";

export async function writeDmmf(cwd: string, dataModelJSONPath: string) {
  try {
    const datamodel = await getDatamodel(cwd);
    const dmmf = await getDMMF({ datamodel, cwd });
    console.log("Writing datamodel...");
    fs.writeFileSync(
      JSON.stringify(dmmf.datamodel, null, 2),
      dataModelJSONPath,
    );
  } catch (err) {
    console.error("something went wrong:", err);
  }
}
