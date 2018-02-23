import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNamedType,
  GraphQLFieldConfigMap,
  GraphQLOutputType,
  GraphQLInputObjectType,
  GraphQLFieldConfigArgumentMap,
  GraphQLInputType,
  GraphQLInputFieldConfigMap,
  GraphQLScalarType,
  GraphQLInterfaceType,
  GraphQLFieldConfig,
} from "graphql";

import { MetadataStorage } from "../metadata/metadata-storage";
import { HandlerDefinition, ParamDefinition } from "../metadata/definition-interfaces";
import { TypeOptions, TypeValue } from "../types/decorators";
import { wrapWithTypeOptions, convertTypeIfScalar } from "../types/helpers";
import { createResolver, createFieldResolver } from "../resolvers/create";
import { BuildContext, BuildContextOptions } from "./build-context";

interface TypeInfo {
  target: Function;
  type: GraphQLObjectType;
}
interface InputInfo {
  target: Function;
  type: GraphQLInputObjectType;
}
interface InterfaceInfo {
  target: Function;
  type: GraphQLInterfaceType;
}
// tslint:disable-next-line:no-empty-interface
export interface SchemaGeneratorOptions extends BuildContextOptions {}

export abstract class SchemaGenerator {
  private static typesInfo: TypeInfo[] = [];
  private static inputsInfo: InputInfo[] = [];
  private static interfacesInfo: InterfaceInfo[] = [];

  static generateFromMetadata(options: SchemaGeneratorOptions): GraphQLSchema {
    BuildContext.create(options);
    MetadataStorage.build();
    this.buildTypesInfo();

    const schema = new GraphQLSchema({
      query: this.buildRootQuery(),
      mutation: this.buildRootMutation(),
      types: this.buildTypes(),
    });

    BuildContext.reset();
    return schema;
  }

  private static buildTypesInfo() {
    this.interfacesInfo = MetadataStorage.interfaceTypes.map<InterfaceInfo>(interfaceType => ({
      target: interfaceType.target,
      type: new GraphQLInterfaceType({
        name: interfaceType.name,
        description: interfaceType.description,
        fields: () =>
          interfaceType.fields!.reduce<GraphQLFieldConfigMap<any, any>>((fields, field) => {
            fields[field.name] = {
              description: field.description,
              type: this.getGraphQLOutputType(field.getType(), field.typeOptions),
            };
            return fields;
          }, {}),
      }),
    }));

    this.typesInfo = MetadataStorage.objectTypes.map<TypeInfo>(objectType => ({
      target: objectType.target,
      type: new GraphQLObjectType({
        name: objectType.name,
        description: objectType.description,
        interfaces: () =>
          (objectType.interfaceClasses || []).map<GraphQLInterfaceType>(
            interfaceClass =>
              this.interfacesInfo.find(info => info.target === interfaceClass)!.type,
          ),
        fields: () => {
          const fields = objectType.fields!.reduce<GraphQLFieldConfigMap<any, any>>(
            (fieldsMap, field) => {
              const fieldResolverDefinition = MetadataStorage.fieldResolvers.find(
                resolver =>
                  resolver.getParentType!() === objectType.target &&
                  resolver.methodName === field.name,
              );
              fieldsMap[field.name] = {
                type: this.getGraphQLOutputType(field.getType(), field.typeOptions),
                args: this.generateHandlerArgs(field.params!),
                resolve: fieldResolverDefinition && createFieldResolver(fieldResolverDefinition),
                description: field.description,
                deprecationReason: field.deprecationReason,
              };
              return fieldsMap;
            },
            {},
          );
          // support for extending classes - get field info from prototype
          const SuperClass = Object.getPrototypeOf(objectType.target);
          if (SuperClass.prototype !== undefined) {
            const hehe = this.typesInfo.find(type => type.target === SuperClass)!;
            const heheFields = hehe.type.getFields();
            const superFields = Object.keys(heheFields).reduce<GraphQLFieldConfigMap<any, any>>(
              (fieldsMap, fieldName) => {
                const superField = heheFields[fieldName];
                superField.args;
                fieldsMap[fieldName] = {
                  type: superField.type,
                  args: superField.args.reduce<GraphQLFieldConfigArgumentMap>(
                    (argMap, { name, ...arg }) => {
                      argMap[name] = arg;
                      return argMap;
                    },
                    {},
                  ),
                  resolve: superField.resolve,
                  description: superField.description,
                  deprecationReason: superField.deprecationReason,
                } as GraphQLFieldConfig<any, any>;
                return fieldsMap;
              },
              {},
            );
            Object.assign(fields, superFields);
          }
          return fields;
        },
      }),
    }));

    this.inputsInfo = MetadataStorage.inputTypes.map<InputInfo>(inputType => ({
      target: inputType.target,
      type: new GraphQLInputObjectType({
        name: inputType.name,
        description: inputType.description,
        fields: () =>
          inputType.fields!.reduce<GraphQLInputFieldConfigMap>((fields, field) => {
            fields[field.name] = {
              description: field.description,
              type: this.getGraphQLInputType(field.getType(), field.typeOptions),
            };
            return fields;
          }, {}),
      }),
    }));
  }

