import { SourceFile, FormatCodeSettings } from "ts-morph";

const formatSettings: FormatCodeSettings = { indentSize: 2 };

export default async function saveSourceFile(sourceFile: SourceFile) {
  // TODO: find a fast way of removing not needed imports
  // sourceFile.organizeImports(formatSettings);
  sourceFile.formatText(formatSettings);
  await sourceFile.save();
}
