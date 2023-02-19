import {
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from "graphql";

export function getFieldMetadataFromInputType(type: GraphQLInputObjectType) {
  const fieldInfo = type.getFields();
  const typeFields = Object.keys(fieldInfo).reduce<GraphQLInputFieldConfigMap>(
    (fieldsMap, fieldName) => {
      const superField = fieldInfo[fieldName];
      fieldsMap[fieldName] = {
        type: superField.type,
        astNode: superField.astNode,
        description: superField.description,
        defaultValue: superField.defaultValue,
      };
      return fieldsMap;
    },
    {},
  );
  return typeFields;
}

export function getFieldMetadataFromObjectType(type: GraphQLObjectType | GraphQLInterfaceType) {
  const fieldInfo = type.getFields();
  const typeFields = Object.keys(fieldInfo).reduce<GraphQLFieldConfigMap<any, any>>(
    (fieldsMap, fieldName) => {
      const superField = fieldInfo[fieldName];
      fieldsMap[fieldName] = {
        type: superField.type,
        args: superField.args.reduce<GraphQLFieldConfigArgumentMap>((argMap, { name, ...arg }) => {
          argMap[name] = arg;
          return argMap;
        }, {}),
        astNode: superField.astNode,
        resolve: superField.resolve,
        description: superField.description,
        deprecationReason: superField.deprecationReason,
        extensions: superField.extensions,
      };
      return fieldsMap;
    },
    {},
  );
  return typeFields;
}
