/* eslint-disable no-param-reassign */
import { NoExplicitTypeError } from "@/errors";
import { type SchemaGeneratorOptions } from "@/schema/schema-generator";
import { type ClassType } from "@/typings";
import {
  type AuthorizedClassMetadata,
  type AuthorizedMetadata,
  type BaseResolverMetadata,
  type ClassMetadata,
  type EnumMetadata,
  type ExtensionsClassMetadata,
  type ExtensionsFieldMetadata,
  type ExtensionsMetadata,
  type FieldMetadata,
  type FieldResolverMetadata,
  type MiddlewareMetadata,
  type ParamMetadata,
  type ResolverClassMetadata,
  type ResolverMetadata,
  type ResolverMiddlewareMetadata,
  type SubscriptionResolverMetadata,
  type UnionMetadata,
  type UnionMetadataWithSymbol,
} from "./definitions";
import {
  type DirectiveArgumentMetadata,
  type DirectiveClassMetadata,
  type DirectiveFieldMetadata,
} from "./definitions/directive-metadata";
import { type InterfaceClassMetadata } from "./definitions/interface-class-metadata";
import { type ObjectClassMetadata } from "./definitions/object-class-metadata";
import {
  mapMiddlewareMetadataToArray,
  mapSuperFieldResolverHandlers,
  mapSuperResolverHandlers,
} from "./utils";

export class MetadataStorage {
  queries: ResolverMetadata[] = [];

  mutations: ResolverMetadata[] = [];

  subscriptions: SubscriptionResolverMetadata[] = [];

  fieldResolvers: FieldResolverMetadata[] = [];

  objectTypes: ObjectClassMetadata[] = [];

  objectTypesCache = new Map<Function, ObjectClassMetadata>();

  inputTypes: ClassMetadata[] = [];

  argumentTypes: ClassMetadata[] = [];

  interfaceTypes: InterfaceClassMetadata[] = [];

  interfaceTypesCache = new Map<Function, InterfaceClassMetadata>();

  authorizedFields: AuthorizedMetadata[] = [];

  authorizedFieldsByTargetAndFieldCache = new Map<Function, Map<string, AuthorizedMetadata>>();

  authorizedResolver: AuthorizedClassMetadata[] = [];

  authorizedResolverByTargetCache = new Map<Function, AuthorizedClassMetadata>();

  enums: EnumMetadata[] = [];

  unions: UnionMetadataWithSymbol[] = [];

  middlewares: MiddlewareMetadata[] = [];

  middlewaresByTargetAndFieldCache = new Map<Function, Map<string, Set<MiddlewareMetadata>>>();

  resolverMiddlewares: ResolverMiddlewareMetadata[] = [];

  resolverMiddlewaresByTargetCache = new Map<Function, Set<ResolverMiddlewareMetadata>>();

  classDirectives: DirectiveClassMetadata[] = [];

  classDirectivesByTargetCache = new Map<Function, DirectiveClassMetadata[]>();

  fieldDirectives: DirectiveFieldMetadata[] = [];

  fieldDirectivesByTargetAndFieldCache = new Map<Function, Map<string, DirectiveFieldMetadata[]>>();

  argumentDirectives: DirectiveArgumentMetadata[] = [];

  classExtensions: ExtensionsClassMetadata[] = [];

  fieldExtensions: ExtensionsFieldMetadata[] = [];

  resolverClasses: ResolverClassMetadata[] = [];

  resolverClassesCache = new Map<Function, ResolverClassMetadata>();

  fields: FieldMetadata[] = [];

  fieldsCache = new Map<Function, FieldMetadata[]>();

  params: ParamMetadata[] = [];

  paramsCache = new Map<Function, Map<string, ParamMetadata[]>>();

  collectQueryHandlerMetadata(definition: ResolverMetadata) {
    this.queries.push(definition);
  }

  collectMutationHandlerMetadata(definition: ResolverMetadata) {
    this.mutations.push(definition);
  }

  collectSubscriptionHandlerMetadata(definition: SubscriptionResolverMetadata) {
    this.subscriptions.push(definition);
  }

  collectFieldResolverMetadata(definition: FieldResolverMetadata) {
    this.fieldResolvers.push(definition);
  }

