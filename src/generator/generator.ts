import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";
import { Project } from "ts-morph";

import generateImports from "./imports";
import generateEnumsFromDef from "./enums";
import generateObjectTypeClassesFromModel from "./object-type-classes";
import generateRelationsResolverClassesFromModel from "./relations-resolver-classes";

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
    datamodel.enums.map(enumDef => generateEnumsFromDef(sourceFile, enumDef)),
  );
  await Promise.all(
    datamodel.models.map(model =>
      generateObjectTypeClassesFromModel(sourceFile, model),
    ),
  );
  await Promise.all(
    datamodel.models.map(model =>
      generateRelationsResolverClassesFromModel(sourceFile, model),
    ),
  );
  sourceFile.fixUnusedIdentifiers();
  sourceFile.formatText({ indentSize: 2 });
  await sourceFile.save();
}
