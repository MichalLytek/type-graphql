import generateCode from "../../src/generator/generate-code";
import getPhotonDmmfFromPrismaSchema from "./dmmf";

export async function generateCodeFromSchema(
  schema: string,
  outputDirPath: string,
): Promise<void> {
  await generateCode(
    await getPhotonDmmfFromPrismaSchema(schema),
    outputDirPath,
  );
}