  collectObjectMetadata(definition: ObjectClassMetadata) {
    this.objectTypes.push(definition);
  }

  collectInputMetadata(definition: ClassMetadata) {
    this.inputTypes.push(definition);
  }

  collectArgsMetadata(definition: ClassMetadata) {
    this.argumentTypes.push(definition);
  }

  collectInterfaceMetadata(definition: InterfaceClassMetadata) {
    this.interfaceTypes.push(definition);
  }

  collectAuthorizedFieldMetadata(definition: AuthorizedMetadata) {
    this.authorizedFields.push(definition);
  }

  collectAuthorizedResolverMetadata(definition: AuthorizedClassMetadata) {
    this.authorizedResolver.push(definition);
  }

  collectEnumMetadata(definition: EnumMetadata) {
    this.enums.push(definition);
  }

  collectUnionMetadata(definition: UnionMetadata) {
    const unionSymbol = Symbol(definition.name);
    this.unions.push({
      ...definition,
      symbol: unionSymbol,
    });
    return unionSymbol;
  }

  collectMiddlewareMetadata(definition: MiddlewareMetadata) {
    this.middlewares.push(definition);
  }

  collectResolverMiddlewareMetadata(definition: ResolverMiddlewareMetadata) {
    this.resolverMiddlewares.push(definition);
  }

  collectResolverClassMetadata(definition: ResolverClassMetadata) {
    this.resolverClasses.push(definition);
  }

  collectClassFieldMetadata(definition: FieldMetadata) {
    this.fields.push(definition);
  }

  collectHandlerParamMetadata(definition: ParamMetadata) {
    this.params.push(definition);
  }

  collectDirectiveClassMetadata(definition: DirectiveClassMetadata) {
    this.classDirectives.push(definition);
  }

  collectDirectiveFieldMetadata(definition: DirectiveFieldMetadata) {
    this.fieldDirectives.push(definition);
  }

  collectDirectiveArgumentMetadata(definition: DirectiveArgumentMetadata) {
    this.argumentDirectives.push(definition);
  }

  collectExtensionsClassMetadata(definition: ExtensionsClassMetadata) {
    this.classExtensions.push(definition);
  }

  collectExtensionsFieldMetadata(definition: ExtensionsFieldMetadata) {
    this.fieldExtensions.push(definition);
  }

