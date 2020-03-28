// @ts-ignore
import { DMMF } from "@prisma/client/runtime/dmmf-types";

declare module "@prisma/client/runtime/dmmf-types" {
  namespace DMMF {
    interface Model {
      uniqueFields: string[][];
    }
  }
}
