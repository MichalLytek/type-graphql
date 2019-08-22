import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";
import { Project } from "ts-morph";

import generateImports from "./generateImports";
import generateEnum from "./generateEnum";
import generateClassFromModel from "./generateClass";

export default async function generator(
  datamodel: DMMF.Datamodel,
  filePath: string,
) {
  const project = new Project();
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });
  await generateImports(sourceFile);
  await Promise.all(
    datamodel.enums.map(enumDef => generateEnum(sourceFile, enumDef)),
  );
  await Promise.all(
    datamodel.models.map(model => generateClassFromModel(sourceFile, model)),
  );
  sourceFile.fixUnusedIdentifiers();
  sourceFile.formatText({ indentSize: 2 });
  await sourceFile.save();
}