  initCache() {
    this.clearMapCaches();

    if (this.resolverClasses?.length) {
      this.resolverClasses.forEach(resolverClass => {
        if (!this.resolverClassesCache.has(resolverClass.target)) {
          this.resolverClassesCache.set(resolverClass.target, resolverClass);
        }
      });
    }

    if (this.params?.length) {
      this.params.forEach(param => {
        if (!this.paramsCache.has(param.target)) {
          this.paramsCache.set(param.target, new Map());
        }
        if (!this.paramsCache.get(param.target)!.has(param.methodName)) {
          this.paramsCache.get(param.target)!.set(param.methodName, []);
        }
        this.paramsCache.get(param.target)!.get(param.methodName)!.push(param);
      });
    }

    if (this.middlewares?.length) {
      this.middlewares.forEach(middleware => {
        if (!this.middlewaresByTargetAndFieldCache.has(middleware.target)) {
          this.middlewaresByTargetAndFieldCache.set(middleware.target, new Map());
        }

        if (
          !this.middlewaresByTargetAndFieldCache.get(middleware.target)!.has(middleware.fieldName)
        ) {
          this.middlewaresByTargetAndFieldCache
            .get(middleware.target)!
            .set(middleware.fieldName, new Set());
        }

        if (
          !this.middlewaresByTargetAndFieldCache
            .get(middleware.target)!
            .get(middleware.fieldName)!
            .has(middleware)
        ) {
          this.middlewaresByTargetAndFieldCache
            .get(middleware.target)!
            .get(middleware.fieldName)!
            .add(middleware);
        }
      });
    }

    if (this.resolverMiddlewares?.length) {
      this.resolverMiddlewares.forEach(middleware => {
        const key = middleware.target;
        if (!this.resolverMiddlewaresByTargetCache.has(key)) {
          this.resolverMiddlewaresByTargetCache.set(key, new Set());
        }

        if (!this.resolverMiddlewaresByTargetCache.get(key)!.has(middleware)) {
          this.resolverMiddlewaresByTargetCache.get(key)!.add(middleware);
        }
      });
    }

    if (this.fieldDirectives?.length) {
      this.fieldDirectives.forEach(directive => {
        if (!this.fieldDirectivesByTargetAndFieldCache.has(directive.target)) {
          this.fieldDirectivesByTargetAndFieldCache.set(directive.target, new Map());
        }
        if (
          !this.fieldDirectivesByTargetAndFieldCache.get(directive.target)!.has(directive.fieldName)
        ) {
          this.fieldDirectivesByTargetAndFieldCache
            .get(directive.target)!
            .set(directive.fieldName, []);
        }
        this.fieldDirectivesByTargetAndFieldCache
          .get(directive.target)!
          .get(directive.fieldName)!
          .push(directive);
      });
    }

    if (this.classDirectives?.length) {
      this.classDirectives.forEach(directive => {
        const key = directive.target;
        if (!this.classDirectivesByTargetCache.has(key)) {
          this.classDirectivesByTargetCache.set(key, []);
        }
        this.classDirectivesByTargetCache.get(key)!.push(directive);
      });
    }

    if (this.authorizedFields?.length) {
      this.authorizedFields.forEach(field => {
        if (!this.authorizedFieldsByTargetAndFieldCache.has(field.target)) {
          this.authorizedFieldsByTargetAndFieldCache.set(field.target, new Map());
        }
        if (!this.authorizedFieldsByTargetAndFieldCache.get(field.target)!.has(field.fieldName)) {
          this.authorizedFieldsByTargetAndFieldCache.get(field.target)!.set(field.fieldName, field);
        }
      });
    }

    if (this.authorizedResolver?.length) {
      this.authorizedResolver.forEach(resolver => {
        const key = resolver.target;
        if (!this.authorizedResolverByTargetCache.has(key)) {
          this.authorizedResolverByTargetCache.set(key, resolver);
        }
      });
    }

    if (this.fields?.length) {
      this.fields.forEach(field => {
        if (!this.fieldsCache.has(field.target)) {
          this.fieldsCache.set(field.target, []);
        }
        this.fieldsCache.get(field.target)!.push(field);
      });
    }

    if (this.objectTypes?.length) {
      this.objectTypes.forEach(objType => {
        this.objectTypesCache.set(objType.target, objType);
      });
    }

    if (this.interfaceTypes?.length) {
      this.interfaceTypes.forEach(interfaceType => {
        this.interfaceTypesCache.set(interfaceType.target, interfaceType);
      });
    }
  }

  build(options: SchemaGeneratorOptions) {
    this.classDirectives.reverse();
    this.fieldDirectives.reverse();
    this.argumentDirectives.reverse();
    this.classExtensions.reverse();
    this.fieldExtensions.reverse();

    this.initCache();

    this.buildClassMetadata(this.objectTypes);
    this.buildClassMetadata(this.inputTypes);
    this.buildClassMetadata(this.argumentTypes);
    this.buildClassMetadata(this.interfaceTypes);

    this.buildFieldResolverMetadata(this.fieldResolvers, options);

    this.buildResolversMetadata(this.queries);
    this.buildResolversMetadata(this.mutations);
    this.buildResolversMetadata(this.subscriptions);

    this.buildExtendedResolversMetadata();
  }

  clear() {
    this.queries = [];
    this.mutations = [];
    this.subscriptions = [];
    this.fieldResolvers = [];
    this.objectTypes = [];
    this.inputTypes = [];
    this.argumentTypes = [];
    this.interfaceTypes = [];
    this.authorizedFields = [];
    this.authorizedResolver = [];
    this.enums = [];
    this.unions = [];
    this.middlewares = [];
    this.resolverMiddlewares = [];
    this.classDirectives = [];
    this.fieldDirectives = [];
    this.argumentDirectives = [];
    this.classExtensions = [];
    this.fieldExtensions = [];
    this.resolverClasses = [];
    this.fields = [];
    this.params = [];

    this.clearMapCaches();
  }

