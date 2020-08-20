import generateCode from "../../src/generator/generate-code";
import getPrismaClientDmmfFromPrismaSchema from "./dmmf";
import { GenerateCodeOptions } from "../../src/generator/options";

type SupportedPreviewFeatures = "connectOrCreate";

interface GenerateCodeFromSchemaOptions
  extends Omit<GenerateCodeOptions, "relativePrismaOutputPath"> {
  enabledPreviewFeatures?: SupportedPreviewFeatures[];
}

export async function generateCodeFromSchema(
  schema: string,
  options: GenerateCodeFromSchemaOptions,
): Promise<void> {
  await generateCode(
    await getPrismaClientDmmfFromPrismaSchema(
      schema,
      options.enabledPreviewFeatures,
    ),
    {
      ...options,
      relativePrismaOutputPath: "../../helpers/prisma-client-mock",
    },
  );
}
