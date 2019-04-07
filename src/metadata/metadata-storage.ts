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

  resolverClasses: ResolverClassMetadata[] = [];
  fields: FieldMetadata[] = [];
  params: ParamMetadata[] = [];

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

    this.resolverClasses = [];
    this.fields = [];
    this.params = [];
  }
}
