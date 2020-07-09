import generateCode from "../../src/generator/generate-code";
import getPrismaClientDmmfFromPrismaSchema from "./dmmf";
import { GenerateCodeOptions } from "../../src/generator/options";

type SupportedExperimentalFeatures = "aggregations";

interface GenerateCodeFromSchemaOptions
  extends Omit<GenerateCodeOptions, "relativePrismaOutputPath"> {
  enableExperimental?: SupportedExperimentalFeatures[];
}

export async function generateCodeFromSchema(
  schema: string,
  options: GenerateCodeFromSchemaOptions,
): Promise<void> {
  await generateCode(
    await getPrismaClientDmmfFromPrismaSchema(
      schema,
      options.enableExperimental,
    ),
    {
      ...options,
      relativePrismaOutputPath: "../../helpers/prisma-client-mock",
    },
  );
}
