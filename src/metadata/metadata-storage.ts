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
} from "./definitions";
import { ClassType } from "../types/decorators";

export abstract class MetadataStorage {
  static queries: ResolverMetadata[] = [];
  static mutations: ResolverMetadata[] = [];
  static fieldResolvers: FieldResolverMetadata[] = [];
  static objectTypes: ClassMetadata[] = [];
  static inputTypes: ClassMetadata[] = [];
  static argumentTypes: ClassMetadata[] = [];
  static interfaceTypes: ClassMetadata[] = [];
  static authorizedFields: AuthorizedMetadata[] = [];
  static enums: EnumMetadata[] = [];
  static unions: UnionMetadataWithSymbol[] = [];

  private static resolvers: ResolverClassMetadata[] = [];
  private static fields: FieldMetadata[] = [];
  private static params: ParamMetadata[] = [];

  static collectQueryHandlerMetadata(definition: ResolverMetadata) {
    this.queries.push(definition);
  }
  static collectMutationHandlerMetadata(definition: ResolverMetadata) {
    this.mutations.push(definition);
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

    this.buildFieldResolverMetadata(this.fieldResolvers);

    this.buildClassMetadata(this.objectTypes);
    this.buildClassMetadata(this.inputTypes);
    this.buildClassMetadata(this.argumentTypes);
    this.buildClassMetadata(this.interfaceTypes);

    this.buildResolversMetadata(this.queries);
    this.buildResolversMetadata(this.mutations);
  }

  static clear() {
    this.queries = [];
    this.mutations = [];
    this.fieldResolvers = [];
    this.objectTypes = [];
    this.inputTypes = [];
    this.argumentTypes = [];
    this.interfaceTypes = [];
    this.authorizedFields = [];
    this.enums = [];
    this.unions = [];

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
        if (field.params.length === 0) {
          // no params = try to get params from field resolver
          const fieldResolver = this.fieldResolvers.find(
            resolver =>
              resolver.methodName === field.name && resolver.getParentType!() === field.target,
          );
          if (fieldResolver) {
            field.params = fieldResolver.params;
          }
        }
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
    });
  }

  private static buildFieldResolverMetadata(definitions: FieldResolverMetadata[]) {
    this.buildResolversMetadata(definitions);
    definitions.forEach(def => {
      def.roles = def.roles || this.fields.find(field => field.name === def.methodName)!.roles;
      def.getParentType =
        def.kind === "external"
          ? (this.resolvers.find(
              resolver => resolver.target === def.target,
            ) as FieldResolverMetadata).getParentType
          : () => def.target as ClassType;
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
}
