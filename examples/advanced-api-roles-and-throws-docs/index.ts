import "reflect-metadata";
import {
  MapperKind,
  getDirective,
  mapSchema,
  printSchemaWithDirectives,
} from "@graphql-tools/utils";
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLList,
  GraphQLNonNull,
  type GraphQLSchema,
  GraphQLString,
} from "graphql";
import { type FieldMetadata } from "@/metadata/definitions";
import { buildSchema } from "../../src";
import { SampleResolver } from "../simple-subscriptions/resolver";

/*
src: https://www.apollographql.com/docs/apollo-server/schema/creating-directives/
*/

function throwsDirectiveTransformer(schema: GraphQLSchema, directiveName: string): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const throwsDirective: { errors: string[] } = getDirective(
        schema,
        fieldConfig,
        directiveName,
      )?.[0] as any;
      if (throwsDirective) {
        // eslint-disable-next-line no-param-reassign
        fieldConfig.description = `${
          fieldConfig.description as string
        }\n\nthrows following errors: ${throwsDirective.errors.join(", ")}`;
      }
      return fieldConfig;
    },
  });
}

export const throwsDirective = new GraphQLDirective({
  name: "throws",
  locations: [DirectiveLocation.OBJECT, DirectiveLocation.FIELD_DEFINITION],
  args: {
    errors: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
    },
  },
});

async function main(): Promise<any> {
  const sampleResolver = SampleResolver;
  const localSchema = await buildSchema({
    resolvers: [sampleResolver],
    directives: [throwsDirective],
    authChecker: () => true,
    transformDescription: (metadata: FieldMetadata) => {
      if (!metadata.roles) {
        return metadata.description;
      }
      const description = metadata.description ?? "";
      if (Array.isArray(metadata.roles) && metadata.roles.length) {
        return `${description}\n\nAuthorized roles: ${metadata.roles.join(", ")}`.trim();
      }
      return `${description}\n\nAuthorization required`.trim();
    },
  });

  const localSchemaW = throwsDirectiveTransformer(localSchema, "throws");

  console.log(printSchemaWithDirectives(localSchemaW));
}

main().catch(console.error);
