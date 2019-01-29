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
  ModelMetadata,
  DestinationMetadata,
} from "./definitions";
import { ClassType } from "../interfaces";
import { NoExplicitTypeError } from "../errors";
import {
  mapSuperResolverHandlers,
  mapMiddlewareMetadataToArray,
  mapSuperFieldResolverHandlers,
  ensureReflectMetadataExists,
} from "./utils";
import { TypeClassMetadata } from "./definitions/typeclass-metadata";

export class MetadataStorage {
  queries: ResolverMetadata[] = [];
  mutations: ResolverMetadata[] = [];
  subscriptions: SubscriptionResolverMetadata[] = [];
  fieldResolvers: FieldResolverMetadata[] = [];
  objectTypes: ClassMetadata[] = [];
  objectArgs: ClassMetadata[] = [];
  inputTypes: ClassMetadata[] = [];
  argumentTypes: TypeClassMetadata[] = [];
  interfaceTypes: ClassMetadata[] = [];
  args: ClassMetadata[] = [];
  authorizedFields: AuthorizedMetadata[] = [];
  enums: EnumMetadata[] = [];
  unions: UnionMetadataWithSymbol[] = [];
  middlewares: MiddlewareMetadata[] = [];

  models: ModelMetadata[] = [];
  destinations: DestinationMetadata[] = [];
  modelTypes: TypeClassMetadata[] = [];
  destinationTypes: TypeClassMetadata[] = [];

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
  collectObjectMetadata(definition: ClassMetadata) {
    this.objectTypes.push(definition);
  }
  collectModelMetadata(definition: ModelMetadata) {
    this.models.push(definition);
  }
  collectDestinationMetadata(definition: DestinationMetadata) {
    this.destinations.push(definition);
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
    this.resolverClasses.push(definition);
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
    this.buildClassMetadata(this.models);

    this.buildFieldResolverMetadata(this.fieldResolvers);

    this.buildResolversMetadata(this.queries);
    this.buildResolversMetadata(this.mutations);
    this.buildResolversMetadata(this.subscriptions);

    this.buildExtendedResolversMetadata();

    this.buildModels(this.models);
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
    this.models = [];
    this.destinations = [];

    this.resolverClasses = [];
    this.fields = [];
    this.params = [];
  }

  private buildClassMetadata(definitions: ClassMetadata[]): void;
  private buildClassMetadata(definitions: ModelMetadata[]): void;
  private buildClassMetadata(definitions: ClassMetadata[] | ModelMetadata[]): void {
    for (const def of definitions) {
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
    }
  }

  private getModelTypes(model: ModelMetadata) {
    if (model.models) {
      return this.objectTypes.filter(ot => model.models!.indexOf(ot.target) > -1);
    }
    return [];
  }

  private buildModels(definitions: ModelMetadata[]) {
    definitions.map(def => {
      const modelTypes = this.getModelTypes(def);
      modelTypes.map(ot => {
        const destinationFields: FieldMetadata[] = this.destinations
          .filter(destination => destination.target === def.target)
          .map<FieldMetadata>(field => {
            const typeName = ot.name + def.name + field.name;
            const destinationField = {
              name: field.name,
              target: field.target,
              typeOptions: {
                nullable: field.nullable,
                array: false,
                defaultValue: undefined,
              },
              params: [],
              schemaName: field.name,
              getType: () => typeName,
              complexity: undefined,
              deprecationReason: undefined,
              description: undefined,
            };
            this.modelTypes.push({
              ...ot,
              name: typeName,
              model: ot,
              fields: this.compileFields(ot, def, field),
              toType: def.toType === "ArgsType" ? "InputType" : def.toType,
            });
            return destinationField;
          });
        const destinationType = {
          name: ot.name + def.name + "Destination",
          target: def.target,
          toType: def.toType,
          model: ot,
          fields: def
            .fields!.map(field => {
              return field;
            })
            .concat(destinationFields),
        };
        if (def.toType === "ArgsType") {
          this.argumentTypes.push(destinationType);
        } else {
          this.destinationTypes.push(destinationType);
        }
      });
    });
  }

  private compileFields(
    definition: ClassMetadata,
    model: ModelMetadata,
    destination: DestinationMetadata,
  ): FieldMetadata[] {
    model.transform = model.transform || {};
    destination.transform = destination.transform || {};
    return definition.fields!.map(
      (field): FieldMetadata => {
        const modelRelation = this.getModelTypes(model).find(mt => mt.target === field.getType());
        const newField = {
          ...field,
          typeOptions: {
            ...field.typeOptions,
            nullable: destination.transform!.nullable || model.transform!.nullable,
          },
          getType: modelRelation
            ? () => modelRelation.name + model.name + destination.name
            : field.getType,
        };
        model.transform!.apply && model.transform!.apply!(newField);
        destination.transform!.apply && destination.transform!.apply!(newField);
        return newField;
      },
    );
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
            fieldResolver: true,
          };
          this.collectClassFieldMetadata(fieldMetadata);
          objectType.fields!.push(fieldMetadata);
        } else {
          objectTypeField.fieldResolver = true;
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
