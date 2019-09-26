import { SourceFile } from "ts-morph";

export default async function generateImports(sourceFile: SourceFile) {
  sourceFile.addImportDeclaration({
    moduleSpecifier: "type-graphql",
    namedImports: [
      { name: "registerEnumType" },
      { name: "ObjectType" },
      { name: "Field" },
      { name: "Int" },
      { name: "Float" },
      { name: "ID" },
      { name: "Resolver" },
      { name: "FieldResolver" },
      { name: "Root" },
      { name: "Ctx" },
      { name: "InputType" },
      { name: "Query" },
      { name: "Mutation" },
      { name: "Arg" },
    ],
  });
  sourceFile.addImportDeclaration({
    moduleSpecifier: "dataloader",
    defaultImport: "DataLoader",
  });
}
