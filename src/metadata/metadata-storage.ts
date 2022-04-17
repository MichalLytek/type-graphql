import {
  AuthorizedMetadata,
  BaseResolverMetadata,
  ClassMetadata,
  EnumMetadata,
  ExtensionsClassMetadata,
  ExtensionsFieldMetadata,
  ExtensionsMetadata,
  FieldMetadata,
  FieldResolverMetadata,
  MiddlewareMetadata,
  ParamMetadata,
  ResolverClassMetadata,
  ResolverMetadata,
  SubscriptionResolverMetadata,
  UnionMetadata,
  UnionMetadataWithSymbol
} from './definitions'
import { ClassType } from '../interfaces'
import { NoExplicitTypeError } from '../errors'
import {
  ensureReflectMetadataExists,
  mapMiddlewareMetadataToArray,
  mapSuperFieldResolverHandlers,
  mapSuperResolverHandlers
} from './utils'
import { ObjectClassMetadata } from './definitions/object-class-metdata'
import { InterfaceClassMetadata } from './definitions/interface-class-metadata'
import { DirectiveClassMetadata, DirectiveFieldMetadata } from './definitions/directive-metadata'
import { SchemaGeneratorOptions } from '../schema/schema-generator'

export class MetadataStorage {
  queries: ResolverMetadata[] = []
  mutations: ResolverMetadata[] = []
  subscriptions: SubscriptionResolverMetadata[] = []
  fieldResolvers: FieldResolverMetadata[] = []
  objectTypes: ObjectClassMetadata[] = []
  inputTypes: ClassMetadata[] = []
  argumentTypes: ClassMetadata[] = []
  interfaceTypes: InterfaceClassMetadata[] = []
  authorizedFields: AuthorizedMetadata[] = []
  enums: EnumMetadata[] = []
  unions: UnionMetadataWithSymbol[] = []
  middlewares: MiddlewareMetadata[] = []
  classDirectives: DirectiveClassMetadata[] = []
  fieldDirectives: DirectiveFieldMetadata[] = []
  classExtensions: ExtensionsClassMetadata[] = []
  fieldExtensions: ExtensionsFieldMetadata[] = []
  resolverClasses: ResolverClassMetadata[] = []
  fields: FieldMetadata[] = []
  params: ParamMetadata[] = []

  constructor() {
    ensureReflectMetadataExists()
  }

  collectQueryHandlerMetadata(definition: ResolverMetadata): void {
    this.queries.push(definition)
  }

  collectMutationHandlerMetadata(definition: ResolverMetadata): void {
    this.mutations.push(definition)
  }

  collectSubscriptionHandlerMetadata(definition: SubscriptionResolverMetadata): void {
    this.subscriptions.push(definition)
  }

  collectFieldResolverMetadata(definition: FieldResolverMetadata): void {
    this.fieldResolvers.push(definition)
  }

  collectObjectMetadata(definition: ObjectClassMetadata): void {
    this.objectTypes.push(definition)
  }

  collectInputMetadata(definition: ClassMetadata): void {
    this.inputTypes.push(definition)
  }

  collectArgsMetadata(definition: ClassMetadata): void {
    this.argumentTypes.push(definition)
  }

  collectInterfaceMetadata(definition: InterfaceClassMetadata): void {
    this.interfaceTypes.push(definition)
  }

  collectAuthorizedFieldMetadata(definition: AuthorizedMetadata): void {
    this.authorizedFields.push(definition)
  }

  collectEnumMetadata(definition: EnumMetadata): void {
    this.enums.push(definition)
  }

  collectUnionMetadata(definition: UnionMetadata): Symbol {
    const unionSymbol = Symbol(definition.name)
    this.unions.push({
      ...definition,
      symbol: unionSymbol
    })
    return unionSymbol
  }

  collectMiddlewareMetadata(definition: MiddlewareMetadata): void {
    this.middlewares.push(definition)
  }

  collectResolverClassMetadata(definition: ResolverClassMetadata): void {
    this.resolverClasses.push(definition)
  }

