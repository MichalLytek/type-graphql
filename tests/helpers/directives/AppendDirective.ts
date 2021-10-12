import {
  GraphQLSchema,
  defaultFieldResolver,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLString,
} from "graphql";
import { mapSchema, MapperKind, getDirective } from "@graphql-tools/utils";

export const appendDirective = new GraphQLDirective({
  name: "append",
  locations: [DirectiveLocation.FIELD_DEFINITION],
});

export function appendDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const appendDirectiveConfig = getDirective(schema, fieldConfig, "upper")?.[0];
      if (appendDirectiveConfig) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.args!.append = {
          description: "Appends a string to the end of a field",
          type: GraphQLString,
          defaultValue: "",
          extensions: {},
          astNode: undefined,
          deprecationReason: undefined,
        };

        fieldConfig.resolve = async function (source, { append, ...otherArgs }, context, info) {
          const result = await resolve.call(this, source, otherArgs, context, info);
          return `${result}${append}`;
        };
      }
      return fieldConfig;
    },
  });
}
