import {
  GraphQLSchema,
  GraphQLDirective,
  DirectiveLocation,
  GraphQLFieldConfig,
  GraphQLFieldExtensions,
  GraphQLInterfaceType,
  GraphQLObjectTypeConfig,
  GraphQLObjectType,
  GraphQLInterfaceTypeConfig,
  GraphQLInputObjectType,
  GraphQLInputObjectTypeConfig,
  GraphQLInputFieldConfig,
} from "graphql";
import { mapSchema, MapperKind, getDirective } from "@graphql-tools/utils";

export const testDirective = new GraphQLDirective({
  name: "test",
  locations: [
    DirectiveLocation.OBJECT,
    DirectiveLocation.FIELD_DEFINITION,
    DirectiveLocation.INPUT_OBJECT,
    DirectiveLocation.INPUT_FIELD_DEFINITION,
    DirectiveLocation.INTERFACE,
  ],
});

export function testDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: typeInfo => {
      const testDirectiveConfig = getDirective(schema, typeInfo, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        const config = typeInfo.toConfig();
        mapConfig(config);
        return new GraphQLObjectType(config);
      }
      return typeInfo;
    },
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const testDirectiveConfig = getDirective(schema, fieldConfig, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        mapConfig(fieldConfig);
      }
      return fieldConfig;
    },
    [MapperKind.INTERFACE_TYPE]: interfaceConfig => {
      const testDirectiveConfig = getDirective(schema, interfaceConfig, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        const config = interfaceConfig.toConfig();
        mapConfig(config);
        return new GraphQLInterfaceType(config);
      }
      return interfaceConfig;
    },
    [MapperKind.INTERFACE_FIELD]: fieldConfig => {
      const testDirectiveConfig = getDirective(schema, fieldConfig, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        mapConfig(fieldConfig);
      }
      return fieldConfig;
    },
    [MapperKind.INPUT_OBJECT_TYPE]: typeInfo => {
      const testDirectiveConfig = getDirective(schema, typeInfo, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        const config = typeInfo.toConfig();
        mapConfig(config);
        return new GraphQLInputObjectType(config);
      }
      return typeInfo;
    },
    [MapperKind.INPUT_OBJECT_FIELD]: fieldConfig => {
      const testDirectiveConfig = getDirective(schema, fieldConfig, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        mapConfig(fieldConfig);
      }
      return fieldConfig;
    },
  });
}

function mapConfig(
  config:
    | GraphQLFieldConfig<any, any, any>
    | GraphQLObjectTypeConfig<any, any>
    | GraphQLInterfaceTypeConfig<any, any>
    | GraphQLInputObjectTypeConfig
    | GraphQLInputFieldConfig,
) {
  config.extensions ??= {};
  (config.extensions as GraphQLFieldExtensions<any, any, any>).TypeGraphQL = {
    isMappedByDirective: true,
  };
}
