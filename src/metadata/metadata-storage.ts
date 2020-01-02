import {
  ResolverMetadata,
  ClassMetadata,
  FieldMetadata,
  ParamMetadata,
  FieldResolverMetadata,
  AuthorizedMetadata,
  BaseResolverMetadata,
  EnumMetadata,
  UnionMetadata,
  UnionMetadataWithSymbol,
  ResolverClassMetadata,
  SubscriptionResolverMetadata,
  MiddlewareMetadata,
} from "./definitions";
import { ClassType } from "../interfaces";
import { NoExplicitTypeError } from "../errors";
import {
  mapSuperResolverHandlers,
  mapMiddlewareMetadataToArray,
  mapSuperFieldResolverHandlers,
  ensureReflectMetadataExists,
} from "./utils";
import { ObjectClassMetadata } from "./definitions/object-class-metdata";
import { InterfaceClassMetadata } from "./definitions/interface-class-metadata";
import { DirectiveClassMetadata, DirectiveFieldMetadata } from "./definitions/directive-metadata";

export class MetadataStorage {
  queries: ResolverMetadata[] = [];
  mutations: ResolverMetadata[] = [];
  subscriptions: SubscriptionResolverMetadata[] = [];
  fieldResolvers: FieldResolverMetadata[] = [];
  objectTypes: ObjectClassMetadata[] = [];
  inputTypes: ClassMetadata[] = [];
  argumentTypes: ClassMetadata[] = [];
  interfaceTypes: InterfaceClassMetadata[] = [];
  authorizedFields: AuthorizedMetadata[] = [];
  enums: EnumMetadata[] = [];
  unions: UnionMetadataWithSymbol[] = [];
  middlewares: MiddlewareMetadata[] = [];
  classDirectives: DirectiveClassMetadata[] = [];
  fieldDirectives: DirectiveFieldMetadata[] = [];

  private resolverClasses: ResolverClassMetadata[] = [];
  private fields: FieldMetadata[] = [];
  private params: ParamMetadata[] = [];

  constructor() {
    ensureReflectMetadataExists();
  }

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

  build() {
    // TODO: disable next build attempts

    this.classDirectives.reverse();
    this.fieldDirectives.reverse();

    this.buildClassMetadata(this.objectTypes);
    this.buildClassMetadata(this.inputTypes);
    this.buildClassMetadata(this.argumentTypes);
    this.buildClassMetadata(this.interfaceTypes);

    this.buildFieldResolverMetadata(this.fieldResolvers);

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
    this.enums = [];
    this.unions = [];
    this.middlewares = [];
    this.classDirectives = [];
    this.fieldDirectives = [];

    this.resolverClasses = [];
    this.fields = [];
    this.params = [];
  }

  private buildClassMetadata(definitions: ClassMetadata[]) {
    definitions.forEach(def => {
      if (!def.fields) {
        const fields = this.fields.filter(field => field.target === def.target);
        fields.forEach(field => {
          field.roles = this.findFieldRoles(field.target, field.name);
          field.params = this.params.filter(
            param => param.target === field.target && field.name === param.methodName,
          );
          field.middlewares = mapMiddlewareMetadataToArray(
            this.middlewares.filter(
              middleware =>
                middleware.target === field.target && middleware.fieldName === field.name,
            ),
          );
          field.directives = this.fieldDirectives
            .filter(it => it.target === field.target && it.fieldName === field.name)
            .map(it => it.directive);
        });
        def.fields = fields;
      }
      if (!def.directives) {
        def.directives = this.classDirectives
          .filter(it => it.target === def.target)
          .map(it => it.directive);
      }
    });
  }

  private buildResolversMetadata(definitions: BaseResolverMetadata[]) {
    definitions.forEach(def => {
      const resolverClassMetadata = this.resolverClasses.find(
        resolver => resolver.target === def.target,
      )!;
      def.resolverClassMetadata = resolverClassMetadata;
      def.params = this.params.filter(
        param => param.target === def.target && def.methodName === param.methodName,
      );
      def.roles = this.findFieldRoles(def.target, def.methodName);
      def.middlewares = mapMiddlewareMetadataToArray(
        this.middlewares.filter(
          middleware => middleware.target === def.target && def.methodName === middleware.fieldName,
        ),
      );
      def.directives = this.fieldDirectives
        .filter(it => it.target === def.target && it.fieldName === def.methodName)
        .map(it => it.directive);
    });
  }

  private buildFieldResolverMetadata(definitions: FieldResolverMetadata[]) {
    this.buildResolversMetadata(definitions);
    definitions.forEach(def => {
      def.roles = this.findFieldRoles(def.target, def.methodName);
      def.directives = this.fieldDirectives
        .filter(it => it.target === def.target && it.fieldName === def.methodName)
        .map(it => it.directive);
      def.getObjectType =
        def.kind === "external"
          ? this.resolverClasses.find(resolver => resolver.target === def.target)!.getObjectType
          : () => def.target as ClassType;
      if (def.kind === "external") {
        const objectTypeCls = this.resolverClasses.find(resolver => resolver.target === def.target)!
          .getObjectType!();
        const objectType = this.objectTypes.find(
          objTypeDef => objTypeDef.target === objectTypeCls,
        )!;
        const objectTypeField = objectType.fields!.find(
          fieldDef => fieldDef.name === def.methodName,
        )!;
        if (!objectTypeField) {
          if (!def.getType || !def.typeOptions) {
            throw new NoExplicitTypeError(def.target.name, def.methodName);
          }
          const fieldMetadata: FieldMetadata = {
            name: def.methodName,
            schemaName: def.schemaName,
            getType: def.getType!,
            target: objectTypeCls,
            typeOptions: def.typeOptions!,
            deprecationReason: def.deprecationReason,
            description: def.description,
            complexity: def.complexity,
            roles: def.roles!,
            middlewares: def.middlewares!,
            params: def.params!,
            directives: def.directives,
          };
          this.collectClassFieldMetadata(fieldMetadata);
          objectType.fields!.push(fieldMetadata);
        } else {
          objectTypeField.complexity = def.complexity;
          if (objectTypeField.params!.length === 0) {
            objectTypeField.params = def.params!;
          }
          if (def.roles) {
            objectTypeField.roles = def.roles;
          } else if (objectTypeField.roles) {
            def.roles = objectTypeField.roles;
          }
        }
      }
    });
  }

  private buildExtendedResolversMetadata() {
    this.resolverClasses.forEach(def => {
      const target = def.target;
      let superResolver = Object.getPrototypeOf(target);

      // copy and modify metadata of resolver from parent resolver class
      while (superResolver.prototype) {
        const superResolverMetadata = this.resolverClasses.find(it => it.target === superResolver);
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
    const authorizedField = this.authorizedFields.find(
      authField => authField.target === target && authField.fieldName === fieldName,
    );
    if (!authorizedField) {
      return;
    }
    return authorizedField.roles;
  }
}
