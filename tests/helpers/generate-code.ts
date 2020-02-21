import generateCode from "../../src/generator/generate-code";
import getPrismaClientDmmfFromPrismaSchema from "./dmmf";
import { GenerateCodeOptions } from "../../src/generator/options";

export async function generateCodeFromSchema(
  schema: string,
  options: GenerateCodeOptions,
): Promise<void> {
  await generateCode(
    await getPrismaClientDmmfFromPrismaSchema(schema),
    options,
  );
}
