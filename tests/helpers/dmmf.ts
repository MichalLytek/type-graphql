import getDMMFTypings from "@prisma/client/dist/generation/getDMMF";
import { DMMF } from "@prisma/client/runtime/dmmf-types";
const PrismaClientGeneratorBuild = require("@prisma/client/generator-build");

const getDMMF: typeof getDMMFTypings.getDMMF =
  PrismaClientGeneratorBuild.getDMMF;

export default async function getPrismaClientDmmfFromPrismaSchema(
  prismaSchema: string,
): Promise<DMMF.Document> {
  return await getDMMF({ datamodel: prismaSchema });
}
