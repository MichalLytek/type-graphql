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
  GenericFieldMetadata,
  GenericTypeMetadata,
  TypeClassMetadata,
} from "./definitions";
import { ClassType } from "../interfaces";
import { NoExplicitTypeError } from "../errors";
import {
  mapSuperResolverHandlers,
  mapMiddlewareMetadataToArray,
  mapSuperFieldResolverHandlers,
  ensureReflectMetadataExists,
} from "./utils";

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

  genericTypes: GenericTypeMetadata[] = []; // All @GenericType
  genericFields: GenericFieldMetadata[] = []; // All @GenericFields
  subTypes: TypeClassMetadata[] = []; // Compiled type for a generic field
  wrapperTypes: TypeClassMetadata[] = []; // Compiled type that represent the GenericType class

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
  collectGenericTypeMetadata(definition: GenericTypeMetadata) {
    this.genericTypes.push(definition);
  }
  collectGenericFieldMetadata(definition: GenericFieldMetadata) {
    this.genericFields.push(definition);
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
    this.buildClassMetadata(this.genericTypes);

    this.buildFieldResolverMetadata(this.fieldResolvers);

    this.buildResolversMetadata(this.queries);
    this.buildResolversMetadata(this.mutations);
    this.buildResolversMetadata(this.subscriptions);

    this.buildExtendedResolversMetadata();

    this.buildGenericTypes(this.genericTypes);
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
    this.genericTypes = [];
    this.genericFields = [];
    this.subTypes = [];
    this.wrapperTypes = [];

    this.resolverClasses = [];
    this.fields = [];
    this.params = [];
  }

  private buildClassMetadata(definitions: ClassMetadata[]): void;
  private buildClassMetadata(definitions: GenericTypeMetadata[]): void;
  private buildClassMetadata(definitions: ClassMetadata[] | GenericTypeMetadata[]): void {
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

  private getGenericObjectTypes(genericType: GenericTypeMetadata) {
    const allTypes = [
      ...this.objectTypes,
      ...this.inputTypes,
      ...this.argumentTypes.filter(it => !it.genericType),
    ];
    if (genericType.types) {
      return allTypes.filter(it => genericType.types!.indexOf(it.target) > -1);
    }
    return allTypes;
  }

  private getFieldTypeName(...types: string[]) {
    return types.join("_");
  }

  private buildGenericTypes(definitions: GenericTypeMetadata[]) {
    definitions.map(def => {
      // Get the ObjectTypes to wrap into the GenericType
      this.getGenericObjectTypes(def).map(got => {
        // Rename the SDL object this is the sub type name
        const baseName = this.getFieldTypeName(def.name, got.name);
        // Get the GenericField of the GenericType and convert it into real Fields
        const genericFields: FieldMetadata[] = this.genericFields
          .filter(it => it.target === def.target)
          .map<FieldMetadata>(field => {
            // Create the GenericField type name, it's the sub type name with the GenericField name
            const typeName = this.getFieldTypeName(baseName, field.name);
            const genericField = {
              name: field.name,
              target: field.target,
              typeOptions: {
                nullable: field.nullable,
                array: field.array,
                defaultValue: undefined,
              },
              params: [],
              schemaName: field.name,
              getType: () => typeName,
              destinationField: true,
              middlewares: [],
              complexity: undefined,
              deprecationReason: undefined,
              description: undefined,
              getter: false,
              setter: false,
              isAccessor: false,
            };
            // Create a sub type for each GenericField it contains the properties of
            // the class that passed in parameter (Recipe { name; } => SubType.field has a "name" field)
            this.subTypes.push({
              ...got,
              name: typeName,
              genericType: def,
              type: got,
              isWrapper: false,
              fields: this.compileFields(got, def, field),
              gqlType: def.gqlType === "ArgsType" ? "InputType" : def.gqlType,
            });
            return genericField;
          });
        const wrapperType: TypeClassMetadata = {
          name: this.getFieldTypeName(baseName, "Wrapper"),
          target: def.target,
          gqlType: def.gqlType,
          genericType: def,
          type: got,
          isWrapper: true,
          // Concat normal field (@Field) with GenericField (@GenericField)
          fields: [...def.fields!, ...genericFields],
        };
        if (def.gqlType === "ArgsType") {
          this.argumentTypes.push(wrapperType);
        } else {
          this.wrapperTypes.push(wrapperType);
        }
      });
    });
  }

  private compileFields(
    definition: ClassMetadata,
    genericType: GenericTypeMetadata,
    genericField: GenericFieldMetadata,
  ): FieldMetadata[] {
    genericType.transformFields = genericType.transformFields || {};
    genericField.transformFields = genericField.transformFields || {};
    return definition.fields!.map(
      (field): FieldMetadata => {
        // Find the relation between field and ObjectTypes to replace the relation by a SubType relation in SDL (recipe: Recipe => recipe: GT_Recipe_Prop)
        const typeRelation = this.getGenericObjectTypes(genericType).find(
          it => it.target === field.getType(),
        );
        const newField = {
          ...field,
          typeOptions: {
            ...field.typeOptions,
            nullable:
              genericField.transformFields!.nullable || genericType.transformFields!.nullable,
          },
          getType: typeRelation
            ? () => this.getFieldTypeName(genericType.name, typeRelation.name, genericField.name)
            : field.getType,
        };
        genericType.transformFields!.apply && genericType.transformFields!.apply!(newField);
        genericField.transformFields!.apply && genericField.transformFields!.apply!(newField);
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
            getter: true,
            setter: false,
            isAccessor: true,
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
