import { Repeater, filter, pipe } from "@graphql-yoga/subscription";
import {
  type GraphQLDirective,
  GraphQLEnumType,
  type GraphQLEnumValueConfigMap,
  type GraphQLFieldConfigArgumentMap,
  type GraphQLFieldConfigMap,
  type GraphQLFieldResolver,
  type GraphQLInputFieldConfigMap,
  GraphQLInputObjectType,
  type GraphQLInputType,
  GraphQLInterfaceType,
  type GraphQLNamedType,
  GraphQLObjectType,
  type GraphQLOutputType,
  GraphQLSchema,
  type GraphQLTypeResolver,
  GraphQLUnionType,
  getIntrospectionQuery,
  graphqlSync,
} from "graphql";
import { type TypeOptions, type TypeValue } from "@/decorators/types";
import {
  CannotDetermineGraphQLTypeError,
  ConflictingDefaultValuesError,
  GeneratingSchemaError,
  InterfaceResolveTypeError,
  MissingPubSubError,
  MissingSubscriptionTopicsError,
  UnionResolveTypeError,
} from "@/errors";
import { convertTypeIfScalar, getEnumValuesMap, wrapWithTypeOptions } from "@/helpers/types";
import {
  type ClassMetadata,
  type FieldMetadata,
  type ParamMetadata,
  type ResolverMetadata,
  type SubscriptionResolverMetadata,
} from "@/metadata/definitions";
import { type InterfaceClassMetadata } from "@/metadata/definitions/interface-class-metadata";
import { type ObjectClassMetadata } from "@/metadata/definitions/object-class-metadata";
import { getMetadataStorage } from "@/metadata/getMetadataStorage";
import { type MetadataStorage } from "@/metadata/metadata-storage";
import {
  createAdvancedFieldResolver,
  createBasicFieldResolver,
  createHandlerResolver,
  wrapResolverWithAuthChecker,
} from "@/resolvers/create";
import {
  type MaybePromise,
  type SubscribeResolverData,
  type SubscriptionHandlerData,
  type TypeResolver,
} from "@/typings";
import { ensureInstalledCorrectGraphQLPackage } from "@/utils/graphql-version";
import { BuildContext, type BuildContextOptions } from "./build-context";
import {
  getFieldDefinitionNode,
  getInputObjectTypeDefinitionNode,
  getInputValueDefinitionNode,
  getInterfaceTypeDefinitionNode,
  getObjectTypeDefinitionNode,
} from "./definition-node";
import { getFieldMetadataFromInputType, getFieldMetadataFromObjectType } from "./utils";

interface ObjectTypeInfo {
  target: Function;
  type: GraphQLObjectType;
  metadata: ObjectClassMetadata;
}
interface InterfaceTypeInfo {
  target: Function;
  type: GraphQLInterfaceType;
  metadata: InterfaceClassMetadata;
}
interface InputObjectTypeInfo {
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

export type SchemaGeneratorOptions = {
  /**
   * Array of resolvers classes
   */
  resolvers: Function[];
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
} & BuildContextOptions;

export abstract class SchemaGenerator {
  private static objectTypesInfoMap = new Map<Function, ObjectTypeInfo>();

  private static inputTypesInfoMap = new Map<Function, InputObjectTypeInfo>();

  private static interfaceTypesInfoMap = new Map<Function, InterfaceTypeInfo>();

  private static enumTypesInfoMap = new Map<object, EnumTypeInfo>();

  private static unionTypesInfoMap = new Map<symbol, UnionTypeInfo>();

  private static usedInterfaceTypes = new Set<Function>();

  private static metadataStorage: MetadataStorage;

  static generateFromMetadata(options: SchemaGeneratorOptions): GraphQLSchema {
    this.metadataStorage = getMetadataStorage().clone();
    this.metadataStorage.build(options);

    this.checkForErrors(options);
    BuildContext.create(options);

    this.buildTypesInfo(options.resolvers);

    const orphanedTypes = options.orphanedTypes ?? [];
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

    // cleanup after build to prevent memory leaks
    // and to reset state for next possible builds
    BuildContext.reset();
    this.usedInterfaceTypes = new Set<Function>();
    this.objectTypesInfoMap = new Map<Function, ObjectTypeInfo>();
    this.inputTypesInfoMap = new Map<Function, InputObjectTypeInfo>();
    this.interfaceTypesInfoMap = new Map<Function, InterfaceTypeInfo>();
    this.enumTypesInfoMap = new Map<object, EnumTypeInfo>();
    this.unionTypesInfoMap = new Map<symbol, UnionTypeInfo>();

    if (!options.skipCheck) {
      const { errors } = graphqlSync({ schema: finalSchema, source: getIntrospectionQuery() });
      if (errors) {
        throw new GeneratingSchemaError(errors);
      }
    }

    return finalSchema;
  }

