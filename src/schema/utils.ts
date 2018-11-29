import {
  GraphQLInputObjectType,
  GraphQLInputFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLFieldConfigMap,
  GraphQLFieldConfigArgumentMap,
} from "graphql";

export function getFieldMetadataFromInputType(type: GraphQLInputObjectType) {
  const fieldInfo = type.getFields();
  const typeFields = Object.keys(fieldInfo).reduce<GraphQLInputFieldConfigMap>(
    (fieldsMap, fieldName) => {
      const superField = fieldInfo[fieldName];
      fieldsMap[fieldName] = {
        type: superField.type,
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
        resolve: superField.resolve,
        description: superField.description,
        deprecationReason: superField.deprecationReason,
      };
      return fieldsMap;
    },
    {},
  );
  return typeFields;
}
