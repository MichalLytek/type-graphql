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
  GraphQLInputFieldConfig,
  graphql,
  introspectionQuery,
  GraphQLEnumType,
  GraphQLEnumValueConfigMap,
  GraphQLEnumValueConfig,
  GraphQLUnionType,
} from "graphql";

import { MetadataStorage } from "../metadata/metadata-storage";
import {
  HandlerDefinition,
  ParamDefinition,
  ClassDefinition,
} from "../metadata/definition-interfaces";
import { TypeOptions, TypeValue } from "../types/decorators";
import { wrapWithTypeOptions, convertTypeIfScalar, getEnumValuesMap } from "../types/helpers";
import {
  createHandlerResolver,
  createAdvancedFieldResolver,
  createSimpleFieldResolver,
} from "../resolvers/create";
import { BuildContext, BuildContextOptions } from "./build-context";
import { UnionResolveTypeError, GeneratingSchemaError } from "../errors";

interface ObjectTypeInfo {
  target: Function;
  type: GraphQLObjectType;
}
interface InputObjectTypeInfo {
  target: Function;
  type: GraphQLInputObjectType;
}
interface InterfaceTypeInfo {
  target: Function;
  type: GraphQLInterfaceType;
}
interface EnumTypeInfo {
  enumObj: object;
  type: GraphQLEnumType;
}
interface UnionTypeInfo {
  unionSymbol: symbol;
  type: GraphQLUnionType;
}
// tslint:disable-next-line:no-empty-interface
export interface SchemaGeneratorOptions extends BuildContextOptions {}

export abstract class SchemaGenerator {
  private static objectTypesInfo: ObjectTypeInfo[] = [];
  private static inputTypesInfo: InputObjectTypeInfo[] = [];
  private static interfaceTypesInfo: InterfaceTypeInfo[] = [];
  private static enumTypesInfo: EnumTypeInfo[] = [];
  private static unionTypesInfo: UnionTypeInfo[] = [];

  static async generateFromMetadata(options: SchemaGeneratorOptions): Promise<GraphQLSchema> {
    await this.checkForErrors(options);
    BuildContext.create(options);
    MetadataStorage.build();
    this.buildTypesInfo();

    const schema = new GraphQLSchema({
      query: this.buildRootQuery(),
      mutation: this.buildRootMutation(),
      types: this.buildTypes(),
    });

    const { errors } = await graphql(schema, introspectionQuery);
    if (errors) {
      throw new GeneratingSchemaError(errors);
    }

    BuildContext.reset();
    return schema;
  }

  private static async checkForErrors(options: SchemaGeneratorOptions) {
    if (MetadataStorage.authorizedFields.length !== 0 && options.authChecker === undefined) {
      throw new Error(
        "You need to provide `authChecker` function for `@Authorized` decorator usage!",
      );
    }
  }

