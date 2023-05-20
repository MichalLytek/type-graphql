import { MapperKind, getDirective, mapSchema } from "@graphql-tools/utils";
import type {
  GraphQLFieldConfig,
  GraphQLFieldExtensions,
  GraphQLInputFieldConfig,
  GraphQLInputObjectTypeConfig,
  GraphQLInterfaceTypeConfig,
  GraphQLObjectTypeConfig,
  GraphQLSchema,
} from "graphql";
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from "graphql";

function mapConfig(
  config:
    | GraphQLFieldConfig<any, any, any>
    | GraphQLObjectTypeConfig<any, any>
    | GraphQLInterfaceTypeConfig<any, any>
    | GraphQLInputObjectTypeConfig
    | GraphQLInputFieldConfig,
) {
  // eslint-disable-next-line no-param-reassign
  config.extensions ??= {};
  // eslint-disable-next-line no-param-reassign
  (config.extensions as GraphQLFieldExtensions<any, any, any>).TypeGraphQL = {
    isMappedByDirective: true,
  };
}

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
