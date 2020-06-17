import { DMMFTypeInfo } from "./types";
import { DmmfDocument } from "./dmmf/dmmf-document";
import { modelAttributeRegex, fieldAttributeRegex } from "./dmmf/helpers";

export function noop() {}

export function getFieldTSType(
  typeInfo: DMMFTypeInfo,
  dmmfDocument: DmmfDocument,
  modelName?: string,
  typeName?: string,
) {
  let TSType: string;
  if (typeInfo.kind === "scalar") {
    TSType = mapScalarToTSType(typeInfo.type);
  } else if (typeInfo.kind === "object") {
    if (dmmfDocument.isModelName(typeInfo.type)) {
      TSType = dmmfDocument.getModelTypeName(typeInfo.type)!;
    } else {
      TSType =
        !typeName || !modelName
          ? getInputTypeName(typeInfo.type, dmmfDocument)
          : typeInfo.type.replace(modelName, typeName);
    }
  } else if (typeInfo.kind === "enum") {
    TSType = `keyof typeof ${typeInfo.type}`;
  } else {
    throw new Error(`Unsupported field type kind: ${typeInfo.kind}`);
  }
  if (typeInfo.isList) {
    if (TSType.includes(" ")) {
      TSType = `Array<${TSType}>`;
    } else {
      TSType += "[]";
    }
  }
  if (!typeInfo.isRequired) {
    // FIXME: use properly null for output and undefined for input
    // TSType += " | null | undefined";
    TSType += " | undefined";
  }
  return TSType;
}

export function mapScalarToTSType(scalar: string) {
  switch (scalar) {
    case "ID":
    case "UUID": {
      return "string";
    }
    case "String": {
      return "string";
    }
    case "Boolean": {
      return "boolean";
    }
    case "DateTime": {
      return "Date";
    }
    case "Int":
    case "Float": {
      return "number";
    }
    case "Json":
      return "object";
    default:
      throw new Error(`Unrecognized scalar type: ${scalar}`);
  }
}

export function getTypeGraphQLType(
  typeInfo: DMMFTypeInfo,
  dmmfDocument: DmmfDocument,
  modelName?: string,
  typeName?: string,
) {
  let GraphQLType: string;
  if (typeInfo.kind === "scalar") {
    GraphQLType = mapScalarToTypeGraphQLType(typeInfo.type);
  } else if (typeInfo.kind === "object") {
    if (dmmfDocument.isModelName(typeInfo.type)) {
      GraphQLType = dmmfDocument.getModelTypeName(typeInfo.type)!;
    } else {
      GraphQLType =
        !typeName || !modelName
          ? getInputTypeName(typeInfo.type, dmmfDocument)
          : typeInfo.type.replace(modelName, typeName);
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
      return "Date";
    }
    // TODO: use proper uuid graphql scalar
    case "UUID": {
      return "String";
    }
    case "Boolean":
    case "String": {
      return scalar;
    }
    case "ID":
    case "Int":
    case "Float": {
      return `TypeGraphQL.${scalar}`;
    }
    case "Json": {
      return `GraphQLJSON`;
    }
    default: {
      throw new Error(`Unrecognized scalar type: ${scalar}`);
    }
  }
}

export function camelCase(str: string) {
  return str[0].toLowerCase() + str.slice(1);
}

export function pascalCase(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}

function getInputKeywordPhrasePosition(inputTypeName: string) {
  const inputParseResult = [
    "Create",
    "OrderBy",
    "Update",
    "Upsert",
    "ScalarWhere",
    "Where",
    "Filter",
  ]
    .map(inputKeyword => inputTypeName.search(inputKeyword))
    .filter(position => position >= 0);

  if (inputParseResult.length === 0) {
    return;
  }

  const keywordPhrasePosition = inputParseResult[0];
  return keywordPhrasePosition;
}

export function getModelNameFromInputType(inputTypeName: string) {
  const keywordPhrasePosition = getInputKeywordPhrasePosition(inputTypeName);
  if (!keywordPhrasePosition) {
    return;
  }
  const modelName = inputTypeName.slice(0, keywordPhrasePosition);
  return modelName;
}

export function getInputTypeName(
  originalInputName: string,
  dmmfDocument: DmmfDocument,
): string {
  const keywordPhrasePosition = getInputKeywordPhrasePosition(
    originalInputName,
  );
  if (!keywordPhrasePosition) {
    return originalInputName;
  }

  const modelName = originalInputName.slice(0, keywordPhrasePosition);
  const typeNameRest = originalInputName.slice(keywordPhrasePosition);
  const modelTypeName = dmmfDocument.getModelTypeName(modelName);
  if (!modelTypeName) {
    return originalInputName;
  }

  return `${modelTypeName}${typeNameRest}`;
}

export function cleanDocsString(
  documentation: string | undefined,
): string | undefined {
  if (!documentation) {
    return;
  }
  let cleanedDocs = documentation;
  cleanedDocs = cleanedDocs.replace(modelAttributeRegex, "");
  cleanedDocs = cleanedDocs.replace(fieldAttributeRegex, "");
  cleanedDocs = cleanedDocs.split('"').join('\\"');
  cleanedDocs = cleanedDocs.split("\r").join("");
  cleanedDocs = cleanedDocs.split("\\r").join("");
  cleanedDocs = cleanedDocs.split("\n").join("");
  cleanedDocs = cleanedDocs.split("\\n").join("");
  return cleanedDocs;
}
