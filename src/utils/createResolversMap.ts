import type {
  GraphQLAbstractType,
  GraphQLFieldMap,
  GraphQLSchema,
  GraphQLTypeResolver,
} from "graphql";
import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
} from "graphql";
import type { EnumResolver, ResolverObject, ResolversMap } from "@/typings";

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
      // eslint-disable-next-line no-await-in-loop
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
      // eslint-disable-next-line no-param-reassign
      fieldsMap[fieldName] = {
        subscribe: field.subscribe,
        resolve: field.resolve,
      };
    } else if (field.resolve) {
      // eslint-disable-next-line no-param-reassign
      fieldsMap[fieldName] = field.resolve;
    }
    return fieldsMap;
  }, {});
}

export function createResolversMap(schema: GraphQLSchema): ResolversMap {
  const typeMap = schema.getTypeMap();
  return Object.keys(typeMap)
    .filter(typeName => !typeName.includes("__"))
    .reduce<ResolversMap>((resolversMap, typeName) => {
      const type = typeMap[typeName];
      if (type instanceof GraphQLObjectType) {
        // eslint-disable-next-line no-param-reassign
        resolversMap[typeName] = {
          ...(type.isTypeOf && {
            __isTypeOf: type.isTypeOf,
          }),
          ...generateFieldsResolvers(type.getFields()),
        };
      }
      if (type instanceof GraphQLInterfaceType) {
        // eslint-disable-next-line no-param-reassign
        resolversMap[typeName] = {
          __resolveType: generateTypeResolver(type, schema),
          ...generateFieldsResolvers(type.getFields()),
        };
      }
      if (type instanceof GraphQLScalarType) {
        // eslint-disable-next-line no-param-reassign
        resolversMap[typeName] = type;
      }
      if (type instanceof GraphQLEnumType) {
        const enumValues = type.getValues();
        // eslint-disable-next-line no-param-reassign
        resolversMap[typeName] = enumValues.reduce<EnumResolver>((enumMap, { name, value }) => {
          // eslint-disable-next-line no-param-reassign
          enumMap[name] = value;
          return enumMap;
        }, {});
      }
      if (type instanceof GraphQLUnionType) {
        // eslint-disable-next-line no-param-reassign
        resolversMap[typeName] = {
          __resolveType: generateTypeResolver(type, schema),
        };
      }
      return resolversMap;
    }, {});
}
