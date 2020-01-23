import * as PrismaClientRuntime from "@prisma/client/runtime";
import getDMMFTypings from "@prisma/client/runtime/getDMMF";
import { DMMF } from "@prisma/client/runtime/dmmf-types";

const getDMMF: typeof getDMMFTypings.getDMMF = PrismaClientRuntime.getDMMF;

export default async function getPrismaClientDmmfFromPrismaSchema(
  prismaSchema: string,
): Promise<DMMF.Document> {
  return await getDMMF({ datamodel: prismaSchema });
}
