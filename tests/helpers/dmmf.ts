import { DMMF as PrismaDMMF } from "@prisma/client/runtime";
import { GetDMMFOptions } from "@prisma/sdk";
const PrismaClientGeneratorBuild = require("@prisma/client/generator-build");

function getDMMF(options: GetDMMFOptions): Promise<PrismaDMMF.Document> {
  return PrismaClientGeneratorBuild.getDMMF(options);
}

export default async function getPrismaClientDmmfFromPrismaSchema(
  prismaSchema: string,
  enableExperimental?: string[],
): Promise<PrismaDMMF.Document> {
  return await getDMMF({ datamodel: prismaSchema, enableExperimental });
}
