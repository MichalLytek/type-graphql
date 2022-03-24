import {
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLFieldMap,
  GraphQLSchema,
  GraphQLTypeResolver,
  GraphQLAbstractType,
} from "graphql";

import { ResolversMap, EnumResolver, ResolverObject } from "../interfaces";

export function createResolversMap(schema: GraphQLSchema): ResolversMap {
  const typeMap = schema.getTypeMap();
  return Object.keys(typeMap)
    .filter(typeName => !typeName.includes("__"))
    .reduce<ResolversMap>((resolversMap, typeName) => {
      const type = typeMap[typeName];
      if (type instanceof GraphQLObjectType) {
        resolversMap[typeName] = {
          ...(type.isTypeOf && {
            __isTypeOf: type.isTypeOf,
          }),
          ...generateFieldsResolvers(type.getFields()),
        };
      }
      if (type instanceof GraphQLInterfaceType) {
        resolversMap[typeName] = {
          __resolveType: generateTypeResolver(type, schema),
          ...generateFieldsResolvers(type.getFields()),
        };
      }
      if (type instanceof GraphQLScalarType) {
        resolversMap[typeName] = type;
      }
      if (type instanceof GraphQLEnumType) {
        const enumValues = type.getValues();
        resolversMap[typeName] = enumValues.reduce<EnumResolver>((enumMap, { name, value }) => {
          enumMap[name] = value;
          return enumMap;
        }, {});
      }
      if (type instanceof GraphQLUnionType) {
        resolversMap[typeName] = {
          __resolveType: generateTypeResolver(type, schema),
        };
      }
      return resolversMap;
    }, {});
}

function generateTypeResolver(
  abstractType: GraphQLAbstractType,
  schema: GraphQLSchema,
): GraphQLTypeResolver<any, any> {
  if (abstractType.resolveType) {
    return abstractType.resolveType;
  }

  const possibleObjectTypes = schema.getPossibleTypes(abstractType);
  return async (source, context, info) => {
    for (const objectType of possibleObjectTypes) {
      if (objectType.isTypeOf && (await objectType.isTypeOf(source, context, info))) {
        return objectType.name;
      }
    }
    return undefined;
  };
}

function generateFieldsResolvers(fields: GraphQLFieldMap<any, any>): ResolverObject {
  return Object.keys(fields).reduce<ResolverObject>((fieldsMap, fieldName) => {
    const field = fields[fieldName];
    if (field.subscribe) {
      fieldsMap[fieldName] = {
        subscribe: field.subscribe,
        resolve: field.resolve,
      };
    } else if (field.resolve) {
      fieldsMap[fieldName] = field.resolve;
    }
    return fieldsMap;
  }, {});
}
