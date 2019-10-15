import { SourceFile } from "ts-morph";

export default async function generateImports(sourceFile: SourceFile) {
  generateTypeGraphQLImports(sourceFile);
  generateDataloaderImports(sourceFile);
}

export async function generateTypeGraphQLImports(sourceFile: SourceFile) {
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
      { name: "ArgsType" },
      { name: "Args" },
    ],
  });
}

export async function generateDataloaderImports(sourceFile: SourceFile) {
  sourceFile.addImportDeclaration({
    moduleSpecifier: "dataloader",
    defaultImport: "DataLoader",
  });
}
