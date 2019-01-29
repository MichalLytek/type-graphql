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
  GraphQLInterfaceType,
  graphql,
  getIntrospectionQuery,
  GraphQLEnumType,
  GraphQLEnumValueConfigMap,
  GraphQLUnionType,
} from "graphql";
import { withFilter, ResolverFn } from "graphql-subscriptions";

import { getMetadataStorage } from "../metadata/getMetadataStorage";
import {
  ResolverMetadata,
  ParamMetadata,
  ClassMetadata,
  SubscriptionResolverMetadata,
  ArgsParamMetadata,
  TypeClassMetadata,
} from "../metadata/definitions";
import { TypeOptions, TypeValue } from "../decorators/types";
import { wrapWithTypeOptions, convertTypeIfScalar, getEnumValuesMap } from "../helpers/types";
import {
  createHandlerResolver,
  createAdvancedFieldResolver,
  createSimpleFieldResolver,
} from "../resolvers/create";
import { BuildContext, BuildContextOptions } from "./build-context";
import {
  UnionResolveTypeError,
  GeneratingSchemaError,
  MissingSubscriptionTopicsError,
  ConflictingDefaultValuesError,
} from "../errors";
import { ResolverFilterData, ResolverTopicData } from "../interfaces";
import { getFieldMetadataFromInputType, getFieldMetadataFromObjectType } from "./utils";
import { ensureInstalledCorrectGraphQLPackage } from "../utils/graphql-version";

interface ObjectTypeInfo {
  target: Function;
  type: GraphQLObjectType;
}
interface ModelTypeInfo {
  name: string;
  type: GraphQLObjectType | GraphQLInputObjectType;
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
interface ArgsInfo {
  target: Function;
}
// tslint:disable-next-line:no-empty-interface
export interface SchemaGeneratorOptions extends BuildContextOptions {}

export abstract class SchemaGenerator {
  private static objectTypesInfo: ObjectTypeInfo[] = [];
  private static ArgsInfo: ClassMetadata[] = [];
  private static inputTypesInfo: InputObjectTypeInfo[] = [];
  private static interfaceTypesInfo: InterfaceTypeInfo[] = [];
  private static enumTypesInfo: EnumTypeInfo[] = [];
  private static unionTypesInfo: UnionTypeInfo[] = [];
  private static modelTypesInfo: ModelTypeInfo[] = [];

  static async generateFromMetadata(options: SchemaGeneratorOptions): Promise<GraphQLSchema> {
    const schema = this.generateFromMetadataSync(options);
    const { errors } = await graphql(schema, getIntrospectionQuery());
    if (errors) {
      throw new GeneratingSchemaError(errors);
    }
    return schema;
  }

  static generateFromMetadataSync(options: SchemaGeneratorOptions): GraphQLSchema {
    this.checkForErrors(options);
    BuildContext.create(options);
    getMetadataStorage().build();
    this.buildTypesInfo();

    const schema = new GraphQLSchema({
      query: this.buildRootQueryType(),
      mutation: this.buildRootMutationType(),
      subscription: this.buildRootSubscriptionType(),
      types: this.buildOtherTypes(),
    });

    BuildContext.reset();
    return schema;
  }

  private static checkForErrors(options: SchemaGeneratorOptions) {
    ensureInstalledCorrectGraphQLPackage();
    if (getMetadataStorage().authorizedFields.length !== 0 && options.authChecker === undefined) {
      throw new Error(
        "You need to provide `authChecker` function for `@Authorized` decorator usage!",
      );
    }
  }