  clone() {
    const cloned = new MetadataStorage();

    // arrays are cloned to prevent mutation of original metadata storage when building schema
    cloned.queries = [...this.queries];
    cloned.mutations = [...this.mutations];
    cloned.subscriptions = [...this.subscriptions];
    cloned.fieldResolvers = [...this.fieldResolvers];
    cloned.objectTypes = [...this.objectTypes];
    cloned.inputTypes = [...this.inputTypes];
    cloned.argumentTypes = [...this.argumentTypes];
    cloned.interfaceTypes = [...this.interfaceTypes];
    cloned.authorizedFields = [...this.authorizedFields];
    cloned.authorizedResolver = [...this.authorizedResolver];
    cloned.enums = [...this.enums];
    cloned.unions = [...this.unions];
    cloned.middlewares = [...this.middlewares];
    cloned.resolverMiddlewares = [...this.resolverMiddlewares];
    cloned.classDirectives = [...this.classDirectives];
    cloned.fieldDirectives = [...this.fieldDirectives];
    cloned.argumentDirectives = [...this.argumentDirectives];
    cloned.classExtensions = [...this.classExtensions];
    cloned.fieldExtensions = [...this.fieldExtensions];
    cloned.resolverClasses = [...this.resolverClasses];
    cloned.fields = [...this.fields];
    cloned.params = [...this.params];

    return cloned;
  }

  private clearMapCaches() {
    this.fieldsCache = new Map();
    this.objectTypesCache = new Map();
    this.interfaceTypesCache = new Map();
    this.middlewaresByTargetAndFieldCache = new Map();
    this.resolverMiddlewaresByTargetCache = new Map();
    this.paramsCache = new Map();
    this.fieldDirectivesByTargetAndFieldCache = new Map();
    this.classDirectivesByTargetCache = new Map();
    this.authorizedFieldsByTargetAndFieldCache = new Map();
    this.authorizedResolverByTargetCache = new Map();
    this.resolverClassesCache = new Map();
  }

  private buildClassMetadata(definitions: ClassMetadata[]) {
    definitions.forEach(def => {
      if (!def.fields) {
        const fields = this.fieldsCache.get(def.target) || [];
        fields.forEach(field => {
          field.roles = this.findFieldRoles(field.target, field.name);
          field.params = this.paramsCache.get(field.target)?.get(field.name) || [];
          field.middlewares = [
            ...mapMiddlewareMetadataToArray([
              ...(this.resolverMiddlewaresByTargetCache.get(field.target) || []),
            ]),
            ...mapMiddlewareMetadataToArray([
              ...(this.middlewaresByTargetAndFieldCache.get(field.target)?.get(field.name) || []),
            ]),
          ];
          field.directives = (
            this.fieldDirectivesByTargetAndFieldCache.get(field.target)?.get(field.name) || []
          ).map(it => it.directive);
          field.extensions = this.findExtensions(field.target, field.name);
        });
        def.fields = fields;
      }
      if (!def.directives) {
        def.directives = (this.classDirectivesByTargetCache.get(def.target) || []).map(
          it => it.directive,
        );
      }
      if (!def.extensions) {
        def.extensions = this.findExtensions(def.target);
      }
    });
  }

  private buildResolversMetadata(definitions: BaseResolverMetadata[]) {
    definitions.forEach(def => {
      def.resolverClassMetadata = this.resolverClassesCache.get(def.target);
      def.params = this.paramsCache.get(def.target)?.get(def.methodName) || [];
      def.roles = this.findFieldRoles(def.target, def.methodName);
      def.middlewares = [
        ...mapMiddlewareMetadataToArray([
          ...(this.resolverMiddlewaresByTargetCache.get(def.target) || []),
        ]),
        ...mapMiddlewareMetadataToArray([
          ...(this.middlewaresByTargetAndFieldCache.get(def.target)?.get(def.methodName) || []),
        ]),
      ];

      def.directives = (
        this.fieldDirectivesByTargetAndFieldCache.get(def.target)?.get(def.methodName) || []
      ).map(it => it.directive);
      def.extensions = this.findExtensions(def.target, def.methodName);
    });
  }

