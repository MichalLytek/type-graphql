import {
  AuthorizedMetadata,
  BaseResolverMetadata,
  ClassMetadata,
  EnumMetadata,
  FieldMetadata,
  FieldResolverMetadata,
  MiddlewareMetadata,
  ParamMetadata,
  ResolverClassMetadata,
  ResolverMetadata,
  SubscriptionResolverMetadata,
  UnionMetadataWithSymbol,
} from "./definitions";
import { getMetadataStorage } from "./getMetadataStorage";
import {
  copyMetadata,
  mapMiddlewareMetadataToArray,
  mapSuperFieldResolverHandlers,
  mapSuperResolverHandlers,
} from "./utils";
import { ClassType } from "../interfaces";
import { NoExplicitTypeError } from "../errors";

export class MetadataBuilder {
  queries: ResolverMetadata[] = [];
  mutations: ResolverMetadata[] = [];
  subscriptions: SubscriptionResolverMetadata[] = [];
  fieldResolvers: FieldResolverMetadata[] = [];
  objectTypes: ClassMetadata[] = [];
  inputTypes: ClassMetadata[] = [];
  argumentTypes: ClassMetadata[] = [];
  interfaceTypes: ClassMetadata[] = [];
  authorizedFields: AuthorizedMetadata[] = [];
  enums: EnumMetadata[] = [];
  unions: UnionMetadataWithSymbol[] = [];
  middlewares: MiddlewareMetadata[] = [];

  resolverClasses: ResolverClassMetadata[] = [];

  fields: FieldMetadata[] = [];
  params: ParamMetadata[] = [];

  build(resolvers: Function[], types: any[]) {
    const storage = getMetadataStorage();

    this.resolverClasses = copyMetadata(storage.resolverClasses).filter(
      def => def.isAbstract || resolvers.includes(def.target),
    );
    this.middlewares = copyMetadata(storage.middlewares).filter(def =>
      resolvers.includes(def.target),
    );

    this.objectTypes = copyMetadata(storage.objectTypes).filter(def => types.includes(def.target));
    this.inputTypes = copyMetadata(storage.inputTypes).filter(def => types.includes(def.target));
    this.argumentTypes = copyMetadata(storage.argumentTypes).filter(def =>
      types.includes(def.target),
    );
    this.interfaceTypes = copyMetadata(storage.interfaceTypes).filter(def =>
      types.includes(def.target),
    );

    this.enums = copyMetadata(storage.enums);
    this.unions = copyMetadata(storage.unions);
    this.fields = copyMetadata(storage.fields);
    this.params = copyMetadata(storage.params);

    const isExistResolver = (def: { target: Function }) =>
      this.resolverClasses.find(resDef => resDef.target === def.target);

    this.interfaceTypes = copyMetadata(storage.interfaceTypes).filter(isExistResolver);
    this.queries = copyMetadata(storage.queries).filter(isExistResolver);
    this.mutations = copyMetadata(storage.mutations).filter(isExistResolver);
    this.subscriptions = copyMetadata(storage.subscriptions).filter(isExistResolver);
    this.authorizedFields = copyMetadata(storage.authorizedFields).filter(isExistResolver);

    this.buildClassMetadata(this.objectTypes);
    this.buildClassMetadata(this.inputTypes);
    this.buildClassMetadata(this.argumentTypes);
    this.buildClassMetadata(this.interfaceTypes);

    this.buildFieldResolverMetadata(this.fieldResolvers);

    this.buildResolversMetadata(this.queries);
    this.buildResolversMetadata(this.mutations);
    this.buildResolversMetadata(this.subscriptions);

    this.buildExtendedResolversMetadata(resolvers);
  }

  private buildClassMetadata(definitions: ClassMetadata[]) {
    definitions.forEach(def => {
      const fields = this.fields.filter(field => field.target === def.target);
      fields.forEach(field => {
        field.roles = this.findFieldRoles(field.target, field.name);
        field.params = this.params.filter(
          param => param.target === field.target && field.name === param.methodName,
        );
        field.middlewares = mapMiddlewareMetadataToArray(
          this.middlewares.filter(
            middleware => middleware.target === field.target && middleware.fieldName === field.name,
          ),
        );
      });
      def.fields = fields;
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
    });
  }

  private buildFieldResolverMetadata(definitions: FieldResolverMetadata[]) {
    this.buildResolversMetadata(definitions);
    definitions.forEach(def => {
      def.roles = this.findFieldRoles(def.target, def.methodName);
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
          };
          this.fields.push(fieldMetadata);
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

  private buildExtendedResolversMetadata(resolvers: Function[]) {
    this.resolverClasses
      .filter(def => resolvers.includes(def.target))
      .forEach(def => {
        const target = def.target;
        let superResolver = Object.getPrototypeOf(target);

        // copy and modify metadata of resolver from parent resolver class
        while (superResolver.prototype) {
          const superResolverMetadata = this.resolverClasses.find(
            it => it.target === superResolver,
          );
          if (superResolverMetadata) {
            this.queries.unshift(...mapSuperResolverHandlers(this.queries, superResolver, def));
            this.mutations.unshift(...mapSuperResolverHandlers(this.mutations, superResolver, def));
            this.subscriptions.unshift(
              ...mapSuperResolverHandlers(this.subscriptions, superResolver, def),
            );
            this.fieldResolvers.unshift(
              ...mapSuperFieldResolverHandlers(this.fieldResolvers, superResolver, def),
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
