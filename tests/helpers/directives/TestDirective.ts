import { MapperKind, getDirective, mapSchema } from "@graphql-tools/utils";
import {
  DirectiveLocation,
  type GraphQLArgumentConfig,
  GraphQLDirective,
  type GraphQLFieldConfig,
  type GraphQLInputFieldConfig,
  GraphQLInputObjectType,
  type GraphQLInputObjectTypeConfig,
  GraphQLInterfaceType,
  type GraphQLInterfaceTypeConfig,
  GraphQLObjectType,
  type GraphQLObjectTypeConfig,
  type GraphQLSchema,
} from "graphql";

function mapConfig<
  TConfig extends
    | GraphQLFieldConfig<any, any, any>
    | GraphQLObjectTypeConfig<any, any>
    | GraphQLInterfaceTypeConfig<any, any>
    | GraphQLInputObjectTypeConfig
    | GraphQLInputFieldConfig
    | GraphQLArgumentConfig,
>(config: TConfig) {
  return {
    ...config,
    extensions: {
      ...config.extensions,
      TypeGraphQL: {
        isMappedByDirective: true,
      },
    },
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
    DirectiveLocation.ARGUMENT_DEFINITION,
  ],
});

export function testDirectiveTransformer(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: typeInfo => {
      const testDirectiveConfig = getDirective(schema, typeInfo, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        const config = typeInfo.toConfig();
        return new GraphQLObjectType(mapConfig(config));
      }
      return typeInfo;
    },
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const testDirectiveConfig = getDirective(schema, fieldConfig, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        return mapConfig(fieldConfig);
      }
      return fieldConfig;
    },
    [MapperKind.INTERFACE_TYPE]: interfaceConfig => {
      const testDirectiveConfig = getDirective(schema, interfaceConfig, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        const config = interfaceConfig.toConfig();
        return new GraphQLInterfaceType(mapConfig(config));
      }
      return interfaceConfig;
    },
    [MapperKind.INTERFACE_FIELD]: fieldConfig => {
      const testDirectiveConfig = getDirective(schema, fieldConfig, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        return mapConfig(fieldConfig);
      }
      return fieldConfig;
    },
    [MapperKind.INPUT_OBJECT_TYPE]: typeInfo => {
      const testDirectiveConfig = getDirective(schema, typeInfo, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        const config = typeInfo.toConfig();
        return new GraphQLInputObjectType(mapConfig(config));
      }
      return typeInfo;
    },
    [MapperKind.INPUT_OBJECT_FIELD]: fieldConfig => {
      const testDirectiveConfig = getDirective(schema, fieldConfig, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        return mapConfig(fieldConfig);
      }
      return fieldConfig;
    },
    [MapperKind.ARGUMENT]: argumentConfig => {
      const testDirectiveConfig = getDirective(schema, argumentConfig, testDirective.name)?.[0];
      if (testDirectiveConfig) {
        return mapConfig(argumentConfig);
      }
      return argumentConfig;
    },
  });
}