  private static checkForErrors(options: SchemaGeneratorOptions) {
    ensureInstalledCorrectGraphQLPackage();
    if (this.metadataStorage.authorizedFields.length !== 0 && options.authChecker === undefined) {
      throw new Error(
        "You need to provide `authChecker` function for `@Authorized` decorator usage!",
      );
    }
  }

  private static getDefaultValue(
    typeInstance: Record<string, unknown>,
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

  private static buildTypesInfo(resolvers: Function[]) {
    this.unionTypesInfoMap = new Map<symbol, UnionTypeInfo>(
      this.metadataStorage.unions.map(unionMetadata => {
        // use closure to capture values from this selected schema build
        const unionObjectTypesInfo: ObjectTypeInfo[] = [];
        // called once after building all `objectTypesInfo`
        const typesThunk = () => {
          unionObjectTypesInfo.push(
            ...unionMetadata
              .getClassTypes()
              .map(objectTypeCls => this.objectTypesInfoMap.get(objectTypeCls)!),
          );
          return unionObjectTypesInfo.map(it => it.type);
        };
        const unionTypeInfo: UnionTypeInfo = {
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

        return [unionMetadata.symbol, unionTypeInfo];
      }),
    );

    this.enumTypesInfoMap = new Map<object, EnumTypeInfo>(
      this.metadataStorage.enums.map(enumMetadata => {
        const enumMap = getEnumValuesMap(enumMetadata.enumObj);
        const enumTypeInfo: EnumTypeInfo = {
          enumObj: enumMetadata.enumObj,
          type: new GraphQLEnumType({
            name: enumMetadata.name,
            description: enumMetadata.description,
            values: Object.keys(enumMap).reduce<GraphQLEnumValueConfigMap>(
              (enumConfig, enumKey) => {
                const valueConfig = enumMetadata.valuesConfig[enumKey] || {};
                // eslint-disable-next-line no-param-reassign
                enumConfig[enumKey] = {
                  value: enumMap[enumKey],
                  description: valueConfig.description,
                  deprecationReason: valueConfig.deprecationReason,
                };
                return enumConfig;
              },
              {},
            ),
          }),
        };

        return [enumMetadata.enumObj, enumTypeInfo];
      }),
    );

    this.objectTypesInfoMap = new Map<Function, ObjectTypeInfo>(
      this.metadataStorage.objectTypes.map(objectType => {
        const objectSuperClass = Object.getPrototypeOf(objectType.target);
        const hasExtended = objectSuperClass.prototype !== undefined;
        const getSuperClassType = () => {
          const superClassTypeInfo =
            this.objectTypesInfoMap.get(objectSuperClass) ??
            this.interfaceTypesInfoMap.get(objectSuperClass);
          return superClassTypeInfo ? superClassTypeInfo.type : undefined;
        };
        const interfaceClasses = objectType.interfaceClasses || [];
        const objectTypeInfo: ObjectTypeInfo = {
          metadata: objectType,
          target: objectType.target,
          type: new GraphQLObjectType({
            name: objectType.name,
            description: objectType.description,
            astNode: getObjectTypeDefinitionNode(objectType.name, objectType.directives),
            extensions: objectType.extensions,
            interfaces: () => {
              let interfaces = interfaceClasses.map<GraphQLInterfaceType>(interfaceClass => {
                const interfaceTypeInfo = this.interfaceTypesInfoMap.get(interfaceClass);
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
                const implementedInterfaces = this.metadataStorage.interfaceTypes.filter(it =>
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
                  const { fieldResolvers } = this.metadataStorage;
                  const filteredFieldResolversMetadata = fieldResolvers.filter(
                    it => it.kind === "internal" || resolvers.includes(it.target),
                  );
                  const fieldResolverMetadata = filteredFieldResolversMetadata.find(
                    it => it.getObjectType!() === field.target && it.methodName === field.name,
                  );
                  const type = this.getGraphQLOutputType(
                    field.target,
                    field.name,
                    field.getType(),
                    field.typeOptions,
                  );
                  const isSimpleResolver =
                    // eslint-disable-next-line no-nested-ternary
                    field.simple !== undefined
                      ? field.simple === true
                      : objectType.simpleResolvers !== undefined
                        ? objectType.simpleResolvers === true
                        : false;
                  // eslint-disable-next-line no-param-reassign
                  fieldsMap[field.schemaName] = {
                    type,
                    args: this.generateHandlerArgs(field.target, field.name, field.params!),
                    // eslint-disable-next-line no-nested-ternary
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
                  fields = { ...superClassFields, ...fields };
                }
              }
              return fields;
            },
          }),
        };

        return [objectType.target, objectTypeInfo];
      }),
    );

    this.interfaceTypesInfoMap = new Map<Function, InterfaceTypeInfo>(
      this.metadataStorage.interfaceTypes.map(interfaceType => {
        const interfaceSuperClass = Object.getPrototypeOf(interfaceType.target);
        const hasExtended = interfaceSuperClass.prototype !== undefined;
        const getSuperClassType = () => {
          const superClassTypeInfo = this.interfaceTypesInfoMap.get(interfaceSuperClass);
          return superClassTypeInfo ? superClassTypeInfo.type : undefined;
        };

        // fetch ahead the subset of object types that implements this interface
        const implementingObjectTypesTargets = this.metadataStorage.objectTypes
          .filter(
            objectType =>
              objectType.interfaceClasses &&
              objectType.interfaceClasses.includes(interfaceType.target),
          )
          .map(objectType => objectType.target);
        const implementingObjectTypesInfo = [...this.objectTypesInfoMap.values()].filter(
          objectTypesInfo => implementingObjectTypesTargets.includes(objectTypesInfo.target),
        );

        const interfaceTypeInfo: InterfaceTypeInfo = {
          metadata: interfaceType,
          target: interfaceType.target,
          type: new GraphQLInterfaceType({
            name: interfaceType.name,
            description: interfaceType.description,
            astNode: getInterfaceTypeDefinitionNode(interfaceType.name, interfaceType.directives),
            extensions: interfaceType.extensions,
            interfaces: () => {
              let interfaces = (interfaceType.interfaceClasses || []).map<GraphQLInterfaceType>(
                interfaceClass => this.interfaceTypesInfoMap.get(interfaceClass)!.type,
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
                const implementedInterfacesMetadata = this.metadataStorage.interfaceTypes.filter(
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
                  const fieldResolverMetadata = this.metadataStorage.fieldResolvers.find(
                    resolver =>
                      resolver.getObjectType!() === field.target &&
                      resolver.methodName === field.name,
                  );
                  const type = this.getGraphQLOutputType(
                    field.target,
                    field.name,
                    field.getType(),
                    field.typeOptions,
                  );
                  // eslint-disable-next-line no-param-reassign
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
                  fields = { ...superClassFields, ...fields };
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

        return [interfaceType.target, interfaceTypeInfo];
      }),
    );

    this.inputTypesInfoMap = new Map<Function, InputObjectTypeInfo>(
      this.metadataStorage.inputTypes.map(inputType => {
        const objectSuperClass = Object.getPrototypeOf(inputType.target);
        const getSuperClassType = () => {
          const superClassTypeInfo = this.inputTypesInfoMap.get(objectSuperClass);
          return superClassTypeInfo ? superClassTypeInfo.type : undefined;
        };
        const inputInstance = new (inputType.target as any)();
        const inputTypeInfo: InputObjectTypeInfo = {
          target: inputType.target,
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
                  // eslint-disable-next-line no-param-reassign
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
                  fields = { ...superClassFields, ...fields };
                }
              }
              return fields;
            },
            astNode: getInputObjectTypeDefinitionNode(inputType.name, inputType.directives),
          }),
        };

        return [inputType.target, inputTypeInfo];
      }),
    );
  }

  private static buildRootQueryType(resolvers: Function[]): GraphQLObjectType {
    const queriesHandlers = this.filterHandlersByResolvers(this.metadataStorage.queries, resolvers);

    return new GraphQLObjectType({
      name: "Query",
      fields: this.generateHandlerFields(queriesHandlers),
    });
  }

  private static buildRootMutationType(resolvers: Function[]): GraphQLObjectType | undefined {
    const mutationsHandlers = this.filterHandlersByResolvers(
      this.metadataStorage.mutations,
      resolvers,
    );
    if (mutationsHandlers.length === 0) {
      return undefined;
    }

    return new GraphQLObjectType({
      name: "Mutation",
      fields: this.generateHandlerFields(mutationsHandlers),
    });
  }

  private static buildRootSubscriptionType(resolvers: Function[]): GraphQLObjectType | undefined {
    const subscriptionsHandlers = this.filterHandlersByResolvers(
      this.metadataStorage.subscriptions,
      resolvers,
    );
    if (subscriptionsHandlers.length === 0) {
      return undefined;
    }

    return new GraphQLObjectType({
      name: "Subscription",
      fields: this.generateSubscriptionsFields(subscriptionsHandlers),
    });
  }

  private static buildOtherTypes(orphanedTypes: Function[]): GraphQLNamedType[] {
    const autoRegisteredObjectTypesInfo = [...this.objectTypesInfoMap.values()].filter(typeInfo =>
      typeInfo.metadata.interfaceClasses?.some(interfaceClass => {
        const implementedInterfaceInfo = this.interfaceTypesInfoMap.get(interfaceClass);
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
      ...this.filterTypesInfoByOrphanedTypesAndExtractType(
        [...this.objectTypesInfoMap.values()],
        orphanedTypes,
      ),
      ...this.filterTypesInfoByOrphanedTypesAndExtractType(
        [...this.interfaceTypesInfoMap.values()],
        orphanedTypes,
      ),
      ...this.filterTypesInfoByOrphanedTypesAndExtractType(
        [...this.inputTypesInfoMap.values()],
        orphanedTypes,
      ),
      ...autoRegisteredObjectTypesInfo.map(typeInfo => typeInfo.type),
    ];
  }

  private static generateHandlerFields<T = any, U = any>(
    handlers: ResolverMetadata[],
  ): GraphQLFieldConfigMap<T, U> {
    return handlers.reduce<GraphQLFieldConfigMap<T, U>>((fields, handler) => {
      const type = this.getGraphQLOutputType(
        handler.target,
        handler.methodName,
        handler.getReturnType(),
        handler.returnTypeOptions,
      );
      // eslint-disable-next-line no-param-reassign
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

  private static generateSubscriptionsFields<
    TSource extends object = any,
    TContext extends object = any,
  >(
    subscriptionsHandlers: SubscriptionResolverMetadata[],
  ): GraphQLFieldConfigMap<TSource, TContext> {
    if (!subscriptionsHandlers.length) {
      return {};
    }
    const { pubSub, container } = BuildContext;
    if (!pubSub) {
      throw new MissingPubSubError();
    }
    const basicFields = this.generateHandlerFields(subscriptionsHandlers);
    return subscriptionsHandlers.reduce<GraphQLFieldConfigMap<TSource, TContext>>(
      (fields, handler) => {
        let subscribeFn: GraphQLFieldResolver<
          TSource,
          TContext,
          any,
          MaybePromise<AsyncIterable<unknown>>
        >;
        if (handler.subscribe) {
          subscribeFn = (source, args, context, info) => {
            const subscribeResolverData: SubscribeResolverData = { source, args, context, info };
            return handler.subscribe!(subscribeResolverData);
          };
        } else {
          subscribeFn = (source, args, context, info) => {
            const subscribeResolverData: SubscribeResolverData = { source, args, context, info };

            let topics: string | string[];
            if (typeof handler.topics === "function") {
              const getTopics = handler.topics;
              topics = getTopics(subscribeResolverData);
            } else {
              topics = handler.topics!;
            }
            const topicId = handler.topicId?.(subscribeResolverData);

            let pubSubIterable: AsyncIterable<any>;
            if (!Array.isArray(topics)) {
              pubSubIterable = pubSub.subscribe(topics, topicId);
            } else {
              if (topics.length === 0) {
                throw new MissingSubscriptionTopicsError(handler.target, handler.methodName);
              }
              pubSubIterable = Repeater.merge([
                ...topics.map(topic => pubSub.subscribe(topic, topicId)),
              ]);
            }

            if (!handler.filter) {
              return pubSubIterable;
            }

            return pipe(
              pubSubIterable,
              filter(payload => {
                const handlerData: SubscriptionHandlerData = { payload, args, context, info };
                return handler.filter!(handlerData);
              }),
            );
          };
        }

        // eslint-disable-next-line no-param-reassign
        fields[handler.schemaName].subscribe = wrapResolverWithAuthChecker(
          subscribeFn,
          container,
          handler.roles,
        );
        return fields;
      },
      basicFields,
    );
  }

  private static generateHandlerArgs(
    target: Function,
    propertyName: string,
    params: ParamMetadata[],
  ): GraphQLFieldConfigArgumentMap {
    return params!.reduce<GraphQLFieldConfigArgumentMap>((args, param) => {
      if (param.kind === "arg" || (param.kind === "custom" && param.options?.arg)) {
        const input = param.kind === "arg" ? param : param.options.arg!;

        const type = this.getGraphQLInputType(
          target,
          propertyName,
          input.getType(),
          input.typeOptions,
          input.index,
          input.name,
        );
        const argDirectives = this.metadataStorage.argumentDirectives
          .filter(
            it =>
              it.target === target &&
              it.fieldName === propertyName &&
              it.parameterIndex === param.index,
          )
          .map(it => it.directive);
        // eslint-disable-next-line no-param-reassign
        args[input.name] = {
          description: input.description,
          type,
          defaultValue: input.typeOptions.defaultValue,
          deprecationReason: input.deprecationReason,
          astNode: getInputValueDefinitionNode(input.name, type, argDirectives),
        };
      } else if (param.kind === "args") {
        const argumentType = this.metadataStorage.argumentTypes.find(
          it => it.target === param.getType(),
        );
        if (!argumentType) {
          throw new Error(
            `The value used as a type of '@Args' for '${propertyName}' of '${target.name}' ` +
              `is not a class decorated with '@ArgsType' decorator!`,
          );
        }

        const inheritanceChainClasses: Function[] = [argumentType.target];
        for (
          let superClass = argumentType.target;
          superClass.prototype !== undefined;
          superClass = Object.getPrototypeOf(superClass)
        ) {
          inheritanceChainClasses.push(superClass);
        }
        for (const argsTypeClass of inheritanceChainClasses.reverse()) {
          const inheritedArgumentType = this.metadataStorage.argumentTypes.find(
            it => it.target === argsTypeClass,
          );
          if (inheritedArgumentType) {
            this.mapArgFields(inheritedArgumentType, args);
          }
        }
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
      const type = this.getGraphQLInputType(field.target, field.name, field.getType(), {
        ...field.typeOptions,
        defaultValue,
      });
      // eslint-disable-next-line no-param-reassign
      args[field.schemaName] = {
        description: field.description,
        type,
        defaultValue,
        astNode: getInputValueDefinitionNode(field.name, type, field.directives),
        extensions: field.extensions,
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
      const objectType = this.objectTypesInfoMap.get(type as Function);
      if (objectType) {
        gqlType = objectType.type;
      }
    }
    if (!gqlType) {
      const interfaceType = this.interfaceTypesInfoMap.get(type as Function);
      if (interfaceType) {
        this.usedInterfaceTypes.add(interfaceType.target);
        gqlType = interfaceType.type;
      }
    }
    if (!gqlType) {
      const enumType = this.enumTypesInfoMap.get(type as object);
      if (enumType) {
        gqlType = enumType.type;
      }
    }
    if (!gqlType) {
      const unionType = this.unionTypesInfoMap.get(type as symbol);
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
      const inputType = this.inputTypesInfoMap.get(type as Function);
      if (inputType) {
        gqlType = inputType.type;
      }
    }
    if (!gqlType) {
      const enumType = this.enumTypesInfoMap.get(type as object);
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
    resolvers: Function[],
  ) {
    return handlers.filter(query => resolvers.includes(query.target));
  }

  private static filterTypesInfoByOrphanedTypesAndExtractType(
    typesInfo: Array<ObjectTypeInfo | InterfaceTypeInfo | InputObjectTypeInfo>,
    orphanedTypes: Function[],
  ) {
    return typesInfo.filter(it => orphanedTypes.includes(it.target)).map(it => it.type);
  }
}
