import { GraphQLSchema, GraphQLDirective, DirectiveLocation } from "graphql";
import { mapSchema, MapperKind, getDirective } from "@graphql-tools/utils";
import crypto from "crypto";

export const hexDefaultValueDirective = new GraphQLDirective({
  name: "hexDefaultValue",
  locations: [DirectiveLocation.INPUT_FIELD_DEFINITION],
});

export function hexDefaultValueDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.INPUT_OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
      const hexDefaultValueDirectiveConfig = getDirective(
        schema,
        fieldConfig,
        hexDefaultValueDirective.name,
      )?.[0];
      if (hexDefaultValueDirectiveConfig) {
        fieldConfig.defaultValue = crypto.randomBytes(8).toString("hex");
      }
      return fieldConfig;
    },
  });
}
