import { allowedTypes, bannedTypes } from "./returnTypes";
import { ReturnTypeFunc } from "../types";

const recognizedTypes = [...allowedTypes, ...bannedTypes];

export function getTypeFromFunc(typeOrTypeFunc: Function): Function {
  if (recognizedTypes.includes(typeOrTypeFunc)) {
    return typeOrTypeFunc;
  }
  if (typeOrTypeFunc.length === 1) {
    return typeOrTypeFunc();
  }
  return typeOrTypeFunc;

  // console.error(typeOrTypeFunc);
  // throw new Error("Invalid type function!");
}