  private buildFieldResolverMetadata(
    definitions: FieldResolverMetadata[],
    options: SchemaGeneratorOptions,
  ) {
    this.buildResolversMetadata(definitions);
    definitions.forEach(def => {
      def.roles = this.findFieldRoles(def.target, def.methodName);
      def.directives = (
        this.fieldDirectivesByTargetAndFieldCache.get(def.target)?.get(def.methodName) || []
      ).map(it => it.directive);
      def.extensions = this.findExtensions(def.target, def.methodName);
      def.getObjectType =
        def.kind === "external"
          ? this.resolverClassesCache.get(def.target)!.getObjectType
          : () => def.target as ClassType;
      if (def.kind === "external") {
        const typeClass = this.resolverClassesCache.get(def.target)!.getObjectType!();
        const typeMetadata =
          this.objectTypesCache.get(typeClass) || this.interfaceTypesCache.get(typeClass);
        if (!typeMetadata) {
          throw new Error(
            `Unable to find type metadata for input type or object type named '${typeClass.name}'`,
          );
        }

        const typeField = typeMetadata.fields!.find(
          fieldDef => fieldDef.schemaName === def.schemaName,
        )!;
        if (!typeField) {
          const shouldCollectFieldMetadata =
            !options.resolvers ||
            options.resolvers.some(
              resolverCls =>
                resolverCls === def.target ||
                Object.prototype.isPrototypeOf.call(def.target, resolverCls),
            );
          if (!def.getType || !def.typeOptions) {
            throw new NoExplicitTypeError(def.target.name, def.methodName);
          }
          if (shouldCollectFieldMetadata) {
            const fieldMetadata: FieldMetadata = {
              name: def.methodName,
              schemaName: def.schemaName,
              getType: def.getType!,
              target: typeClass,
              typeOptions: def.typeOptions!,
              deprecationReason: def.deprecationReason,
              description: def.description,
              complexity: def.complexity,
              roles: def.roles!,
              middlewares: def.middlewares!,
              params: def.params!,
              directives: def.directives,
              extensions: def.extensions,
            };
            this.collectClassFieldMetadata(fieldMetadata);
            typeMetadata.fields!.push(fieldMetadata);
          }
        } else {
          typeField.complexity = def.complexity;
          if (typeField.params!.length === 0) {
            typeField.params = def.params!;
          }
          if (def.roles) {
            typeField.roles = def.roles;
          } else if (typeField.roles) {
            def.roles = typeField.roles;
          }
        }
      }
    });
  }

  private buildExtendedResolversMetadata() {
    this.resolverClasses.forEach(def => {
      let superResolver = Object.getPrototypeOf(def.target);

      // copy and modify metadata of resolver from parent resolver class
      while (superResolver.prototype) {
        const superResolverMetadata = this.resolverClassesCache.get(superResolver);
        if (superResolverMetadata) {
          this.queries = mapSuperResolverHandlers(this.queries, superResolver, def);
          this.mutations = mapSuperResolverHandlers(this.mutations, superResolver, def);
          this.subscriptions = mapSuperResolverHandlers(this.subscriptions, superResolver, def);
          this.fieldResolvers = mapSuperFieldResolverHandlers(
            this.fieldResolvers,
            superResolver,
            def,
          );
        }
        superResolver = Object.getPrototypeOf(superResolver);
      }
    });
  }

  private findFieldRoles(target: Function, fieldName: string): any[] | undefined {
    const authorizedField =
      this.authorizedFieldsByTargetAndFieldCache.get(target)?.get(fieldName) ||
      this.authorizedResolverByTargetCache.get(target);
    if (!authorizedField) {
      return undefined;
    }
    return authorizedField.roles;
  }

  private findExtensions(target: Function, fieldName?: string): ExtensionsMetadata {
    const storedExtensions: Array<ExtensionsClassMetadata | ExtensionsFieldMetadata> = fieldName
      ? this.fieldExtensions
      : this.classExtensions;
    return storedExtensions
      .filter(
        entry =>
          (entry.target === target || Object.prototype.isPrototypeOf.call(entry.target, target)) &&
          (!("fieldName" in entry) || entry.fieldName === fieldName),
      )
      .reduce((extensions, entry) => ({ ...extensions, ...entry.extensions }), {});
  }
}
