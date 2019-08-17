import { EnumMemberStructure, OptionalKind, SourceFile } from "ts-morph";
import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";

export default async function generateEnum(
  sourceFile: SourceFile,
  enumDef: DMMF.Enum,
) {
  sourceFile.addEnum({
    isExported: true,
    name: enumDef.name,
    ...(enumDef.documentation && {
      docs: [{ description: enumDef.documentation }],
    }),
    members: enumDef.values.map<OptionalKind<EnumMemberStructure>>(
      enumValue => ({
        name: enumValue,
        // TODO: add support for string enums (values)
        // TODO: add support for enum members docs
      }),
    ),
  });
}