  private static buildTypesInfo() {
    this.unionTypesInfo = MetadataStorage.unions.map<UnionTypeInfo>(unionDefinition => {
      return {
        unionSymbol: unionDefinition.symbol,
        type: new GraphQLUnionType({
          name: unionDefinition.name,
          description: unionDefinition.description,
          types: () =>
            unionDefinition.types.map(
              objectType => this.objectTypesInfo.find(type => type.target === objectType)!.type,
            ),
          resolveType: instance => {
            const instanceTarget = unionDefinition.types.find(type => instance instanceof type);
            if (!instanceTarget) {
              throw new UnionResolveTypeError(unionDefinition);
            }
            // TODO: refactor to map for quicker access
            return this.objectTypesInfo.find(type => type.target === instanceTarget)!.type;
          },
        }),
      };
    });
    this.enumTypesInfo = MetadataStorage.enums.map<EnumTypeInfo>(enumDefinition => {
      const enumMap = getEnumValuesMap(enumDefinition.enumObj);
      return {
        enumObj: enumDefinition.enumObj,
        type: new GraphQLEnumType({
          name: enumDefinition.name,
          description: enumDefinition.description,
          values: Object.keys(enumMap).reduce<GraphQLEnumValueConfigMap>((enumConfig, enumKey) => {
            enumConfig[enumKey] = {
              value: enumMap[enumKey],
            };
            return enumConfig;
          }, {}),
        }),
      };
    });
    this.interfaceTypesInfo = MetadataStorage.interfaceTypes.map<InterfaceTypeInfo>(
      interfaceType => {
        const interfaceSuperClass = Object.getPrototypeOf(interfaceType.target);
        const hasExtended = interfaceSuperClass.prototype !== undefined;
        const getSuperClassType = () =>
          this.interfaceTypesInfo.find(type => type.target === interfaceSuperClass)!.type;
        return {
          target: interfaceType.target,
          type: new GraphQLInterfaceType({
            name: interfaceType.name,
            description: interfaceType.description,
            fields: () => {
              let fields = interfaceType.fields!.reduce<GraphQLFieldConfigMap<any, any>>(
                (fieldsMap, field) => {
                  fieldsMap[field.name] = {
                    description: field.description,
                    type: this.getGraphQLOutputType(field.name, field.getType(), field.typeOptions),
                  };
                  return fieldsMap;
                },
                {},
              );
              // support for extending interface classes - get field info from prototype
              if (hasExtended) {
                fields = Object.assign(
                  {},
                  this.getFieldDefinitionFromObjectType(getSuperClassType()),
                  fields,
                );
              }
              return fields;
            },
          }),
        };
      },
    );

    this.objectTypesInfo = MetadataStorage.objectTypes.map<ObjectTypeInfo>(objectType => {
      const objectSuperClass = Object.getPrototypeOf(objectType.target);
      const hasExtended = objectSuperClass.prototype !== undefined;
      const getSuperClassType = () =>
        this.objectTypesInfo.find(type => type.target === objectSuperClass)!.type;
      const interfaceClasses = objectType.interfaceClasses || [];
      return {
        target: objectType.target,
        type: new GraphQLObjectType({
          name: objectType.name,
          description: objectType.description,
          isTypeOf:
            hasExtended || interfaceClasses.length > 0
              ? instance => instance instanceof objectType.target
              : undefined,
          interfaces: () => {
            let interfaces = interfaceClasses.map<GraphQLInterfaceType>(
              interfaceClass =>
                this.interfaceTypesInfo.find(info => info.target === interfaceClass)!.type,
            );
            // copy interfaces from super class
            if (hasExtended) {
              const superInterfaces = getSuperClassType().getInterfaces();
              interfaces = Array.from(new Set(interfaces.concat(superInterfaces)));
            }
            return interfaces;
          },
          fields: () => {
            let fields = objectType.fields!.reduce<GraphQLFieldConfigMap<any, any>>(
              (fieldsMap, field) => {
                const fieldResolverDefinition = MetadataStorage.fieldResolvers.find(
                  resolver =>
                    resolver.getParentType!() === objectType.target &&
                    resolver.methodName === field.name,
                );
                fieldsMap[field.name] = {
                  type: this.getGraphQLOutputType(field.name, field.getType(), field.typeOptions),
                  args: this.generateHandlerArgs(field.params!),
                  resolve: fieldResolverDefinition
                    ? createAdvancedFieldResolver(fieldResolverDefinition)
                    : createSimpleFieldResolver(field),
                  description: field.description,
                  deprecationReason: field.deprecationReason,
                };
                return fieldsMap;
              },
              {},
            );
            // support for extending classes - get field info from prototype
            if (hasExtended) {
              fields = Object.assign(
                {},
                this.getFieldDefinitionFromObjectType(getSuperClassType()),
                fields,
              );
            }
            // support for implicitly implementing interfaces
            // get fields from interfaces definitions
            if (objectType.interfaceClasses) {
              const interfacesFields = objectType.interfaceClasses.reduce<
                GraphQLFieldConfigMap<any, any>
              >((fieldsMap, interfaceClass) => {
                const interfaceType = this.interfaceTypesInfo.find(
                  type => type.target === interfaceClass,
                )!.type;
                return Object.assign(
                  fieldsMap,
                  this.getFieldDefinitionFromObjectType(interfaceType),
                );
              }, {});
              fields = Object.assign({}, interfacesFields, fields);
            }
            return fields;
          },
        }),
      };
    });

    this.inputTypesInfo = MetadataStorage.inputTypes.map<InputObjectTypeInfo>(inputType => {
      const objectSuperClass = Object.getPrototypeOf(inputType.target);
      const getSuperClassType = () =>
        this.inputTypesInfo.find(type => type.target === objectSuperClass)!.type;
      return {
        target: inputType.target,
        type: new GraphQLInputObjectType({
          name: inputType.name,
          description: inputType.description,
          fields: () => {
            const fields = inputType.fields!.reduce<GraphQLInputFieldConfigMap>(
              (fieldsMap, field) => {
                fieldsMap[field.name] = {
                  description: field.description,
                  type: this.getGraphQLInputType(field.name, field.getType(), field.typeOptions),
                };
                return fieldsMap;
              },
              {},
            );
            // support for extending classes - get field info from prototype
            if (objectSuperClass.prototype !== undefined) {
              Object.assign(fields, this.getFieldDefinitionFromInputType(getSuperClassType()));
            }
            return fields;
          },
        }),
      };
    });
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
    // TODO: investigate the need of directly providing this types
    // maybe GraphQL can use only the types provided indirectly
    return [
      ...this.objectTypesInfo.map(it => it.type),
      ...this.interfaceTypesInfo.map(it => it.type),
    ];
  }

