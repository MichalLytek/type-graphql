import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";
import { Project } from "ts-morph";

import generateEnumsFromDef from "../../src/generator/enums";
import generateObjectTypeClassesFromModel from "../../src/generator/object-type-classes";
import generateImports from "../../src/generator/imports";
import generateRelationsResolverClassesFromModel from "../../src/generator/relations-resolver-classes";

export async function generateCode(
  dataModelJSONPath: string,
  outputTSFilePath: string,
) {
  console.log("Loading datamodel...");
  const dmmf = {
    datamodel: require(dataModelJSONPath) as DMMF.Datamodel,
  };

  const project = new Project();
  const sourceFile = project.createSourceFile(outputTSFilePath, undefined, {
    overwrite: true,
  });

  console.log("Generating imports...");
  await generateImports(sourceFile);

  console.log("Generating enums...");
  await Promise.all(
    dmmf.datamodel.enums.map(enumDef =>
      generateEnumsFromDef(sourceFile, enumDef),
    ),
  );

  console.log("Generating models...");
  await Promise.all(
    dmmf.datamodel.models.map(model =>
      generateObjectTypeClassesFromModel(sourceFile, model),
    ),
  );

  console.log("Generating relation resolvers...");
  await Promise.all(
    dmmf.datamodel.models.map(model =>
      generateRelationsResolverClassesFromModel(sourceFile, model),
    ),
  );

  console.log("Formating generated code...");
  // sourceFile.fixUnusedIdentifiers();
  sourceFile.formatText({ indentSize: 2 });

  console.log("Saving generated code...");
  await sourceFile.save();
}
