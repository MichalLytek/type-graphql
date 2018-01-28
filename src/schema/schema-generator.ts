import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNamedType,
  GraphQLFieldConfigMap,
  GraphQLOutputType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLFieldConfigArgumentMap,
  GraphQLType,
  GraphQLScalarType,
  GraphQLInputType,
  GraphQLInputFieldConfigMap,
  GraphQLID,
} from "graphql";

import { MetadataStorage } from "../metadata/metadata-storage";
import {
  HandlerDefinition,
  ParamDefinition,
  FieldDefinition,
} from "../metadata/definition-interfaces";
import { TypeOptions, TypeValue } from "../types";
import { Float, Int, ID } from "../scalars";

interface TypeInfo {
  target: Function;
  type: GraphQLObjectType;
}
interface InputInfo {
  target: Function;
  type: GraphQLInputObjectType;
}
export abstract class SchemaGenerator {
  private static typesInfo: TypeInfo[] = [];
  private static inputsInfo: InputInfo[] = [];

  static generateFromMetadata(): GraphQLSchema {
    MetadataStorage.build();
    this.buildTypesInfo();

    return new GraphQLSchema({
      query: this.buildRootQuery(),
      types: this.buildTypes(),
      mutation: this.buildRootMutation(),
    });
  }

  private static buildTypesInfo() {
    this.typesInfo = MetadataStorage.objectTypes.map<TypeInfo>(objectType => ({
      target: objectType.target,
      type: new GraphQLObjectType({
        name: objectType.name,
        description: "Object description",
        fields: () =>
          objectType.fields!.reduce<GraphQLFieldConfigMap<any, any>>((fields, field) => {
            fields[field.name] = {
              type: this.getGraphQLOutputType(field.getType(), field.typeOptions),
            };
            return fields;
          }, {}),
      }),
    }));

    this.inputsInfo = MetadataStorage.inputTypes.map<InputInfo>(inputType => ({
      target: inputType.target,
      type: new GraphQLInputObjectType({
        name: inputType.name,
        description: "Input description",
        fields: () =>
          inputType.fields!.reduce<GraphQLInputFieldConfigMap>((fields, field) => {
            fields[field.name] = {
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
    return this.typesInfo.map(it => it.type);
  }

  private static generateHandlerFields<T = any, U = any>(
    handlers: HandlerDefinition[],
  ): GraphQLFieldConfigMap<T, U> {
    return handlers.reduce<GraphQLFieldConfigMap<T, U>>((fields, handler) => {
      fields[handler.methodName] = {
        type: this.getGraphQLOutputType(handler.getReturnType(), handler.returnTypeOptions),
        args: this.generateHandlerArgs(handler.params!),
        description: "Handler description",
      };
      return fields;
    }, {});
  }

  private static generateHandlerArgs(params: ParamDefinition[]): GraphQLFieldConfigArgumentMap {
    return params!.reduce<GraphQLFieldConfigArgumentMap>((args, param) => {
      if (param.kind === "arg") {
        args[param.name] = { type: this.getGraphQLInputType(param.getType()) };
      } else if (param.kind === "args") {
        const argumentType = MetadataStorage.argumentTypes.find(
          it => it.target === param.getType(),
        )!;
        argumentType.fields!.forEach(field => {
          args[field.name] = { type: this.getGraphQLInputType(field.getType()) };
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
      this.convertTypeIfScalar(type) ||
      this.typesInfo.find(it => it.target === (type as Function))!.type;

    return this.wrapWithTypeOptions(gqlType, typeOptions);
  }

  private static getGraphQLInputType(
    type: TypeValue,
    typeOptions: TypeOptions = {},
  ): GraphQLInputType {
    const gqlType: GraphQLInputType =
      this.convertTypeIfScalar(type) ||
      this.inputsInfo.find(it => it.target === (type as Function))!.type;

    return this.wrapWithTypeOptions(gqlType, typeOptions);
  }

  private static convertTypeIfScalar(type: any): GraphQLScalarType | undefined {
    switch (type) {
      case String:
        return GraphQLString;
      case Number:
      case Float:
        return GraphQLFloat;
      case Int:
        return GraphQLInt;
      case ID:
        return GraphQLID;
      default:
        return undefined;
    }
  }

  private static wrapWithTypeOptions<T extends GraphQLType>(
    type: T,
    typeOptions: TypeOptions = {},
  ): T {
    let gqlType: GraphQLType = type;
    if (!typeOptions.nullable) {
      gqlType = new GraphQLNonNull(gqlType);
    }
    if (typeOptions.array) {
      gqlType = new GraphQLNonNull(new GraphQLList(gqlType));
    }
    return gqlType as T;
  }
}
