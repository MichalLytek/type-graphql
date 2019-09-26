import { DMMF } from "@prisma/photon";

import { DMMFTypeInfo } from "./types";

export function noop() {}

export function getBaseModelTypeName(modelName: string) {
  return `Base${modelName}`;
}

export function getFieldTSType(typeInfo: DMMFTypeInfo, modelNames: string[]) {
  let TSType: string;
  if (typeInfo.kind === "scalar") {
    TSType = mapScalarToTSType(typeInfo.type);
  } else if (typeInfo.kind === "object") {
    if (modelNames.includes(typeInfo.type)) {
      TSType = getBaseModelTypeName(typeInfo.type);
    } else {
      TSType = typeInfo.type;
    }
  } else if (typeInfo.kind === "enum") {
    TSType = `keyof typeof ${typeInfo.type}`;
  } else {
    throw new Error(`Unsupported field type kind: ${typeInfo.kind}`);
  }
  if (typeInfo.isList) {
    TSType += "[]";
  }
  if (!typeInfo.isRequired) {
    TSType += " | null";
  }
  return TSType;
}

export function mapScalarToTSType(scalar: string) {
  switch (scalar) {
    case "ID": {
      // TODO: detect proper type of id field
      return "string";
    }
    case "String": {
      return "string";
    }
    case "Boolean": {
      return "boolean";
    }
    case "DateTime": {
      // TODO: replace when Photon has been fixed
      // return "Date";
      return "string";
    }
    case "Int":
    case "Float": {
      return "number";
    }
    default:
      throw new Error(`Unrecognized scalar type: ${scalar}`);
  }
}

export function getTypeGraphQLType(
  typeInfo: DMMFTypeInfo,
  modelNames: string[],
) {
  let GraphQLType: string;
  if (typeInfo.kind === "scalar") {
    GraphQLType = mapScalarToTypeGraphQLType(typeInfo.type);
  } else if (typeInfo.kind === "object") {
    if (modelNames.includes(typeInfo.type)) {
      GraphQLType = getBaseModelTypeName(typeInfo.type);
    } else {
      GraphQLType = typeInfo.type;
    }
  } else {
    GraphQLType = typeInfo.type;
  }
  if (typeInfo.isList) {
    GraphQLType = `[${GraphQLType}]`;
  }
  return GraphQLType;
}

export function mapScalarToTypeGraphQLType(scalar: string) {
  switch (scalar) {
    case "DateTime": {
      // TODO: replace when Photon has been fixed
      // return "Date";
      return "String";
    }
    case "Boolean":
    case "String":
    case "ID":
    case "Int":
    case "Float": {
      return scalar;
    }
    default:
      throw new Error(`Unrecognized scalar type: ${scalar}`);
  }
}

export function selectInputTypeFromTypes(
  inputTypes: DMMF.SchemaArgInputType[],
): DMMF.SchemaArgInputType {
  // solution from `nexus-prisma`
  // FIXME: *Enum*Filter are currently empty
  return inputTypes.some(it => it.kind === "enum")
    ? inputTypes[0]
    : inputTypes.find(it => it.kind === "object") || inputTypes[0];
}

export function camelCase(str: string) {
  return str[0].toLowerCase() + str.slice(1);
}

export function pascalCase(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}
