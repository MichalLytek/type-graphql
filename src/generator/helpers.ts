import { DMMF } from "@prisma/photon/dist/runtime/dmmf-types";

export function getBaseModelTypeName(modelName: string) {
  return `Base${modelName}`;
}

export function getFieldTSType(field: DMMF.Field) {
  let type: string;
  if (field.kind === "scalar") {
    type = mapScalarToTSType(field.type);
  } else if (field.kind === "object") {
    type = getBaseModelTypeName(field.type);
  } else if (field.kind === "enum") {
    type = `keyof typeof ${field.type}`;
  } else {
    throw new Error(`Unsupported field type kind: ${field.kind}`);
  }
  if (field.isList) {
    type += "[]";
  }
  if (!field.isRequired) {
    type += " | null";
  }
  return type;
}

export function mapScalarToTSType(scalar: string) {
  switch (scalar) {
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

export function getTypeGraphQLType(field: DMMF.Field) {
  let type: string;
  if (field.kind === "scalar") {
    type = mapScalarToTypeGraphQLType(field.type);
  } else if (field.kind === "object") {
    type = getBaseModelTypeName(field.type);
  } else {
    type = field.type;
  }
  if (field.isList) {
    type = `[${type}]`;
  }
  return type;
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
    case "Int":
    case "Float": {
      return scalar;
    }
    default:
      throw new Error(`Unrecognized scalar type: ${scalar}`);
  }
}

export function toCamelCase(str: string) {
  return str[0].toLowerCase() + str.slice(1);
}
