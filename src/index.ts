import { getDMMF } from "@prisma/photon";
import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";
import fs from "fs";
import path from "path";
import { Project } from "ts-morph";

import { getDatamodel } from "./photon/getDatamodel";
import generateEnum from "./generateEnum";
import generateClassFromModel from "./generateClass";
import generateImports from "./generateImports";

async function writeDmmf(cwd: string) {
  try {
    const datamodel = await getDatamodel(cwd);
    const dmmf = await getDMMF({ datamodel, cwd });
    console.log("Writing datamodel...");
    fs.writeFileSync(
      path.resolve(__dirname, "../prisma/dmmf-datamodel.json"),
      JSON.stringify(dmmf.datamodel, null, 2),
    );
  } catch (err) {
    console.error("something went wrong:", err);
  }
}

async function logDmmf(cwd: string) {
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

async function generateCode(cwd: string) {
  console.log("Loading datamodel...");
  // const datamodel = await getDatamodel(cwd);
  // const dmmf = await getDMMF({ datamodel, cwd });
  const dmmf = {
    datamodel: require("../prisma/dmmf-datamodel.json") as DMMF.Datamodel,
  };
  const project = new Project();
  const sourceFile = project.createSourceFile(
    path.resolve(__dirname, "../prisma/generated/type-graphql.ts"),
    undefined,
    { overwrite: true },
  );

  console.log("Generating imports...");
  await generateImports(sourceFile);

  console.log("Generating enums...");
  await Promise.all(
    dmmf.datamodel.enums.map(enumDef => generateEnum(sourceFile, enumDef)),
  );

  console.log("Generating models...");
  await Promise.all(
    dmmf.datamodel.models.map(model =>
      generateClassFromModel(sourceFile, model),
    ),
  );

  console.log("Cleaning and formating generated code...");
  sourceFile.fixUnusedIdentifiers();
  sourceFile.formatText({ indentSize: 2 });

  console.log("Saving generated code...");
  await sourceFile.save();
}

(async () => {
  await writeDmmf("./prisma");
  // await logDmmf("./prisma");
  await generateCode("./prisma");
})();
