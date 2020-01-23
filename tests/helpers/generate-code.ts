import generateCode from "../../src/generator/generate-code";
import getPrismaClientDmmfFromPrismaSchema from "./dmmf";

export async function generateCodeFromSchema(
  schema: string,
  outputDirPath: string,
): Promise<void> {
  await generateCode(
    await getPrismaClientDmmfFromPrismaSchema(schema),
    outputDirPath,
  );
}