  private static generateHandlerFields<T = any, U = any>(
    handlers: HandlerDefinition[],
  ): GraphQLFieldConfigMap<T, U> {
    return handlers.reduce<GraphQLFieldConfigMap<T, U>>((fields, handler) => {
      fields[handler.methodName] = {
        type: this.getGraphQLOutputType(
          handler.methodName,
          handler.getReturnType(),
          handler.returnTypeOptions,
        ),
        args: this.generateHandlerArgs(handler.params!),
        resolve: createHandlerResolver(handler),
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
          type: this.getGraphQLInputType(param.name, param.getType(), param.typeOptions),
        };
      } else if (param.kind === "args") {
        const argumentType = MetadataStorage.argumentTypes.find(
          it => it.target === param.getType(),
        )!;
        let superClass = Object.getPrototypeOf(argumentType.target);
        while (superClass.prototype !== undefined) {
          const superArgumentType = MetadataStorage.argumentTypes.find(
            it => it.target === superClass,
          )!;
          this.mapArgFields(superArgumentType, args);
          superClass = Object.getPrototypeOf(superClass);
        }
        this.mapArgFields(argumentType, args);
      }
      return args;
    }, {});
  }

  private static mapArgFields(
    argumentType: ClassDefinition,
    args: GraphQLFieldConfigArgumentMap = {},
  ) {
    argumentType.fields!.forEach(field => {
      args[field.name] = {
        description: field.description,
        type: this.getGraphQLInputType(field.name, field.getType(), field.typeOptions),
      };
    });
  }

  private static getFieldDefinitionFromObjectType(type: GraphQLObjectType | GraphQLInterfaceType) {
    const fieldInfo = type.getFields();
    const typeFields = Object.keys(fieldInfo).reduce<GraphQLFieldConfigMap<any, any>>(
      (fieldsMap, fieldName) => {
        const superField = fieldInfo[fieldName];
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
    return typeFields;
  }

  private static getFieldDefinitionFromInputType(type: GraphQLInputObjectType) {
    const fieldInfo = type.getFields();
    const typeFields = Object.keys(fieldInfo).reduce<GraphQLInputFieldConfigMap>(
      (fieldsMap, fieldName) => {
        const superField = fieldInfo[fieldName];
        fieldsMap[fieldName] = {
          type: superField.type,
          description: superField.description,
        } as GraphQLInputFieldConfig;
        return fieldsMap;
      },
      {},
    );
    return typeFields;
  }

  private static getGraphQLOutputType(
    typeOwnerName: string,
    type: TypeValue,
    typeOptions: TypeOptions = {},
  ): GraphQLOutputType {
    let gqlType: GraphQLOutputType | undefined;
    gqlType = convertTypeIfScalar(type);
    if (!gqlType) {
      const objectType = this.objectTypesInfo.find(it => it.target === (type as Function));
      if (objectType) {
        gqlType = objectType.type;
      }
    }
    if (!gqlType) {
      const interfaceType = this.interfaceTypesInfo.find(it => it.target === (type as Function));
      if (interfaceType) {
        gqlType = interfaceType.type;
      }
    }
    if (!gqlType) {
      const enumType = this.enumTypesInfo.find(it => it.enumObj === (type as Function));
      if (enumType) {
        gqlType = enumType.type;
      }
    }
    if (!gqlType) {
      const unionType = this.unionTypesInfo.find(it => it.unionSymbol === (type as symbol));
      if (unionType) {
        gqlType = unionType.type;
      }
    }
    if (!gqlType) {
      throw new Error(`Cannot determine GraphQL output type for ${typeOwnerName}`!);
    }

    return wrapWithTypeOptions(gqlType, typeOptions);
  }

  private static getGraphQLInputType(
    typeOwnerName: string,
    type: TypeValue,
    typeOptions: TypeOptions = {},
  ): GraphQLInputType {
    let gqlType: GraphQLInputType | undefined;
    gqlType = convertTypeIfScalar(type);
    if (!gqlType) {
      const inputType = this.inputTypesInfo.find(it => it.target === (type as Function));
      if (inputType) {
        gqlType = inputType.type;
      }
    }
    if (!gqlType) {
      const enumType = this.enumTypesInfo.find(it => it.enumObj === (type as Function));
      if (enumType) {
        gqlType = enumType.type;
      }
    }
    if (!gqlType) {
      throw new Error(`Cannot determine GraphQL input type for ${typeOwnerName}`!);
    }

    return wrapWithTypeOptions(gqlType, typeOptions);
  }
}
