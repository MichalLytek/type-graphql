import PhotonRuntime from "@prisma/photon/runtime";
import getDMMFTypings from "@prisma/photon/runtime/getDMMF";
import { DMMF } from "@prisma/photon/runtime/dmmf-types";

const getDMMF: typeof getDMMFTypings.getDMMF = PhotonRuntime.getDMMF;

export default async function getPhotonDmmfFromPrismaSchema(
  prismaSchema: string,
): Promise<DMMF.Document> {
  return await getDMMF({ datamodel: prismaSchema });
}
