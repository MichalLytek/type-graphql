import { getDMMF } from "@prisma/photon";
import fs from "fs";
import path from "path";

import { getDatamodel } from "./photon/getDatamodel";

async function main(cwd: string) {
  try {
    const datamodel = await getDatamodel(cwd);
    const dmmf = await getDMMF({ datamodel, cwd });
    fs.writeFileSync(
      path.resolve(__dirname, "../data/dmmf-datamodel.json"),
      JSON.stringify(dmmf.datamodel, null, 2),
    );
  } catch (err) {
    console.error("something went wrong:", err);
  }
}

main(process.cwd() + "/data");