  collectClassFieldMetadata(definition: FieldMetadata): void {
    this.fields.push(definition)
  }

  collectHandlerParamMetadata(definition: ParamMetadata): void {
    this.params.push(definition)
  }

  collectDirectiveClassMetadata(definition: DirectiveClassMetadata): void {
    this.classDirectives.push(definition)
  }

  collectDirectiveFieldMetadata(definition: DirectiveFieldMetadata): void {
    this.fieldDirectives.push(definition)
  }

  collectExtensionsClassMetadata(definition: ExtensionsClassMetadata): void {
    this.classExtensions.push(definition)
  }

  collectExtensionsFieldMetadata(definition: ExtensionsFieldMetadata): void {
    this.fieldExtensions.push(definition)
  }

  build(options: SchemaGeneratorOptions): void {
    this.classDirectives.reverse()
    this.fieldDirectives.reverse()
    this.classExtensions.reverse()
    this.fieldExtensions.reverse()

    this.buildClassMetadata(this.objectTypes)
    this.buildClassMetadata(this.inputTypes)
    this.buildClassMetadata(this.argumentTypes)
    this.buildClassMetadata(this.interfaceTypes)

    this.buildFieldResolverMetadata(this.fieldResolvers, options)

    this.buildResolversMetadata(this.queries)
    this.buildResolversMetadata(this.mutations)
    this.buildResolversMetadata(this.subscriptions)

    this.buildExtendedResolversMetadata()
  }

  clear(): void {
    this.queries = []
    this.mutations = []
    this.subscriptions = []
    this.fieldResolvers = []
    this.objectTypes = []
    this.inputTypes = []
    this.argumentTypes = []
    this.interfaceTypes = []
    this.authorizedFields = []
    this.enums = []
    this.unions = []
    this.middlewares = []
    this.classDirectives = []
    this.fieldDirectives = []
    this.classExtensions = []
    this.fieldExtensions = []

    this.resolverClasses = []
    this.fields = []
    this.params = []
  }

  private buildClassMetadata(definitions: ClassMetadata[]): void {
    definitions.forEach(def => {
      if (!def.fields) {
        const fields = this.fields.filter(field => field.target === def.target)
        fields.forEach(field => {
          field.roles = this.findFieldRoles(field.target, field.name)
          field.params = this.params.filter(param => param.target === field.target && field.name === param.methodName)
          field.middlewares = mapMiddlewareMetadataToArray(
            this.middlewares.filter(
              middleware => middleware.target === field.target && middleware.fieldName === field.name
            )
          )
          field.directives = this.fieldDirectives
            .filter(it => it.target === field.target && it.fieldName === field.name)
            .map(it => it.directive)
          field.extensions = this.findExtensions(field.target, field.name)
        })
        def.fields = fields
      }
      if (!def.directives) {
        def.directives = this.classDirectives.filter(it => it.target === def.target).map(it => it.directive)
      }
      if (!def.extensions) {
        def.extensions = this.findExtensions(def.target)
      }
    })
  }

  private buildResolversMetadata(definitions: BaseResolverMetadata[]): void {
    definitions.forEach(def => {
      const resolverClassMetadata = this.resolverClasses.find(resolver => resolver.target === def.target)!
      def.resolverClassMetadata = resolverClassMetadata
      def.params = this.params.filter(param => param.target === def.target && def.methodName === param.methodName)
      def.roles = this.findFieldRoles(def.target, def.methodName)
      def.middlewares = mapMiddlewareMetadataToArray(
        this.middlewares.filter(
          middleware => middleware.target === def.target && def.methodName === middleware.fieldName
        )
      )
      def.directives = this.fieldDirectives
        .filter(it => it.target === def.target && it.fieldName === def.methodName)
        .map(it => it.directive)
      def.extensions = this.findExtensions(def.target, def.methodName)
    })
  }

