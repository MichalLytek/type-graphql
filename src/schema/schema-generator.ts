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
  GraphQLTypeResolver,
  GraphQLDirective,
  GraphQLFieldResolver,
} from "graphql";
import { withFilter, ResolverFn } from "graphql-subscriptions";

import { getMetadataStorage } from "../metadata/getMetadataStorage";
import {
  ResolverMetadata,
  ParamMetadata,
  ClassMetadata,
  SubscriptionResolverMetadata,
  FieldMetadata,
} from "../metadata/definitions";
import { TypeOptions, TypeValue } from "../decorators/types";
import { wrapWithTypeOptions, convertTypeIfScalar, getEnumValuesMap } from "../helpers/types";
import {
  createHandlerResolver,
  createAdvancedFieldResolver,
  createBasicFieldResolver,
  wrapResolverWithAuthChecker,
} from "../resolvers/create";
import { BuildContext, BuildContextOptions } from "./build-context";
import {
  UnionResolveTypeError,
  GeneratingSchemaError,
  MissingSubscriptionTopicsError,
  ConflictingDefaultValuesError,
  InterfaceResolveTypeError,
  CannotDetermineGraphQLTypeError,
} from "../errors";
import { ResolverFilterData, ResolverTopicData, TypeResolver } from "../interfaces";
import { getFieldMetadataFromInputType, getFieldMetadataFromObjectType } from "./utils";
import { ensureInstalledCorrectGraphQLPackage } from "../utils/graphql-version";
import {
  getFieldDefinitionNode,
  getInputObjectTypeDefinitionNode,
  getInputValueDefinitionNode,
  getInterfaceTypeDefinitionNode,
  getObjectTypeDefinitionNode,
} from "./definition-node";
import { ObjectClassMetadata } from "../metadata/definitions/object-class-metdata";
import { InterfaceClassMetadata } from "../metadata/definitions/interface-class-metadata";

interface AbstractInfo {
  isAbstract: boolean;
}
interface ObjectTypeInfo extends AbstractInfo {
  target: Function;
  type: GraphQLObjectType;
  metadata: ObjectClassMetadata;
}
interface InterfaceTypeInfo extends AbstractInfo {
  target: Function;
  type: GraphQLInterfaceType;
  metadata: InterfaceClassMetadata;
}
interface InputObjectTypeInfo extends AbstractInfo {
  target: Function;
  type: GraphQLInputObjectType;
}
interface EnumTypeInfo {
  enumObj: object;
  type: GraphQLEnumType;
}
interface UnionTypeInfo {
  unionSymbol: symbol;
  type: GraphQLUnionType;
}

export interface SchemaGeneratorOptions extends BuildContextOptions {
  /**
   * Array of resolvers classes
   */
  resolvers?: Function[];
  /**
   * Array of orphaned type classes that are not used explicitly in GraphQL types definitions
   */
  orphanedTypes?: Function[];
  /**
   * Disable checking on build the correctness of a schema
   */
  skipCheck?: boolean;
  /**
   * Array of graphql directives
   */
  directives?: GraphQLDirective[];
}

export abstract class SchemaGenerator {
  private static objectTypesInfo: ObjectTypeInfo[] = [];
  private static inputTypesInfo: InputObjectTypeInfo[] = [];
  private static interfaceTypesInfo: InterfaceTypeInfo[] = [];
  private static enumTypesInfo: EnumTypeInfo[] = [];
  private static unionTypesInfo: UnionTypeInfo[] = [];
  private static usedInterfaceTypes = new Set<Function>();

  static async generateFromMetadata(options: SchemaGeneratorOptions): Promise<GraphQLSchema> {
    const schema = this.generateFromMetadataSync(options);
    if (!options.skipCheck) {
      const { errors } = await graphql({ schema, source: getIntrospectionQuery() });
      if (errors) {
        throw new GeneratingSchemaError(errors);
      }
    }
    return schema;
  }

