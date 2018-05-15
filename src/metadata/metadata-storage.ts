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

export class MetadataStorage {
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

  private resolvers: ResolverClassMetadata[] = [];
  private fields: FieldMetadata[] = [];
  private params: ParamMetadata[] = [];

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
  collectObjectMetadata(definition: ClassMetadata) {
    this.objectTypes.push(definition);
  }
  collectInputMetadata(definition: ClassMetadata) {
    this.inputTypes.push(definition);
  }
  collectArgsMetadata(definition: ClassMetadata) {
    this.argumentTypes.push(definition);
  }
  collectInterfaceMetadata(definition: ClassMetadata) {
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
    this.resolvers.push(definition);
  }
  collectClassFieldMetadata(definition: FieldMetadata) {
    this.fields.push(definition);
  }
  collectHandlerParamMetadata(definition: ParamMetadata) {
    this.params.push(definition);
  }

  build() {
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

    this.resolvers = [];
    this.fields = [];
    this.params = [];
  }

  private buildClassMetadata(definitions: ClassMetadata[]) {
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

  private buildResolversMetadata(definitions: BaseResolverMetadata[]) {
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

  private buildFieldResolverMetadata(definitions: FieldResolverMetadata[]) {
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

  private findFieldRoles(target: Function, fieldName: string): any[] | undefined {
    const authorizedField = this.authorizedFields.find(
      authField => authField.target === target && authField.fieldName === fieldName,
    );
    if (!authorizedField) {
      return;
    }
    return authorizedField.roles;
  }

  private mapMetadataToMiddlewares(metadata: MiddlewareMetadata[]): Array<Middleware<any>> {
    return metadata
      .map(m => m.middlewares)
      .reduce<Array<Middleware<any>>>(
        (middlewares, resultArray) => resultArray.concat(middlewares),
        [],
      );
  }
}