  private static buildRootQuery(): GraphQLObjectType {
    return new GraphQLObjectType({
      name: "Query",
      fields: this.generateHandlerFields(MetadataStorage.queries),
    });
  }

  private static buildRootMutation(): GraphQLObjectType | undefined {
    if (MetadataStorage.mutations.length > 0) {
      return new GraphQLObjectType({
        name: "Mutation",
        fields: this.generateHandlerFields(MetadataStorage.mutations),
      });
    }
    return undefined;
  }

  private static buildTypes(): GraphQLNamedType[] {
    return [...this.typesInfo.map(it => it.type), ...this.interfacesInfo.map(it => it.type)];
  }

  private static generateHandlerFields<T = any, U = any>(
    handlers: HandlerDefinition[],
  ): GraphQLFieldConfigMap<T, U> {
    return handlers.reduce<GraphQLFieldConfigMap<T, U>>((fields, handler) => {
      fields[handler.methodName] = {
        type: this.getGraphQLOutputType(handler.getReturnType(), handler.returnTypeOptions),
        args: this.generateHandlerArgs(handler.params!),
        resolve: createResolver(handler),
        description: handler.description,
        deprecationReason: handler.deprecationReason,
      };
      return fields;
    }, {});
  }

  private static generateHandlerArgs(params: ParamDefinition[]): GraphQLFieldConfigArgumentMap {
    return params!.reduce<GraphQLFieldConfigArgumentMap>((args, param) => {
      if (param.kind === "arg") {
        args[param.name] = {
          description: param.description,
          type: this.getGraphQLInputType(param.getType(), param.typeOptions),
        };
      } else if (param.kind === "args") {
        const argumentType = MetadataStorage.argumentTypes.find(
          it => it.target === param.getType(),
        )!;
        argumentType.fields!.forEach(field => {
          args[field.name] = {
            description: field.description,
            type: this.getGraphQLInputType(field.getType(), field.typeOptions),
          };
        });
      }
      return args;
    }, {});
  }

  private static getGraphQLOutputType(
    type: TypeValue,
    typeOptions: TypeOptions = {},
  ): GraphQLOutputType {
    const gqlType: GraphQLOutputType =
      convertTypeIfScalar(type) ||
      this.typesInfo.find(it => it.target === (type as Function))!.type;

    return wrapWithTypeOptions(gqlType, typeOptions);
  }

  private static getGraphQLInputType(
    type: TypeValue,
    typeOptions: TypeOptions = {},
  ): GraphQLInputType {
    const gqlType: GraphQLInputType =
      convertTypeIfScalar(type) ||
      this.inputsInfo.find(it => it.target === (type as Function))!.type;

    return wrapWithTypeOptions(gqlType, typeOptions);
  }
}