  static generateFromMetadataSync(options: SchemaGeneratorOptions): GraphQLSchema {
    this.checkForErrors(options);
    BuildContext.create(options);
    getMetadataStorage().build(options);
    this.buildTypesInfo(options.resolvers);

    const orphanedTypes = options.orphanedTypes || (options.resolvers ? [] : undefined);
    const prebuiltSchema = new GraphQLSchema({
      query: this.buildRootQueryType(options.resolvers),
      mutation: this.buildRootMutationType(options.resolvers),
      subscription: this.buildRootSubscriptionType(options.resolvers),
      directives: options.directives,
    });
    const finalSchema = new GraphQLSchema({
      ...prebuiltSchema.toConfig(),
      // run after first build to make `usedInterfaceTypes` working
      types: this.buildOtherTypes(orphanedTypes),
    });

    BuildContext.reset();
    this.usedInterfaceTypes = new Set<Function>();
    return finalSchema;
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
    const { disableInferringDefaultValues } = BuildContext;
    if (disableInferringDefaultValues) {
      return typeOptions.defaultValue;
    }

    const defaultValueFromInitializer = typeInstance[fieldName];
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

  private static buildTypesInfo(resolvers?: Function[]) {
    this.unionTypesInfo = getMetadataStorage().unions.map<UnionTypeInfo>(unionMetadata => {
      // use closure to capture values from this selected schema build
      const unionObjectTypesInfo: ObjectTypeInfo[] = [];
      // called once after building all `objectTypesInfo`
      const typesThunk = () => {
        unionObjectTypesInfo.push(
          ...unionMetadata
            .getClassTypes()
            .map(
              objectTypeCls => this.objectTypesInfo.find(type => type.target === objectTypeCls)!,
            ),
        );
        return unionObjectTypesInfo.map(it => it.type);
      };
      return {
        unionSymbol: unionMetadata.symbol,
        type: new GraphQLUnionType({
          name: unionMetadata.name,
          description: unionMetadata.description,
          types: typesThunk,
          resolveType: unionMetadata.resolveType
            ? this.getResolveTypeFunction(
                unionMetadata.resolveType,
                // use closure captured `unionObjectTypesInfo`
                unionObjectTypesInfo,
              )
            : instance => {
                const instanceTarget = unionMetadata
                  .getClassTypes()
                  .find(ObjectClassType => instance instanceof ObjectClassType);
                if (!instanceTarget) {
                  throw new UnionResolveTypeError(unionMetadata);
                }
                // use closure captured `unionObjectTypesInfo`
                const objectTypeInfo = unionObjectTypesInfo.find(
                  type => type.target === instanceTarget,
                );
                return objectTypeInfo?.type.name;
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
            const valueConfig = enumMetadata.valuesConfig[enumKey] || {};
            enumConfig[enumKey] = {
              value: enumMap[enumKey],
              description: valueConfig.description,
              deprecationReason: valueConfig.deprecationReason,
            };
            return enumConfig;
          }, {}),
        }),
      };
    });

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
        metadata: objectType,
        target: objectType.target,
        isAbstract: objectType.isAbstract || false,
        type: new GraphQLObjectType({
          name: objectType.name,
          description: objectType.description,
          astNode: getObjectTypeDefinitionNode(objectType.name, objectType.directives),
          extensions: objectType.extensions,
          interfaces: () => {
            let interfaces = interfaceClasses.map<GraphQLInterfaceType>(interfaceClass => {
              const interfaceTypeInfo = this.interfaceTypesInfo.find(
                info => info.target === interfaceClass,
              );
              if (!interfaceTypeInfo) {
                throw new Error(
                  `Cannot find interface type metadata for class '${interfaceClass.name}' ` +
                    `provided in 'implements' option for '${objectType.target.name}' object type class. ` +
                    `Please make sure that class is annotated with an '@InterfaceType()' decorator.`,
                );
              }
              return interfaceTypeInfo.type;
            });
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
            const fieldsMetadata: FieldMetadata[] = [];
            // support for implicitly implementing interfaces
            // get fields from interfaces definitions
            if (objectType.interfaceClasses) {
              const implementedInterfaces = getMetadataStorage().interfaceTypes.filter(it =>
                objectType.interfaceClasses!.includes(it.target),
              );
              implementedInterfaces.forEach(it => {
                fieldsMetadata.push(...(it.fields || []));
              });
            }
            // push own fields at the end to overwrite the one inherited from interface
            fieldsMetadata.push(...objectType.fields!);

            let fields = fieldsMetadata.reduce<GraphQLFieldConfigMap<any, any>>(
              (fieldsMap, field) => {
                const fieldResolvers = getMetadataStorage().fieldResolvers;
                const filteredFieldResolversMetadata = !resolvers
                  ? fieldResolvers
                  : fieldResolvers.filter(
                      it => it.kind === "internal" || resolvers.includes(it.target),
                    );
                const fieldResolverMetadata = filteredFieldResolversMetadata.find(
                  it =>
                    it.getObjectType!() === field.target &&
                    it.methodName === field.name &&
                    (it.resolverClassMetadata === undefined ||
                      it.resolverClassMetadata.isAbstract === false),
                );
                const type = this.getGraphQLOutputType(
                  field.target,
                  field.name,
                  field.getType(),
                  field.typeOptions,
                );
                const isSimpleResolver =
                  field.simple !== undefined
                    ? field.simple === true
                    : objectType.simpleResolvers !== undefined
                    ? objectType.simpleResolvers === true
                    : false;
                fieldsMap[field.schemaName] = {
                  type,
                  args: this.generateHandlerArgs(field.target, field.name, field.params!),
                  resolve: fieldResolverMetadata
                    ? createAdvancedFieldResolver(fieldResolverMetadata)
                    : isSimpleResolver
                    ? undefined
                    : createBasicFieldResolver(field),
                  description: field.description,
                  deprecationReason: field.deprecationReason,
                  astNode: getFieldDefinitionNode(field.name, type, field.directives),
                  extensions: {
                    complexity: field.complexity,
                    ...field.extensions,
                    ...fieldResolverMetadata?.extensions,
                  },
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
            return fields;
          },
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

        // fetch ahead the subset of object types that implements this interface
        const implementingObjectTypesTargets = getMetadataStorage()
          .objectTypes.filter(
            objectType =>
              objectType.interfaceClasses &&
              objectType.interfaceClasses.includes(interfaceType.target),
          )
          .map(objectType => objectType.target);
        const implementingObjectTypesInfo = this.objectTypesInfo.filter(objectTypesInfo =>
          implementingObjectTypesTargets.includes(objectTypesInfo.target),
        );

        return {
          metadata: interfaceType,
          target: interfaceType.target,
          isAbstract: interfaceType.isAbstract || false,
          type: new GraphQLInterfaceType({
            name: interfaceType.name,
            description: interfaceType.description,
            astNode: getInterfaceTypeDefinitionNode(interfaceType.name, interfaceType.directives),
            interfaces: () => {
              let interfaces = (interfaceType.interfaceClasses || []).map<GraphQLInterfaceType>(
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
              const fieldsMetadata: FieldMetadata[] = [];
              // support for implicitly implementing interfaces
              // get fields from interfaces definitions
              if (interfaceType.interfaceClasses) {
                const implementedInterfacesMetadata = getMetadataStorage().interfaceTypes.filter(
                  it => interfaceType.interfaceClasses!.includes(it.target),
                );
                implementedInterfacesMetadata.forEach(it => {
                  fieldsMetadata.push(...(it.fields || []));
                });
              }
              // push own fields at the end to overwrite the one inherited from interface
              fieldsMetadata.push(...interfaceType.fields!);

              let fields = fieldsMetadata!.reduce<GraphQLFieldConfigMap<any, any>>(
                (fieldsMap, field) => {
                  const fieldResolverMetadata = getMetadataStorage().fieldResolvers.find(
                    resolver =>
                      resolver.getObjectType!() === field.target &&
                      resolver.methodName === field.name &&
                      (resolver.resolverClassMetadata === undefined ||
                        resolver.resolverClassMetadata.isAbstract === false),
                  );
                  const type = this.getGraphQLOutputType(
                    field.target,
                    field.name,
                    field.getType(),
                    field.typeOptions,
                  );
                  fieldsMap[field.schemaName] = {
                    type,
                    args: this.generateHandlerArgs(field.target, field.name, field.params!),
                    resolve: fieldResolverMetadata
                      ? createAdvancedFieldResolver(fieldResolverMetadata)
                      : createBasicFieldResolver(field),
                    description: field.description,
                    deprecationReason: field.deprecationReason,
                    astNode: getFieldDefinitionNode(field.name, type, field.directives),
                    extensions: {
                      complexity: field.complexity,
                      ...field.extensions,
                    },
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
            resolveType: interfaceType.resolveType
              ? this.getResolveTypeFunction(interfaceType.resolveType, implementingObjectTypesInfo)
              : instance => {
                  const typeTarget = implementingObjectTypesTargets.find(
                    typeCls => instance instanceof typeCls,
                  );
                  if (!typeTarget) {
                    throw new InterfaceResolveTypeError(interfaceType);
                  }
                  const objectTypeInfo = implementingObjectTypesInfo.find(
                    type => type.target === typeTarget,
                  );
                  return objectTypeInfo?.type.name;
                },
          }),
        };
      },
    );

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
        isAbstract: inputType.isAbstract || false,
        type: new GraphQLInputObjectType({
          name: inputType.name,
          description: inputType.description,
          extensions: inputType.extensions,
          fields: () => {
            let fields = inputType.fields!.reduce<GraphQLInputFieldConfigMap>(
              (fieldsMap, field) => {
                const defaultValue = this.getDefaultValue(
                  inputInstance,
                  field.typeOptions,
                  field.name,
                  inputType.name,
                );

                const type = this.getGraphQLInputType(field.target, field.name, field.getType(), {
                  ...field.typeOptions,
                  defaultValue,
                });
                fieldsMap[field.name] = {
                  description: field.description,
                  type,
                  defaultValue,
                  astNode: getInputValueDefinitionNode(field.name, type, field.directives),
                  extensions: field.extensions,
                  deprecationReason: field.deprecationReason,
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
          astNode: getInputObjectTypeDefinitionNode(inputType.name, inputType.directives),
        }),
      };
    });
  }

  private static buildRootQueryType(resolvers?: Function[]): GraphQLObjectType {
    const queriesHandlers = this.filterHandlersByResolvers(getMetadataStorage().queries, resolvers);

    return new GraphQLObjectType({
      name: "Query",
      fields: this.generateHandlerFields(queriesHandlers),
    });
  }

  private static buildRootMutationType(resolvers?: Function[]): GraphQLObjectType | undefined {
    const mutationsHandlers = this.filterHandlersByResolvers(
      getMetadataStorage().mutations,
      resolvers,
    );
    if (mutationsHandlers.length === 0) {
      return;
    }

    return new GraphQLObjectType({
      name: "Mutation",
      fields: this.generateHandlerFields(mutationsHandlers),
    });
  }

  private static buildRootSubscriptionType(resolvers?: Function[]): GraphQLObjectType | undefined {
    const subscriptionsHandlers = this.filterHandlersByResolvers(
      getMetadataStorage().subscriptions,
      resolvers,
    );
    if (subscriptionsHandlers.length === 0) {
      return;
    }

    return new GraphQLObjectType({
      name: "Subscription",
      fields: this.generateSubscriptionsFields(subscriptionsHandlers),
    });
  }

  private static buildOtherTypes(orphanedTypes?: Function[]): GraphQLNamedType[] {
    const autoRegisteredObjectTypesInfo = this.objectTypesInfo.filter(typeInfo =>
      typeInfo.metadata.interfaceClasses?.some(interfaceClass => {
        const implementedInterfaceInfo = this.interfaceTypesInfo.find(
          it => it.target === interfaceClass,
        );
        if (!implementedInterfaceInfo) {
          return false;
        }
        if (implementedInterfaceInfo.metadata.autoRegisteringDisabled) {
          return false;
        }
        if (!this.usedInterfaceTypes.has(interfaceClass)) {
          return false;
        }
        return true;
      }),
    );
    return [
      ...this.filterTypesInfoByIsAbstractAndOrphanedTypesAndExtractType(
        this.objectTypesInfo,
        orphanedTypes,
      ),
      ...this.filterTypesInfoByIsAbstractAndOrphanedTypesAndExtractType(
        this.interfaceTypesInfo,
        orphanedTypes,
      ),
      ...this.filterTypesInfoByIsAbstractAndOrphanedTypesAndExtractType(
        this.inputTypesInfo,
        orphanedTypes,
      ),
      ...autoRegisteredObjectTypesInfo.map(typeInfo => typeInfo.type),
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
      const type = this.getGraphQLOutputType(
        handler.target,
        handler.methodName,
        handler.getReturnType(),
        handler.returnTypeOptions,
      );
      fields[handler.schemaName] = {
        type,
        args: this.generateHandlerArgs(handler.target, handler.methodName, handler.params!),
        resolve: createHandlerResolver(handler),
        description: handler.description,
        deprecationReason: handler.deprecationReason,
        astNode: getFieldDefinitionNode(handler.schemaName, type, handler.directives),
        extensions: {
          complexity: handler.complexity,
          ...handler.extensions,
        },
      };
      return fields;
    }, {});
  }

  private static generateSubscriptionsFields<T = any, U = any>(
    subscriptionsHandlers: SubscriptionResolverMetadata[],
  ): GraphQLFieldConfigMap<T, U> {
    const { pubSub, container } = BuildContext;
    const basicFields = this.generateHandlerFields(subscriptionsHandlers);
    return subscriptionsHandlers.reduce<GraphQLFieldConfigMap<T, U>>((fields, handler) => {
      // omit emitting abstract resolver fields
      if (handler.resolverClassMetadata && handler.resolverClassMetadata.isAbstract) {
        return fields;
      }

      let subscribeFn: GraphQLFieldResolver<T, U>;
      if (handler.subscribe) {
        subscribeFn = handler.subscribe;
      } else {
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
          const topics = handler.topics!;
          pubSubIterator = () => pubSub.asyncIterator(topics);
        }

        subscribeFn = handler.filter
          ? withFilter(pubSubIterator, (payload, args, context, info) => {
              const resolverFilterData: ResolverFilterData = { payload, args, context, info };
              return handler.filter!(resolverFilterData);
            })
          : pubSubIterator;
      }

      fields[handler.schemaName].subscribe = wrapResolverWithAuthChecker(
        subscribeFn,
        container,
        handler.roles,
      );
      return fields;
    }, basicFields);
  }

  private static generateHandlerArgs(
    target: Function,
    propertyName: string,
    params: ParamMetadata[],
  ): GraphQLFieldConfigArgumentMap {
    return params!.reduce<GraphQLFieldConfigArgumentMap>((args, param) => {
      if (param.kind === "arg") {
        args[param.name] = {
          description: param.description,
          type: this.getGraphQLInputType(
            target,
            propertyName,
            param.getType(),
            param.typeOptions,
            param.index,
            param.name,
          ),
          defaultValue: param.typeOptions.defaultValue,
          deprecationReason: param.deprecationReason,
        };
      } else if (param.kind === "args") {
        const argumentType = getMetadataStorage().argumentTypes.find(
          it => it.target === param.getType(),
        );
        if (!argumentType) {
          throw new Error(
            `The value used as a type of '@Args' for '${propertyName}' of '${target.name}' ` +
              `is not a class decorated with '@ArgsType' decorator!`,
          );
        }
        let superClass = Object.getPrototypeOf(argumentType.target);
        while (superClass.prototype !== undefined) {
          const superArgumentType = getMetadataStorage().argumentTypes.find(
            it => it.target === superClass,
          );
          if (superArgumentType) {
            this.mapArgFields(superArgumentType, args);
          }
          superClass = Object.getPrototypeOf(superClass);
        }
        this.mapArgFields(argumentType, args);
      }
      return args;
    }, {});
  }

  private static mapArgFields(
    argumentType: ClassMetadata,
    args: GraphQLFieldConfigArgumentMap = {},
  ) {
    const argumentInstance = new (argumentType.target as any)();
    argumentType.fields!.forEach(field => {
      const defaultValue = this.getDefaultValue(
        argumentInstance,
        field.typeOptions,
        field.name,
        argumentType.name,
      );
      args[field.schemaName] = {
        description: field.description,
        type: this.getGraphQLInputType(field.target, field.name, field.getType(), {
          ...field.typeOptions,
          defaultValue,
        }),
        defaultValue,
        deprecationReason: field.deprecationReason,
      };
    });
  }

  private static getGraphQLOutputType(
    target: Function,
    propertyName: string,
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
        this.usedInterfaceTypes.add(interfaceType.target);
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
      throw new CannotDetermineGraphQLTypeError("output", target.name, propertyName);
    }

    const { nullableByDefault } = BuildContext;
    return wrapWithTypeOptions(target, propertyName, gqlType, typeOptions, nullableByDefault);
  }

  private static getGraphQLInputType(
    target: Function,
    propertyName: string,
    type: TypeValue,
    typeOptions: TypeOptions = {},
    parameterIndex?: number,
    argName?: string,
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
      throw new CannotDetermineGraphQLTypeError(
        "input",
        target.name,
        propertyName,
        parameterIndex,
        argName,
      );
    }

    const { nullableByDefault } = BuildContext;
    return wrapWithTypeOptions(target, propertyName, gqlType, typeOptions, nullableByDefault);
  }

  private static getResolveTypeFunction<TSource = any, TContext = any>(
    resolveType: TypeResolver<TSource, TContext>,
    possibleObjectTypesInfo: ObjectTypeInfo[],
  ): GraphQLTypeResolver<TSource, TContext> {
    return async (...args) => {
      const resolvedType = await resolveType(...args);
      if (!resolvedType || typeof resolvedType === "string") {
        return resolvedType ?? undefined;
      }
      return possibleObjectTypesInfo.find(objectType => objectType.target === resolvedType)?.type
        .name;
    };
  }

  private static filterHandlersByResolvers<T extends ResolverMetadata>(
    handlers: T[],
    resolvers: Function[] | undefined,
  ) {
    return resolvers ? handlers.filter(query => resolvers.includes(query.target)) : handlers;
  }

  private static filterTypesInfoByIsAbstractAndOrphanedTypesAndExtractType(
    typesInfo: Array<ObjectTypeInfo | InterfaceTypeInfo | InputObjectTypeInfo>,
    orphanedTypes: Function[] | undefined,
  ) {
    return typesInfo
      .filter(it => !it.isAbstract && (!orphanedTypes || orphanedTypes.includes(it.target)))
      .map(it => it.type);
  }
}
