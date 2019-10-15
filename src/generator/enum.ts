import { EnumMemberStructure, OptionalKind, Project } from "ts-morph";
import { DMMF } from "@prisma/photon";
import path from "path";

import { generateTypeGraphQLImports } from "./imports";

export default async function generateEnumFromDef(
  project: Project,
  dirPath: string,
  enumDef: DMMF.Enum,
) {
  const filePath = path.resolve(dirPath, `${enumDef.name}.ts`);
  const sourceFile = project.createSourceFile(filePath, undefined, {
    overwrite: true,
  });
  generateTypeGraphQLImports(sourceFile);

  const documentation =
    enumDef.documentation && enumDef.documentation.replace("\r", "");
  sourceFile.addEnum({
    isExported: true,
    name: enumDef.name,
    ...(documentation && {
      docs: [{ description: documentation }],
    }),
    members: enumDef.values.map<OptionalKind<EnumMemberStructure>>(
      enumValue => ({
        name: enumValue,
        value: enumValue,
        // TODO: add support for string enums (values)
        // TODO: add support for enum members docs
      }),
    ),
  });

  sourceFile.addStatements([
    `registerEnumType(${enumDef.name}, {
      name: "${enumDef.name}",
      description: ${documentation ? `"${documentation}"` : "undefined"},
    });`,
  ]);

  // FIXME: use generic save source file utils
  sourceFile.formatText({ indentSize: 2 });
  await sourceFile.save();
}
