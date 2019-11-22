import { getDatamodel } from "./getDatamodel";
import { getDMMF } from "@prisma/photon/dist";

export async function logDmmf(cwd: string) {
  const datamodel = await getDatamodel(cwd);
  const dmmf = await getDMMF({ datamodel, cwd });
  console.log("enums");
  dmmf.datamodel.enums.forEach(enumDef => {
    console.log("  name: " + enumDef.name);
    console.log("  values:");
    enumDef.values.forEach(enumValue => {
      console.log("    " + enumValue);
    });
  });
  console.log("models");
  dmmf.datamodel.models.forEach(model => {
    console.log("  name: " + model.name);
    console.log("  fields:");
    model.fields.forEach(field => {
      console.log("    name:" + field.name);
      console.log("    type:" + field.type);
    });
  });
}
