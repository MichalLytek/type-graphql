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
import { ClassType } from "../types/decorators";
import { Middleware } from "../interfaces/Middleware";
import { NoExplicitTypeError } from "../errors";

export abstract class MetadataStorage {
  static queries: ResolverMetadata[] = [];
  static mutations: ResolverMetadata[] = [];
  static subscriptions: SubscriptionResolverMetadata[] = [];
  static fieldResolvers: FieldResolverMetadata[] = [];
  static objectTypes: ClassMetadata[] = [];
  static inputTypes: ClassMetadata[] = [];
  static argumentTypes: ClassMetadata[] = [];
  static interfaceTypes: ClassMetadata[] = [];
  static authorizedFields: AuthorizedMetadata[] = [];
  static enums: EnumMetadata[] = [];
  static unions: UnionMetadataWithSymbol[] = [];
  static middlewares: MiddlewareMetadata[] = [];

  private static resolvers: ResolverClassMetadata[] = [];
  private static fields: FieldMetadata[] = [];
  private static params: ParamMetadata[] = [];

  static collectQueryHandlerMetadata(definition: ResolverMetadata) {
    this.queries.push(definition);
  }
  static collectMutationHandlerMetadata(definition: ResolverMetadata) {
    this.mutations.push(definition);
  }
  static collectSubscriptionHandlerMetadata(definition: SubscriptionResolverMetadata) {
    this.subscriptions.push(definition);
  }
  static collectFieldResolverMetadata(definition: FieldResolverMetadata) {
    this.fieldResolvers.push(definition);
  }
  static collectObjectMetadata(definition: ClassMetadata) {
    this.objectTypes.push(definition);
  }
  static collectInputMetadata(definition: ClassMetadata) {
    this.inputTypes.push(definition);
  }
  static collectArgsMetadata(definition: ClassMetadata) {
    this.argumentTypes.push(definition);
  }
  static collectInterfaceMetadata(definition: ClassMetadata) {
    this.interfaceTypes.push(definition);
  }
  static collectAuthorizedFieldMetadata(definition: AuthorizedMetadata) {
    this.authorizedFields.push(definition);
  }
  static collectEnumMetadata(definition: EnumMetadata) {
    this.enums.push(definition);
  }
  static collectUnionMetadata(definition: UnionMetadata) {
    const unionSymbol = Symbol(definition.name);
    this.unions.push({
      ...definition,
      symbol: unionSymbol,
    });
    return unionSymbol;
  }
  static collectMiddlewareMetadata(definition: MiddlewareMetadata) {
    this.middlewares.push(definition);
  }

  static collectResolverClassMetadata(definition: ResolverClassMetadata) {
    this.resolvers.push(definition);
  }
  static collectClassFieldMetadata(definition: FieldMetadata) {
    this.fields.push(definition);
  }
  static collectHandlerParamMetadata(definition: ParamMetadata) {
    this.params.push(definition);
  }

  static build() {
    // TODO: disable next build attempts

    this.buildClassMetadata(this.objectTypes);
    this.buildClassMetadata(this.inputTypes);
    this.buildClassMetadata(this.argumentTypes);
    this.buildClassMetadata(this.interfaceTypes);

    this.buildFieldResolverMetadata(this.fieldResolvers);

    this.buildResolversMetadata(this.queries);
    this.buildResolversMetadata(this.mutations);
    this.buildResolversMetadata(this.subscriptions);
  }

  static clear() {
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

    this.resolvers = [];
    this.fields = [];
    this.params = [];
  }

  private static buildClassMetadata(definitions: ClassMetadata[]) {
    definitions.forEach(def => {
      const fields = this.fields.filter(field => field.target === def.target);
      fields.forEach(field => {
        field.roles = this.findFieldRoles(field.target, field.name);
        field.params = this.params.filter(
          param => param.target === field.target && field.name === param.methodName,
        );
        field.middlewares = this.mapMetadataToMiddlewares(
          this.middlewares.filter(
            middleware => middleware.target === field.target && middleware.fieldName === field.name,
          ),
        );
      });
      def.fields = fields;
    });
  }

  private static buildResolversMetadata(definitions: BaseResolverMetadata[]) {
    definitions.forEach(def => {
      def.params = this.params.filter(
        param => param.target === def.target && def.methodName === param.methodName,
      );
      def.roles = this.findFieldRoles(def.target, def.methodName);
      def.middlewares = this.mapMetadataToMiddlewares(
        this.middlewares.filter(
          middleware => middleware.target === def.target && def.methodName === middleware.fieldName,
        ),
      );
    });
  }

  private static buildFieldResolverMetadata(definitions: FieldResolverMetadata[]) {
    this.buildResolversMetadata(definitions);
    definitions.forEach(def => {
      def.roles = this.findFieldRoles(def.target, def.methodName);
      def.getObjectType =
        def.kind === "external"
          ? this.resolvers.find(resolver => resolver.target === def.target)!.getObjectType
          : () => def.target as ClassType;
      if (def.kind === "external") {
        const objectTypeCls = this.resolvers.find(resolver => resolver.target === def.target)!
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
          const fieldMetadata = {
            name: def.methodName,
            getType: def.getType!,
            target: objectTypeCls,
            typeOptions: def.typeOptions!,
            deprecationReason: def.deprecationReason,
            description: def.description,
            roles: def.roles!,
            middlewares: def.middlewares!,
            params: def.params!,
          };
          this.collectClassFieldMetadata(fieldMetadata);
          objectType.fields!.push(fieldMetadata);
        } else {
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

  private static findFieldRoles(target: Function, fieldName: string): string[] | undefined {
    const authorizedField = this.authorizedFields.find(
      authField => authField.target === target && authField.fieldName === fieldName,
    );
    if (!authorizedField) {
      return;
    }
    return authorizedField.roles;
  }

  private static mapMetadataToMiddlewares(metadata: MiddlewareMetadata[]): Array<Middleware<any>> {
    return metadata
      .map(m => m.middlewares)
      .reduce<Array<Middleware<any>>>(
        (middlewares, resultArray) => resultArray.concat(middlewares),
        [],
      );
  }
}