  private static getDefaultValue(
    typeInstance: { [property: string]: unknown },
    typeOptions: TypeOptions,
    fieldName: string,
    typeName: string,
  ): unknown | undefined {
    let defaultValueFromInitializer;
    try {
      defaultValueFromInitializer = typeInstance[fieldName];
    } catch (err) {}
    if (
      typeOptions.defaultValue !== undefined &&
      defaultValueFromInitializer !== undefined &&
      typeOptions.defaultValue !== defaultValueFromInitializer
    ) {
      throw new ConflictingDefaultValuesError(
        typeName,
        fieldName,
        typeOptions.defaultValue,
        defaultValueFromInitializer,
      );
    }
    return typeOptions.defaultValue !== undefined
      ? typeOptions.defaultValue
      : defaultValueFromInitializer;
  }

  private static buildTypesInfo() {
    this.unionTypesInfo = getMetadataStorage().unions.map<UnionTypeInfo>(unionMetadata => {
      return {
        unionSymbol: unionMetadata.symbol,
        type: new GraphQLUnionType({
          name: unionMetadata.name,
          description: unionMetadata.description,
          types: () =>
            unionMetadata.types.map(
              objectType => this.objectTypesInfo.find(type => type.target === objectType)!.type,
            ),
          resolveType: instance => {
            const instanceTarget = unionMetadata.types.find(type => instance instanceof type);
            if (!instanceTarget) {
              throw new UnionResolveTypeError(unionMetadata);
            }
            // TODO: refactor to map for quicker access
            return this.objectTypesInfo.find(type => type.target === instanceTarget)!.type;
          },
        }),
      };
    });
    this.enumTypesInfo = getMetadataStorage().enums.map<EnumTypeInfo>(enumMetadata => {
      const enumMap = getEnumValuesMap(enumMetadata.enumObj);
      return {
        enumObj: enumMetadata.enumObj,
        type: new GraphQLEnumType({
          name: enumMetadata.name,
          description: enumMetadata.description,
          values: Object.keys(enumMap).reduce<GraphQLEnumValueConfigMap>((enumConfig, enumKey) => {
            enumConfig[enumKey] = {
              value: enumMap[enumKey],
            };
            return enumConfig;
          }, {}),
        }),
      };
    });
    this.interfaceTypesInfo = getMetadataStorage().interfaceTypes.map<InterfaceTypeInfo>(
      interfaceType => {
        const interfaceSuperClass = Object.getPrototypeOf(interfaceType.target);
        const hasExtended = interfaceSuperClass.prototype !== undefined;
        const getSuperClassType = () => {
          const superClassTypeInfo = this.interfaceTypesInfo.find(
            type => type.target === interfaceSuperClass,
          );
          return superClassTypeInfo ? superClassTypeInfo.type : undefined;
        };
        return {
          target: interfaceType.target,
          type: new GraphQLInterfaceType({
            name: interfaceType.name,
            description: interfaceType.description,
            fields: () => {
              let fields = interfaceType.fields!.reduce<GraphQLFieldConfigMap<any, any>>(
                (fieldsMap, field) => {
                  fieldsMap[field.schemaName] = {
                    description: field.description,
                    type: this.getGraphQLOutputType(field.name, field.getType(), field.typeOptions),
                  };
                  return fieldsMap;
                },
                {},
              );
              // support for extending interface classes - get field info from prototype
              if (hasExtended) {
                const superClass = getSuperClassType();
                if (superClass) {
                  const superClassFields = getFieldMetadataFromObjectType(superClass);
                  fields = Object.assign({}, superClassFields, fields);
                }
              }
              return fields;
            },
          }),
        };
      },
    );

    this.objectTypesInfo = getMetadataStorage().objectTypes.map<ObjectTypeInfo>(objectType => {
      const objectSuperClass = Object.getPrototypeOf(objectType.target);
      const hasExtended = objectSuperClass.prototype !== undefined;
      const getSuperClassType = () => {
        const superClassTypeInfo = this.objectTypesInfo.find(
          type => type.target === objectSuperClass,
        );
        return superClassTypeInfo ? superClassTypeInfo.type : undefined;
      };
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
              const superClass = getSuperClassType();
              if (superClass) {
                const superInterfaces = superClass.getInterfaces();
                interfaces = Array.from(new Set(interfaces.concat(superInterfaces)));
              }
            }
            return interfaces;
          },
          fields: () => {
            let fields = objectType.fields!.reduce<GraphQLFieldConfigMap<any, any>>(
              (fieldsMap, field) => {
                const fieldResolverMetadata = getMetadataStorage().fieldResolvers.find(
                  resolver =>
                    resolver.getObjectType!() === objectType.target &&
                    resolver.methodName === field.name &&
                    (resolver.resolverClassMetadata === undefined ||
                      resolver.resolverClassMetadata.isAbstract === false),
                );
                fieldsMap[field.schemaName] = {
                  type: this.getGraphQLOutputType(field.name, field.getType(), field.typeOptions),
                  complexity: field.complexity,
                  args: this.generateHandlerArgs(field.params!),
                  resolve: fieldResolverMetadata
                    ? createAdvancedFieldResolver(fieldResolverMetadata)
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
              const superClass = getSuperClassType();
              if (superClass) {
                const superClassFields = getFieldMetadataFromObjectType(superClass);
                fields = Object.assign({}, superClassFields, fields);
              }
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
                return Object.assign(fieldsMap, getFieldMetadataFromObjectType(interfaceType));
              }, {});
              fields = Object.assign({}, interfacesFields, fields);
            }
            return fields;
          },
        }),
      };
    });

    this.inputTypesInfo = getMetadataStorage().inputTypes.map<InputObjectTypeInfo>(inputType => {
      const objectSuperClass = Object.getPrototypeOf(inputType.target);
      const getSuperClassType = () => {
        const superClassTypeInfo = this.inputTypesInfo.find(
          type => type.target === objectSuperClass,
        );
        return superClassTypeInfo ? superClassTypeInfo.type : undefined;
      };
      const inputInstance = new (inputType.target as any)();
      return {
        target: inputType.target,
        type: new GraphQLInputObjectType({
          name: inputType.name,
          description: inputType.description,
          fields: () => {
            let fields = inputType.fields!.reduce<GraphQLInputFieldConfigMap>(
              (fieldsMap, field) => {
                field.typeOptions.defaultValue = this.getDefaultValue(
                  inputInstance,
                  field.typeOptions,
                  field.name,
                  inputType.name,
                );

                fieldsMap[field.schemaName] = {
                  description: field.description,
                  type: this.getGraphQLInputType(field.name, field.getType(), field.typeOptions),
                  defaultValue: field.typeOptions.defaultValue,
                };
                return fieldsMap;
              },
              {},
            );
            // support for extending classes - get field info from prototype
            if (objectSuperClass.prototype !== undefined) {
              const superClass = getSuperClassType();
              if (superClass) {
                const superClassFields = getFieldMetadataFromInputType(superClass);
                fields = Object.assign({}, superClassFields, fields);
              }
            }
            return fields;
          },
        }),
      };
    });

    const models = getMetadataStorage().modelTypes.concat(getMetadataStorage().destinationTypes);
    models.map(model => {
      switch (model.toType) {
        case "ObjectType":
          this.modelTypesInfo.push({
            name: model.name,
            type: new GraphQLObjectType({
              name: model.name,
              fields: () => {
                const fields = model.fields!.reduce<GraphQLFieldConfigMap<any, any>>(
                  (fieldsMap, field) => {
                    const fieldResolverMetadata = getMetadataStorage().fieldResolvers.find(
                      resolver =>
                        resolver.getObjectType!() === model.target &&
                        resolver.methodName === field.name &&
                        (resolver.resolverClassMetadata === undefined ||
                          resolver.resolverClassMetadata.isAbstract === false),
                    );
                    fieldsMap[field.schemaName] = {
                      type: this.getGraphQLOutputType(
                        field.name,
                        field.getType(),
                        field.typeOptions,
                      ),
                      complexity: field.complexity,
                      args: this.generateHandlerArgs(field.params!),
                      resolve: fieldResolverMetadata
                        ? createAdvancedFieldResolver(fieldResolverMetadata)
                        : createSimpleFieldResolver(field),
                      description: field.description,
                      deprecationReason: field.deprecationReason,
                    };
                    return fieldsMap;
                  },
                  {},
                );
                return fields;
              },
            }),
          });
          break;

        case "InputType":
          const inputInstance = new (model.target as any)();
          this.modelTypesInfo.push({
            name: model.name,
            type: new GraphQLInputObjectType({
              name: model.name,
              fields: () => {
                return model.fields!.reduce<GraphQLInputFieldConfigMap>((fieldsMap, field) => {
                  field.typeOptions.defaultValue = this.getDefaultValue(
                    inputInstance,
                    field.typeOptions,
                    field.name,
                    model.name,
                  );

                  fieldsMap[field.schemaName] = {
                    description: field.description,
                    type: this.getGraphQLInputType(field.name, field.getType(), field.typeOptions),
                    defaultValue: field.typeOptions.defaultValue,
                  };
                  return fieldsMap;
                }, {});
              },
            }),
          });
          break;
      }
    });
  }

  private static buildRootQueryType(): GraphQLObjectType {
    return new GraphQLObjectType({
      name: "Query",
      fields: this.generateHandlerFields(getMetadataStorage().queries),
    });
  }

  private static buildRootMutationType(): GraphQLObjectType | undefined {
    if (getMetadataStorage().mutations.length === 0) {
      return;
    }
    return new GraphQLObjectType({
      name: "Mutation",
      fields: this.generateHandlerFields(getMetadataStorage().mutations),
    });
  }

  private static buildRootSubscriptionType(): GraphQLObjectType | undefined {
    if (getMetadataStorage().subscriptions.length === 0) {
      return;
    }
    return new GraphQLObjectType({
      name: "Subscription",
      fields: this.generateSubscriptionsFields(getMetadataStorage().subscriptions),
    });
  }

  private static buildOtherTypes(): GraphQLNamedType[] {
    // TODO: investigate the need of directly providing this types
    // maybe GraphQL can use only the types provided indirectly
    return [
      ...this.objectTypesInfo.map(it => it.type),
      ...this.interfaceTypesInfo.map(it => it.type),
      ...this.modelTypesInfo.map(it => it.type),
    ];
  }

  private static generateHandlerFields<T = any, U = any>(
    handlers: ResolverMetadata[],
  ): GraphQLFieldConfigMap<T, U> {
    return handlers.reduce<GraphQLFieldConfigMap<T, U>>((fields, handler) => {
      // omit emitting abstract resolver fields
      if (handler.resolverClassMetadata && handler.resolverClassMetadata.isAbstract) {
        return fields;
      }
      fields[handler.schemaName] = {
        type: this.getGraphQLOutputType(
          handler.methodName,
          handler.getReturnType(),
          handler.returnTypeOptions,
        ),
        args: this.generateHandlerArgs(handler.params!),
        resolve: createHandlerResolver(handler),
        description: handler.description,
        deprecationReason: handler.deprecationReason,
        complexity: handler.complexity,
      };
      return fields;
    }, {});
  }

  private static generateSubscriptionsFields<T = any, U = any>(
    subscriptionsHandlers: SubscriptionResolverMetadata[],
  ): GraphQLFieldConfigMap<T, U> {
    const { pubSub } = BuildContext;
    const basicFields = this.generateHandlerFields(subscriptionsHandlers);
    return subscriptionsHandlers.reduce<GraphQLFieldConfigMap<T, U>>((fields, handler) => {
      // omit emitting abstract resolver fields
      if (handler.resolverClassMetadata && handler.resolverClassMetadata.isAbstract) {
        return fields;
      }

      let pubSubIterator: ResolverFn;
      if (typeof handler.topics === "function") {
        const getTopics = handler.topics;
        pubSubIterator = (payload, args, context, info) => {
          const resolverTopicData: ResolverTopicData = { payload, args, context, info };
          const topics = getTopics(resolverTopicData);
          if (Array.isArray(topics) && topics.length === 0) {
            throw new MissingSubscriptionTopicsError(handler.target, handler.methodName);
          }
          return pubSub.asyncIterator(topics);
        };
      } else {
        const topics = handler.topics;
        pubSubIterator = () => pubSub.asyncIterator(topics);
      }

      fields[handler.schemaName].subscribe = handler.filter
        ? withFilter(pubSubIterator, (payload, args, context, info) => {
            const resolverFilterData: ResolverFilterData = { payload, args, context, info };
            return handler.filter!(resolverFilterData);
          })
        : pubSubIterator;
      return fields;
    }, basicFields);
  }

  private static generateHandlerArgs(params: ParamMetadata[]): GraphQLFieldConfigArgumentMap {
    return params!.reduce<GraphQLFieldConfigArgumentMap>((args, param) => {
      if (param.kind === "arg") {
        args[param.name] = {
          description: param.description,
          type: this.getGraphQLInputType(param.name, param.getType(), param.typeOptions),
          defaultValue: param.typeOptions.defaultValue,
        };
      } else if (param.kind === "args") {
        try {
          const argumentType = getMetadataStorage().argumentTypes.find(it =>
            this.matchArg(it, param),
          )!;
          let superClass = Object.getPrototypeOf(argumentType.target);
          while (superClass.prototype !== undefined) {
            const superArgumentType = getMetadataStorage().argumentTypes.find(
              it => it.target === superClass,
            )!;
            this.mapArgFields(superArgumentType, args);
            superClass = Object.getPrototypeOf(superClass);
          }
          this.mapArgFields(argumentType, args);
        } catch (err) {
          const fakeUsage = getMetadataStorage().modelTypes.find(it => this.matchArg(it, param));
          if (fakeUsage) {
            throw new Error(
              `Do not use the model ${
                (param.getType() as Function).name
              } with @Args if it's not declared as a ArgsType`,
            );
          } else {
            throw err;
          }
        }
      }
      return args;
    }, {});
  }

  private static matchArg(item: TypeClassMetadata, param: ArgsParamMetadata) {
    const sameTarget = item.target === param.getType();
    if (item.model) {
      return item.model.name === param.typeOptions.model!.name && sameTarget;
    }
    return sameTarget;
  }

  private static mapArgFields(
    argumentType: ClassMetadata,
    args: GraphQLFieldConfigArgumentMap = {},
  ) {
    const argumentInstance = new (argumentType.target as any)();
    argumentType.fields!.forEach(field => {
      field.typeOptions.defaultValue = this.getDefaultValue(
        argumentInstance,
        field.typeOptions,
        field.name,
        argumentType.name,
      );
      args[field.schemaName] = {
        description: field.description,
        type: this.getGraphQLInputType(field.name, field.getType(), field.typeOptions),
        defaultValue: field.typeOptions.defaultValue,
      };
    });
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
      const modelType = this.modelTypesInfo.find(it => {
        return it.type instanceof GraphQLObjectType && it.type.name === type;
      });
      if (modelType) {
        gqlType = modelType.type as GraphQLObjectType;
      }
    }
    if (!gqlType) {
      throw new Error(`Cannot determine GraphQL output type for ${typeOwnerName}`!);
    }

    return wrapWithTypeOptions(typeOwnerName, gqlType, typeOptions);
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
      const modelType = this.modelTypesInfo.find(it => {
        return it.type instanceof GraphQLInputObjectType && it.type.name === type;
      });
      if (modelType) {
        gqlType = modelType.type as GraphQLInputObjectType;
      }
    }
    if (!gqlType) {
      throw new Error(`Cannot determine GraphQL input type for ${typeOwnerName}`!);
    }

    return wrapWithTypeOptions(typeOwnerName, gqlType, typeOptions);
  }
}