  private buildFieldResolverMetadata(definitions: FieldResolverMetadata[], options: SchemaGeneratorOptions): void {
    this.buildResolversMetadata(definitions)
    definitions.forEach(def => {
      def.roles = this.findFieldRoles(def.target, def.methodName)
      def.directives = this.fieldDirectives
        .filter(it => it.target === def.target && it.fieldName === def.methodName)
        .map(it => it.directive)
      def.extensions = this.findExtensions(def.target, def.methodName)
      def.getObjectType =
        def.kind === 'external'
          ? this.resolverClasses.find(resolver => resolver.target === def.target)!.getObjectType
          : () => def.target as ClassType
      if (def.kind === 'external') {
        const typeClass = this.resolverClasses.find(resolver => resolver.target === def.target)!.getObjectType()
        const typeMetadata =
          this.objectTypes.find(objTypeDef => objTypeDef.target === typeClass) ??
          this.interfaceTypes.find(interfaceTypeDef => interfaceTypeDef.target === typeClass)
        if (!typeMetadata) {
          throw new Error(`Unable to find type metadata for input type or object type named '${typeClass.name}'`)
        }

        const typeField = typeMetadata.fields!.find(fieldDef => fieldDef.name === def.methodName)!
        if (!typeField) {
          const shouldCollectFieldMetadata =
            !options.resolvers ||
            options.resolvers.some(resolverCls => resolverCls === def.target || def.target.isPrototypeOf(resolverCls))
          if (!def.getType || !def.typeOptions) {
            throw new NoExplicitTypeError(def.target.name, def.methodName)
          }
          if (shouldCollectFieldMetadata) {
            const fieldMetadata: FieldMetadata = {
              name: def.methodName,
              schemaName: def.schemaName,
              getType: def.getType,
              target: typeClass,
              typeOptions: def.typeOptions,
              deprecationReason: def.deprecationReason,
              description: def.description,
              complexity: def.complexity,
              roles: def.roles!,
              middlewares: def.middlewares!,
              params: def.params!,
              directives: def.directives,
              extensions: def.extensions
            }
            this.collectClassFieldMetadata(fieldMetadata)
            typeMetadata.fields!.push(fieldMetadata)
          }
        } else {
          typeField.complexity = def.complexity
          if (typeField.params!.length === 0) {
            typeField.params = def.params!
          }
          if (def.roles) {
            typeField.roles = def.roles
          } else if (typeField.roles) {
            def.roles = typeField.roles
          }
        }
      }
    })
  }

  private buildExtendedResolversMetadata(): void {
    this.resolverClasses.forEach(def => {
      const target = def.target
      let superResolver = Object.getPrototypeOf(target)

      // copy and modify metadata of resolver from parent resolver class
      while (superResolver.prototype) {
        const superResolverMetadata = this.resolverClasses.find(it => it.target === superResolver)
        if (superResolverMetadata) {
          this.queries = mapSuperResolverHandlers(this.queries, superResolver, def)
          this.mutations = mapSuperResolverHandlers(this.mutations, superResolver, def)
          this.subscriptions = mapSuperResolverHandlers(this.subscriptions, superResolver, def)
          this.fieldResolvers = mapSuperFieldResolverHandlers(this.fieldResolvers, superResolver, def)
        }
        superResolver = Object.getPrototypeOf(superResolver)
      }
    })
  }

  private findFieldRoles(target: Function, fieldName: string): any[] | undefined {
    const authorizedField = this.authorizedFields.find(
      authField => authField.target === target && authField.fieldName === fieldName
    )
    if (!authorizedField) {
      return
    }
    return authorizedField.roles
  }

  private findExtensions(target: Function, fieldName?: string): ExtensionsMetadata {
    const storedExtensions: Array<ExtensionsClassMetadata | ExtensionsFieldMetadata> = fieldName
      ? this.fieldExtensions
      : this.classExtensions
    return storedExtensions
      .filter(
        entry =>
          (entry.target === target || entry.target.isPrototypeOf(target)) &&
          (!('fieldName' in entry) || entry.fieldName === fieldName)
      )
      .reduce((extensions, entry) => ({ ...extensions, ...entry.extensions }), {})
  }
}
