import { SourceFile } from "ts-morph";
import path from "path";

import { modelsFolderName, enumsFolderName, inputsFolderName } from "./config";

export default function generateImports(sourceFile: SourceFile) {
  generateTypeGraphQLImports(sourceFile);
  generateDataloaderImports(sourceFile);
}

export function generateTypeGraphQLImports(sourceFile: SourceFile) {
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

export function generateDataloaderImports(sourceFile: SourceFile) {
  sourceFile.addImportDeclaration({
    moduleSpecifier: "dataloader",
    defaultImport: "DataLoader",
  });
}

export const generateModelsImports = createImportGenerator(modelsFolderName);
export const generateEnumsImports = createImportGenerator(enumsFolderName);
export const generateInputsImports = createImportGenerator(inputsFolderName);
function createImportGenerator(elementsDirName: string) {
  return (sourceFile: SourceFile, elementsNames: string[]) => {
    const distinctElementsNames = [...new Set(elementsNames)];
    for (const elementName of distinctElementsNames) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: path.posix.join("..", elementsDirName, elementName),
        // TODO: refactor to default exports
        // defaultImport: elementName,
        namedImports: [elementName],
      });
    }
  };
}
