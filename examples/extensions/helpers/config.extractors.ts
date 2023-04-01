import type { GraphQLFieldConfig, GraphQLObjectTypeConfig, GraphQLResolveInfo } from "graphql";

export const extractFieldConfig = (info: GraphQLResolveInfo): GraphQLFieldConfig<any, any> => {
  const { type, extensions, description, deprecationReason } =
    info.parentType.getFields()[info.fieldName];

  return {
    type,
    description,
    extensions,
    deprecationReason,
  };
};

export const extractParentTypeConfig = (
  info: GraphQLResolveInfo,
): GraphQLObjectTypeConfig<any, any> => info.parentType.toConfig();
