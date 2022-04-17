import { ResolverFn } from 'graphql-subscriptions'

import {
  ClassTypeResolver,
  SubscriptionFilterFunc,
  SubscriptionTopicFunc,
  TypeOptions,
  TypeValueThunk
} from '../../decorators/types'
import { ParamMetadata } from './param-metadata'
import { Middleware } from '../../interfaces/Middleware'
import { Complexity } from '../../interfaces'
import { DirectiveMetadata } from './directive-metadata'
import { ExtensionsMetadata } from './extensions-metadata'

export interface BaseResolverMetadata {
  methodName: string
  schemaName: string
  target: Function
  complexity: Complexity | undefined
  resolverClassMetadata?: ResolverClassMetadata
  params?: ParamMetadata[]
  roles?: any[]
  middlewares?: Array<Middleware<any>>
  directives?: DirectiveMetadata[]
  extensions?: ExtensionsMetadata
  description?: string
}

export interface ResolverMetadata extends BaseResolverMetadata {
  getReturnType: TypeValueThunk
  returnTypeOptions: TypeOptions
  description?: string
  deprecationReason?: string
}

export interface FieldResolverMetadata extends BaseResolverMetadata {
  kind: 'internal' | 'external'
  description?: string
  deprecationReason?: string
  getType?: TypeValueThunk
  typeOptions?: TypeOptions
  getObjectType?: ClassTypeResolver
}

export interface SubscriptionResolverMetadata extends ResolverMetadata {
  topics: string | string[] | SubscriptionTopicFunc | undefined
  filter: SubscriptionFilterFunc | undefined
  subscribe: ResolverFn | undefined
}

export interface ResolverClassMetadata {
  target: Function
  getObjectType: ClassTypeResolver
  isAbstract?: boolean
  superResolver?: ResolverClassMetadata
}
