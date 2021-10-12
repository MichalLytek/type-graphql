import { GraphQLSchema, defaultFieldResolver, GraphQLDirective, DirectiveLocation } from "graphql";
import { mapSchema, MapperKind, getDirective } from "@graphql-tools/utils";

export const upperCaseDirective = new GraphQLDirective({
  name: "upper",
  locations: [DirectiveLocation.FIELD_DEFINITION],
});

export function upperCaseDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const upperCaseDirectiveConfig = getDirective(schema, fieldConfig, "upper")?.[0];
      if (upperCaseDirectiveConfig) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async (source, args, context, info) => {
          const result = await resolve(source, args, context, info);
          if (typeof result === "string") {
            return result.toUpperCase();
          }
          return result;
        };
      }
      return fieldConfig;
    },
  });
}
