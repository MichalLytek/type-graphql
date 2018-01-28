import {
  HandlerDefinition,
  ClassDefinition,
  FieldDefinition,
  ParamDefinition,
  FieldResolverDefinition,
  ResolverDefinition,
} from "./definition-interfaces";

export abstract class MetadataStorage {
  static readonly queries: HandlerDefinition[] = [];
  static readonly mutations: HandlerDefinition[] = [];
  static readonly fieldResolvers: FieldResolverDefinition[] = [];
  static readonly objectTypes: ClassDefinition[] = [];
  static readonly inputTypes: ClassDefinition[] = [];
  static readonly argumentTypes: ClassDefinition[] = [];

  private static readonly resolvers: ResolverDefinition[] = [];
  private static readonly fields: FieldDefinition[] = [];
  private static readonly params: ParamDefinition[] = [];

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

    this.buildClassDefinitions(this.objectTypes);
    this.buildClassDefinitions(this.inputTypes);
    this.buildClassDefinitions(this.argumentTypes);

    this.buildHandlerDefinitions(this.queries);
    this.buildHandlerDefinitions(this.mutations);

    this.buildFieldResolverDefinitions(this.fieldResolvers);
  }

  private static buildClassDefinitions(definitions: ClassDefinition[]) {
    definitions.forEach(def => {
      def.fields = MetadataStorage.fields.filter(field => field.target === def.target);
    });
  }
  private static buildHandlerDefinitions(definition: HandlerDefinition[]) {
    definition.forEach(def => {
      def.params = MetadataStorage.params.filter(
        param => param.target === def.target && def.methodName === param.methodName,
      );
    });
  }
  private static buildFieldResolverDefinitions(definition: FieldResolverDefinition[]) {
    this.buildHandlerDefinitions(definition);
    definition.forEach(def => {
      def.parentType =
        def.kind === "external"
          ? MetadataStorage.resolvers.find(
              resolver => resolver.target === def.target,
            )!.getParentType()
          : def.target;
    });
  }
}
