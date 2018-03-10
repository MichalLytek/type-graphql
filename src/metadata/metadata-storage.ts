import {
  HandlerDefinition,
  ClassDefinition,
  FieldDefinition,
  ParamDefinition,
  FieldResolverDefinition,
  ResolverDefinition,
  AuthorizationDefinition,
  EnumDefinition,
} from "./definition-interfaces";
import { BaseResolverDefinitions } from "../types/resolvers";
import { ClassType } from "../types/decorators";

export abstract class MetadataStorage {
  static queries: HandlerDefinition[] = [];
  static mutations: HandlerDefinition[] = [];
  static fieldResolvers: FieldResolverDefinition[] = [];
  static objectTypes: ClassDefinition[] = [];
  static inputTypes: ClassDefinition[] = [];
  static argumentTypes: ClassDefinition[] = [];
  static interfaceTypes: ClassDefinition[] = [];
  static authorizedFields: AuthorizationDefinition[] = [];
  static enums: EnumDefinition[] = [];

  private static resolvers: ResolverDefinition[] = [];
  private static fields: FieldDefinition[] = [];
  private static params: ParamDefinition[] = [];

  static registerQueryHandler(definition: HandlerDefinition) {
    this.queries.push(definition);
  }
  static registerMutationHandler(definition: HandlerDefinition) {
    this.mutations.push(definition);
  }
  static registerFieldResolver(definition: FieldResolverDefinition) {
    this.fieldResolvers.push(definition);
  }
  static registerObjectDefinition(definition: ClassDefinition) {
    this.objectTypes.push(definition);
  }
  static registerInputDefinition(definition: ClassDefinition) {
    this.inputTypes.push(definition);
  }
  static registerArgsDefinition(definition: ClassDefinition) {
    this.argumentTypes.push(definition);
  }
  static registerInterfaceDefinition(definition: ClassDefinition) {
    this.interfaceTypes.push(definition);
  }
  static registerAuthorizedField(definition: AuthorizationDefinition) {
    this.authorizedFields.push(definition);
  }
  static registerEnumDefinition(definition: EnumDefinition) {
    this.enums.push(definition);
  }

  static registerResolver(definition: ResolverDefinition) {
    this.resolvers.push(definition);
  }
  static registerClassField(definition: FieldDefinition) {
    this.fields.push(definition);
  }
  static registerHandlerParam(definition: ParamDefinition) {
    this.params.push(definition);
  }

  static build() {
    // TODO: disable next build attempts

    this.buildFieldResolverDefinitions(this.fieldResolvers);

    this.buildClassDefinitions(this.objectTypes);
    this.buildClassDefinitions(this.inputTypes);
    this.buildClassDefinitions(this.argumentTypes);
    this.buildClassDefinitions(this.interfaceTypes);

    this.buildResolversDefinitions(this.queries);
    this.buildResolversDefinitions(this.mutations);
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

    this.resolvers = [];
    this.fields = [];
    this.params = [];
  }

  private static buildClassDefinitions(definitions: ClassDefinition[]) {
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

  private static buildResolversDefinitions(definitions: BaseResolverDefinitions[]) {
    definitions.forEach(def => {
      def.params = this.params.filter(
        param => param.target === def.target && def.methodName === param.methodName,
      );
      def.roles = this.findFieldRoles(def.target, def.methodName);
    });
  }

  private static buildFieldResolverDefinitions(definitions: FieldResolverDefinition[]) {
    this.buildResolversDefinitions(definitions);
    definitions.forEach(def => {
      def.roles = def.roles || this.fields.find(field => field.name === def.methodName)!.roles;
      def.getParentType =
        def.kind === "external"
          ? this.resolvers.find(resolver => resolver.target === def.target)!.getParentType
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
