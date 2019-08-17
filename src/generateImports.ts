import { SourceFile } from "ts-morph";

export default async function generateImports(sourceFile: SourceFile) {
  sourceFile.addImportDeclaration({
    moduleSpecifier: "type-graphql",
    namedImports: [
      { name: "Field" },
      { name: "ObjectType" },
      { name: "Int" },
      { name: "Float" },
      { name: "ID" },
      { name: "registerEnumType" },
    ],
  });
}
