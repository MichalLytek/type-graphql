import { DMMF } from "@prisma/client/runtime/dmmf-types";
import { GetDMMFOptions } from "@prisma/sdk";
const PrismaClientGeneratorBuild = require("@prisma/client/generator-build");

function getDMMF(options: GetDMMFOptions): Promise<DMMF.Document> {
  return PrismaClientGeneratorBuild.getDMMF(options);
}

export default async function getPrismaClientDmmfFromPrismaSchema(
  prismaSchema: string,
): Promise<DMMF.Document> {
  return await getDMMF({ datamodel: prismaSchema });
}
