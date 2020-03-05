import {
  DMMF,
  DMMFClass,
  Engine,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from './runtime';

export { PrismaClientKnownRequestError }
export { PrismaClientUnknownRequestError }
export { PrismaClientRustPanicError }
export { PrismaClientInitializationError }
export { PrismaClientValidationError }

/**
 * Query Engine version: latest
 */

/**
 * Utility Types
 */

/**
 * Get the type of the value, that the Promise holds.
 */
export declare type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

/**
 * Get the return type of a function which returns a Promise.
 */
export declare type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>


export declare type Enumerable<T> = T | Array<T>;
export declare type MergeTruthyValues<R extends object, S extends object> = {
  [key in keyof S | keyof R]: key extends false ? never : key extends keyof S ? S[key] extends false ? never : S[key] : key extends keyof R ? R[key] : never;
};
export declare type CleanupNever<T> = {
  [key in keyof T]: T[key] extends never ? never : key;
}[keyof T];
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export declare type Subset<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never;
};
declare class PrismaClientFetcher {
  private readonly prisma;
  private readonly debug;
  private readonly hooks?;
  constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
  request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string, collectTimestamps?: any): Promise<T>;
  sanitizeMessage(message: string): string;
  protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
}


/**
 * Client
**/


export type Datasources = {
  db?: string
}

export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

export interface PrismaClientOptions {
  datasources?: Datasources

  /**
   * @default "pretty"
   */
  errorFormat?: ErrorFormat

  log?: Array<LogLevel | LogDefinition>

  /**
   * You probably don't want to use this. `__internal` is used by internal tooling.
   */
  __internal?: {
    debug?: boolean
    hooks?: Hooks
    engine?: {
      cwd?: string
      binaryPath?: string
    }
    measurePerformance?: boolean
  }

  /**
   * Useful for pgbouncer
   */
  forceTransactions?: boolean
}

export type Hooks = {
  beforeRequest?: (options: {query: string, path: string[], rootField?: string, typeName?: string, document: any}) => any
}

/* Types for Logging */
export type LogLevel = 'info' | 'query' | 'warn'
export type LogDefinition = {
  level: LogLevel
  emit: 'stdout' | 'event'
}

export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
export type GetEvents<T extends Array<LogLevel | LogDefinition>> = GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]>

export type QueryEvent = {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}

export type LogEvent = {
  timestamp: Date
  message: string
  target: string
}
/* End Types for Logging */

// tested in getLogLevel.test.ts
export declare function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js (ORM replacement)
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md).
 */
export declare class PrismaClient<T extends PrismaClientOptions = {}, U = keyof T extends 'log' ? T['log'] extends Array<LogLevel | LogDefinition> ? GetEvents<T['log']> : never : never> {
  /**
   * @private
   */
  private fetcher;
  /**
   * @private
   */
  private readonly dmmf;
  /**
   * @private
   */
  private connectionPromise?;
  /**
   * @private
   */
  private disconnectionPromise?;
  /**
   * @private
   */
  private readonly engineConfig;
  /**
   * @private
   */
  private readonly measurePerformance;
  /**
   * @private
   */
  private engine: Engine;
  /**
   * @private
   */
  private errorFormat: ErrorFormat;

  /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js (ORM replacement)
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md).
   */
  constructor(optionsArg?: T);
  on<V extends U>(eventType: V, callback: V extends never ? never : (event: V extends 'query' ? QueryEvent : LogEvent) => void): void;
  /**
   * Connect with the database
   */
  connect(): Promise<void>;
  /**
   * @private
   */
  private runDisconnect;
  /**
   * Disconnect from the database
   */
  disconnect(): Promise<any>;
  /**
   * Makes a raw query
   * @example
   * ```
   * // Fetch all entries from the `User` table
   * const result = await prisma.raw`SELECT * FROM User;`
   * // Or
   * const result = await prisma.raw('SELECT * FROM User;')
   * 
   * // With parameters use prisma.raw``, values will be escaped automatically
   * const userId = '1'
   * const result = await prisma.raw`SELECT * FROM User WHERE id = ${userId};`
  * ```
  * 
  * Read more in our [docs](https://github.com/prisma/prisma2/blob/master/docs/prisma-client-js/api.md#raw-database-access).
  */
  raw<T = any>(query: string | TemplateStringsArray, ...values: any[]): Promise<T>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): UserDelegate;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): PostDelegate;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): CategoryDelegate;

  /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): PatientDelegate;
}



/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export declare const OrderByArg: {
  asc: 'asc',
  desc: 'desc'
};

export declare type OrderByArg = (typeof OrderByArg)[keyof typeof OrderByArg]


export declare const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export declare type Role = (typeof Role)[keyof typeof Role]


export declare const PostKind: {
  BLOG: 'BLOG',
  ADVERT: 'ADVERT'
};

export declare type PostKind = (typeof PostKind)[keyof typeof PostKind]



/**
 * Model User
 */

export type User = {
  id: number
  email: string
  name: string | null
  age: number
  balance: number
  amount: number
  role: Role
}

export type UserScalars = 'id' | 'email' | 'name' | 'age' | 'balance' | 'amount' | 'role'
  

export type UserSelect = {
  id?: boolean
  email?: boolean
  name?: boolean
  age?: boolean
  balance?: boolean
  amount?: boolean
  posts?: boolean | FindManyPostSelectArgsOptional
  role?: boolean
}

export type UserInclude = {
  posts?: boolean | FindManyPostIncludeArgsOptional
}

type UserDefault = {
  id: true
  email: true
  name: true
  age: true
  balance: true
  amount: true
  role: true
}


export type UserGetSelectPayload<S extends boolean | UserSelect> = S extends true
  ? User
  : S extends UserSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends UserScalars
        ? User[P]
        : P extends 'posts'
        ? Array<PostGetSelectPayload<ExtractFindManyPostSelectArgs<S[P]>>>
        : never
    }
   : never

export type UserGetIncludePayload<S extends boolean | UserInclude> = S extends true
  ? User
  : S extends UserInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<UserDefault, S>>]: P extends UserScalars
        ? User[P]
        : P extends 'posts'
        ? Array<PostGetIncludePayload<ExtractFindManyPostIncludeArgs<S[P]>>>
        : never
    }
   : never

export interface UserDelegate {
  /**
   * Find zero or one User.
   * @param {FindOneUserArgs} args - Arguments to find a User
   * @example
   * // Get one User
   * const user = await prisma.user.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneUserArgs>(
    args: Subset<T, FindOneUserArgs>
  ): T extends FindOneUserArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneUserSelectArgs ? Promise<UserGetSelectPayload<ExtractFindOneUserSelectArgs<T>> | null>
  : T extends FindOneUserIncludeArgs ? Promise<UserGetIncludePayload<ExtractFindOneUserIncludeArgs<T>> | null> : UserClient<User | null>
  /**
   * Find zero or more Users.
   * @param {FindManyUserArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Users
   * const users = await prisma.user.findMany()
   * 
   * // Get first 10 Users
   * const users = await prisma.user.findMany({ first: 10 })
   * 
   * // Only select the `id`
   * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
   * 
  **/
  findMany<T extends FindManyUserArgs>(
    args?: Subset<T, FindManyUserArgs>
  ): T extends FindManyUserArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyUserSelectArgs
  ? Promise<Array<UserGetSelectPayload<ExtractFindManyUserSelectArgs<T>>>> : T extends FindManyUserIncludeArgs
  ? Promise<Array<UserGetIncludePayload<ExtractFindManyUserIncludeArgs<T>>>> : Promise<Array<User>>
  /**
   * Create a User.
   * @param {UserCreateArgs} args - Arguments to create a User.
   * @example
   * // Create one User
   * const user = await prisma.user.create({
   *   data: {
   *     // ... data to create a User
   *   }
   * })
   * 
  **/
  create<T extends UserCreateArgs>(
    args: Subset<T, UserCreateArgs>
  ): T extends UserCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectCreateArgs ? Promise<UserGetSelectPayload<ExtractUserSelectCreateArgs<T>>>
  : T extends UserIncludeCreateArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeCreateArgs<T>>> : UserClient<User>
  /**
   * Delete a User.
   * @param {UserDeleteArgs} args - Arguments to delete one User.
   * @example
   * // Delete one User
   * const user = await prisma.user.delete({
   *   where: {
   *     // ... filter to delete one User
   *   }
   * })
   * 
  **/
  delete<T extends UserDeleteArgs>(
    args: Subset<T, UserDeleteArgs>
  ): T extends UserDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectDeleteArgs ? Promise<UserGetSelectPayload<ExtractUserSelectDeleteArgs<T>>>
  : T extends UserIncludeDeleteArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeDeleteArgs<T>>> : UserClient<User>
  /**
   * Update one User.
   * @param {UserUpdateArgs} args - Arguments to update one User.
   * @example
   * // Update one User
   * const user = await prisma.user.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends UserUpdateArgs>(
    args: Subset<T, UserUpdateArgs>
  ): T extends UserUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectUpdateArgs ? Promise<UserGetSelectPayload<ExtractUserSelectUpdateArgs<T>>>
  : T extends UserIncludeUpdateArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeUpdateArgs<T>>> : UserClient<User>
  /**
   * Delete zero or more Users.
   * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
   * @example
   * // Delete a few Users
   * const { count } = await prisma.user.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends UserDeleteManyArgs>(
    args: Subset<T, UserDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Users.
   * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Users
   * const user = await prisma.user.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends UserUpdateManyArgs>(
    args: Subset<T, UserUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one User.
   * @param {UserUpsertArgs} args - Arguments to update or create a User.
   * @example
   * // Update or create a User
   * const user = await prisma.user.upsert({
   *   create: {
   *     // ... data to create a User
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the User we want to update
   *   }
   * })
  **/
  upsert<T extends UserUpsertArgs>(
    args: Subset<T, UserUpsertArgs>
  ): T extends UserUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectUpsertArgs ? Promise<UserGetSelectPayload<ExtractUserSelectUpsertArgs<T>>>
  : T extends UserIncludeUpsertArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeUpsertArgs<T>>> : UserClient<User>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class UserClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  posts<T extends FindManyPostArgs = {}>(args?: Subset<T, FindManyPostArgs>): T extends FindManyPostArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyPostSelectArgs
  ? Promise<Array<PostGetSelectPayload<ExtractFindManyPostSelectArgs<T>>>> : T extends FindManyPostIncludeArgs
  ? Promise<Array<PostGetIncludePayload<ExtractFindManyPostIncludeArgs<T>>>> : Promise<Array<Post>>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * User findOne
 */
export type FindOneUserArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type FindOneUserArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type FindOneUserSelectArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type FindOneUserSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type FindOneUserIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type FindOneUserIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter, which User to fetch.
  **/
  where: UserWhereUniqueInput
}

export type ExtractFindOneUserSelectArgs<S extends undefined | boolean | FindOneUserSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneUserSelectArgs
  ? S['select']
  : true

export type ExtractFindOneUserIncludeArgs<S extends undefined | boolean | FindOneUserIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneUserIncludeArgs
  ? S['include']
  : true



/**
 * User findMany
 */
export type FindManyUserArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type FindManyUserArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type FindManyUserSelectArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type FindManyUserSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type FindManyUserIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type FindManyUserIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter, which Users to fetch.
  **/
  where?: UserWhereInput | null
  /**
   * Determine the order of the Users to fetch.
  **/
  orderBy?: UserOrderByInput | null
  /**
   * Skip the first `n` Users.
  **/
  skip?: number | null
  /**
   * Get all Users that come after the User you provide with the current order.
  **/
  after?: UserWhereUniqueInput | null
  /**
   * Get all Users that come before the User you provide with the current order.
  **/
  before?: UserWhereUniqueInput | null
  /**
   * Get the first `n` Users.
  **/
  first?: number | null
  /**
   * Get the last `n` Users.
  **/
  last?: number | null
}

export type ExtractFindManyUserSelectArgs<S extends undefined | boolean | FindManyUserSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyUserSelectArgs
  ? S['select']
  : true

export type ExtractFindManyUserIncludeArgs<S extends undefined | boolean | FindManyUserIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyUserIncludeArgs
  ? S['include']
  : true



/**
 * User create
 */
export type UserCreateArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type UserCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type UserSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type UserSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type UserIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type UserIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The data needed to create a User.
  **/
  data: UserCreateInput
}

export type ExtractUserSelectCreateArgs<S extends undefined | boolean | UserSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserSelectCreateArgs
  ? S['select']
  : true

export type ExtractUserIncludeCreateArgs<S extends undefined | boolean | UserIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserIncludeCreateArgs
  ? S['include']
  : true



/**
 * User update
 */
export type UserUpdateArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type UserUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type UserSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type UserSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type UserIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type UserIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The data needed to update a User.
  **/
  data: UserUpdateInput
  /**
   * Choose, which User to update.
  **/
  where: UserWhereUniqueInput
}

export type ExtractUserSelectUpdateArgs<S extends undefined | boolean | UserSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserSelectUpdateArgs
  ? S['select']
  : true

export type ExtractUserIncludeUpdateArgs<S extends undefined | boolean | UserIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserIncludeUpdateArgs
  ? S['include']
  : true



/**
 * User updateMany
 */
export type UserUpdateManyArgs = {
  data: UserUpdateManyMutationInput
  where?: UserWhereInput | null
}


/**
 * User upsert
 */
export type UserUpsertArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type UserUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type UserSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type UserSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type UserIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type UserIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * The filter to search for the User to update in case it exists.
  **/
  where: UserWhereUniqueInput
  /**
   * In case the User found by the `where` argument doesn't exist, create a new User with this data.
  **/
  create: UserCreateInput
  /**
   * In case the User was found with the provided `where` argument, update it with this data.
  **/
  update: UserUpdateInput
}

export type ExtractUserSelectUpsertArgs<S extends undefined | boolean | UserSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserSelectUpsertArgs
  ? S['select']
  : true

export type ExtractUserIncludeUpsertArgs<S extends undefined | boolean | UserIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserIncludeUpsertArgs
  ? S['include']
  : true



/**
 * User delete
 */
export type UserDeleteArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type UserDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type UserSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type UserSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type UserIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type UserIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
  /**
   * Filter which User to delete.
  **/
  where: UserWhereUniqueInput
}

export type ExtractUserSelectDeleteArgs<S extends undefined | boolean | UserSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserSelectDeleteArgs
  ? S['select']
  : true

export type ExtractUserIncludeDeleteArgs<S extends undefined | boolean | UserIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserIncludeDeleteArgs
  ? S['include']
  : true



/**
 * User deleteMany
 */
export type UserDeleteManyArgs = {
  where?: UserWhereInput | null
}


/**
 * User without action
 */
export type UserArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
}

export type UserArgsRequired = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
}

export type UserSelectArgs = {
  /**
   * Select specific fields to fetch from the User
  **/
  select: UserSelect
}

export type UserSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the User
  **/
  select?: UserSelect | null
}

export type UserIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: UserInclude
}

export type UserIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: UserInclude | null
}

export type ExtractUserSelectArgs<S extends undefined | boolean | UserSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserSelectArgs
  ? S['select']
  : true

export type ExtractUserIncludeArgs<S extends undefined | boolean | UserIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends UserIncludeArgs
  ? S['include']
  : true




/**
 * Model Post
 */

export type Post = {
  uuid: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  title: string
  content: string | null
  kind: PostKind | null
}

export type PostScalars = 'uuid' | 'createdAt' | 'updatedAt' | 'published' | 'title' | 'content' | 'kind'
  

export type PostSelect = {
  uuid?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  published?: boolean
  title?: boolean
  content?: boolean
  author?: boolean | UserSelectArgsOptional
  kind?: boolean
}

export type PostInclude = {
  author?: boolean | UserIncludeArgsOptional
}

type PostDefault = {
  uuid: true
  createdAt: true
  updatedAt: true
  published: true
  title: true
  content: true
  kind: true
}


export type PostGetSelectPayload<S extends boolean | PostSelect> = S extends true
  ? Post
  : S extends PostSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends PostScalars
        ? Post[P]
        : P extends 'author'
        ? UserGetSelectPayload<ExtractUserSelectArgs<S[P]>>
        : never
    }
   : never

export type PostGetIncludePayload<S extends boolean | PostInclude> = S extends true
  ? Post
  : S extends PostInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<PostDefault, S>>]: P extends PostScalars
        ? Post[P]
        : P extends 'author'
        ? UserGetIncludePayload<ExtractUserIncludeArgs<S[P]>>
        : never
    }
   : never

export interface PostDelegate {
  /**
   * Find zero or one Post.
   * @param {FindOnePostArgs} args - Arguments to find a Post
   * @example
   * // Get one Post
   * const post = await prisma.post.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOnePostArgs>(
    args: Subset<T, FindOnePostArgs>
  ): T extends FindOnePostArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOnePostSelectArgs ? Promise<PostGetSelectPayload<ExtractFindOnePostSelectArgs<T>> | null>
  : T extends FindOnePostIncludeArgs ? Promise<PostGetIncludePayload<ExtractFindOnePostIncludeArgs<T>> | null> : PostClient<Post | null>
  /**
   * Find zero or more Posts.
   * @param {FindManyPostArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Posts
   * const posts = await prisma.post.findMany()
   * 
   * // Get first 10 Posts
   * const posts = await prisma.post.findMany({ first: 10 })
   * 
   * // Only select the `uuid`
   * const postWithUuidOnly = await prisma.post.findMany({ select: { uuid: true } })
   * 
  **/
  findMany<T extends FindManyPostArgs>(
    args?: Subset<T, FindManyPostArgs>
  ): T extends FindManyPostArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyPostSelectArgs
  ? Promise<Array<PostGetSelectPayload<ExtractFindManyPostSelectArgs<T>>>> : T extends FindManyPostIncludeArgs
  ? Promise<Array<PostGetIncludePayload<ExtractFindManyPostIncludeArgs<T>>>> : Promise<Array<Post>>
  /**
   * Create a Post.
   * @param {PostCreateArgs} args - Arguments to create a Post.
   * @example
   * // Create one Post
   * const user = await prisma.post.create({
   *   data: {
   *     // ... data to create a Post
   *   }
   * })
   * 
  **/
  create<T extends PostCreateArgs>(
    args: Subset<T, PostCreateArgs>
  ): T extends PostCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends PostSelectCreateArgs ? Promise<PostGetSelectPayload<ExtractPostSelectCreateArgs<T>>>
  : T extends PostIncludeCreateArgs ? Promise<PostGetIncludePayload<ExtractPostIncludeCreateArgs<T>>> : PostClient<Post>
  /**
   * Delete a Post.
   * @param {PostDeleteArgs} args - Arguments to delete one Post.
   * @example
   * // Delete one Post
   * const user = await prisma.post.delete({
   *   where: {
   *     // ... filter to delete one Post
   *   }
   * })
   * 
  **/
  delete<T extends PostDeleteArgs>(
    args: Subset<T, PostDeleteArgs>
  ): T extends PostDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends PostSelectDeleteArgs ? Promise<PostGetSelectPayload<ExtractPostSelectDeleteArgs<T>>>
  : T extends PostIncludeDeleteArgs ? Promise<PostGetIncludePayload<ExtractPostIncludeDeleteArgs<T>>> : PostClient<Post>
  /**
   * Update one Post.
   * @param {PostUpdateArgs} args - Arguments to update one Post.
   * @example
   * // Update one Post
   * const post = await prisma.post.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends PostUpdateArgs>(
    args: Subset<T, PostUpdateArgs>
  ): T extends PostUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends PostSelectUpdateArgs ? Promise<PostGetSelectPayload<ExtractPostSelectUpdateArgs<T>>>
  : T extends PostIncludeUpdateArgs ? Promise<PostGetIncludePayload<ExtractPostIncludeUpdateArgs<T>>> : PostClient<Post>
  /**
   * Delete zero or more Posts.
   * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
   * @example
   * // Delete a few Posts
   * const { count } = await prisma.post.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends PostDeleteManyArgs>(
    args: Subset<T, PostDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Posts.
   * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Posts
   * const post = await prisma.post.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends PostUpdateManyArgs>(
    args: Subset<T, PostUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Post.
   * @param {PostUpsertArgs} args - Arguments to update or create a Post.
   * @example
   * // Update or create a Post
   * const post = await prisma.post.upsert({
   *   create: {
   *     // ... data to create a Post
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Post we want to update
   *   }
   * })
  **/
  upsert<T extends PostUpsertArgs>(
    args: Subset<T, PostUpsertArgs>
  ): T extends PostUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends PostSelectUpsertArgs ? Promise<PostGetSelectPayload<ExtractPostSelectUpsertArgs<T>>>
  : T extends PostIncludeUpsertArgs ? Promise<PostGetIncludePayload<ExtractPostIncludeUpsertArgs<T>>> : PostClient<Post>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class PostClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';

  author<T extends UserArgs = {}>(args?: Subset<T, UserArgs>): T extends FindOneUserArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectArgs ? Promise<UserGetSelectPayload<ExtractUserSelectArgs<T>> | null>
  : T extends UserIncludeArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeArgs<T>> | null> : UserClient<User | null>;

  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Post findOne
 */
export type FindOnePostArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * Filter, which Post to fetch.
  **/
  where: PostWhereUniqueInput
}

export type FindOnePostArgsRequired = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * Filter, which Post to fetch.
  **/
  where: PostWhereUniqueInput
}

export type FindOnePostSelectArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * Filter, which Post to fetch.
  **/
  where: PostWhereUniqueInput
}

export type FindOnePostSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Filter, which Post to fetch.
  **/
  where: PostWhereUniqueInput
}

export type FindOnePostIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * Filter, which Post to fetch.
  **/
  where: PostWhereUniqueInput
}

export type FindOnePostIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * Filter, which Post to fetch.
  **/
  where: PostWhereUniqueInput
}

export type ExtractFindOnePostSelectArgs<S extends undefined | boolean | FindOnePostSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOnePostSelectArgs
  ? S['select']
  : true

export type ExtractFindOnePostIncludeArgs<S extends undefined | boolean | FindOnePostIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOnePostIncludeArgs
  ? S['include']
  : true



/**
 * Post findMany
 */
export type FindManyPostArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * Filter, which Posts to fetch.
  **/
  where?: PostWhereInput | null
  /**
   * Determine the order of the Posts to fetch.
  **/
  orderBy?: PostOrderByInput | null
  /**
   * Skip the first `n` Posts.
  **/
  skip?: number | null
  /**
   * Get all Posts that come after the Post you provide with the current order.
  **/
  after?: PostWhereUniqueInput | null
  /**
   * Get all Posts that come before the Post you provide with the current order.
  **/
  before?: PostWhereUniqueInput | null
  /**
   * Get the first `n` Posts.
  **/
  first?: number | null
  /**
   * Get the last `n` Posts.
  **/
  last?: number | null
}

export type FindManyPostArgsRequired = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * Filter, which Posts to fetch.
  **/
  where?: PostWhereInput | null
  /**
   * Determine the order of the Posts to fetch.
  **/
  orderBy?: PostOrderByInput | null
  /**
   * Skip the first `n` Posts.
  **/
  skip?: number | null
  /**
   * Get all Posts that come after the Post you provide with the current order.
  **/
  after?: PostWhereUniqueInput | null
  /**
   * Get all Posts that come before the Post you provide with the current order.
  **/
  before?: PostWhereUniqueInput | null
  /**
   * Get the first `n` Posts.
  **/
  first?: number | null
  /**
   * Get the last `n` Posts.
  **/
  last?: number | null
}

export type FindManyPostSelectArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * Filter, which Posts to fetch.
  **/
  where?: PostWhereInput | null
  /**
   * Determine the order of the Posts to fetch.
  **/
  orderBy?: PostOrderByInput | null
  /**
   * Skip the first `n` Posts.
  **/
  skip?: number | null
  /**
   * Get all Posts that come after the Post you provide with the current order.
  **/
  after?: PostWhereUniqueInput | null
  /**
   * Get all Posts that come before the Post you provide with the current order.
  **/
  before?: PostWhereUniqueInput | null
  /**
   * Get the first `n` Posts.
  **/
  first?: number | null
  /**
   * Get the last `n` Posts.
  **/
  last?: number | null
}

export type FindManyPostSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Filter, which Posts to fetch.
  **/
  where?: PostWhereInput | null
  /**
   * Determine the order of the Posts to fetch.
  **/
  orderBy?: PostOrderByInput | null
  /**
   * Skip the first `n` Posts.
  **/
  skip?: number | null
  /**
   * Get all Posts that come after the Post you provide with the current order.
  **/
  after?: PostWhereUniqueInput | null
  /**
   * Get all Posts that come before the Post you provide with the current order.
  **/
  before?: PostWhereUniqueInput | null
  /**
   * Get the first `n` Posts.
  **/
  first?: number | null
  /**
   * Get the last `n` Posts.
  **/
  last?: number | null
}

export type FindManyPostIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * Filter, which Posts to fetch.
  **/
  where?: PostWhereInput | null
  /**
   * Determine the order of the Posts to fetch.
  **/
  orderBy?: PostOrderByInput | null
  /**
   * Skip the first `n` Posts.
  **/
  skip?: number | null
  /**
   * Get all Posts that come after the Post you provide with the current order.
  **/
  after?: PostWhereUniqueInput | null
  /**
   * Get all Posts that come before the Post you provide with the current order.
  **/
  before?: PostWhereUniqueInput | null
  /**
   * Get the first `n` Posts.
  **/
  first?: number | null
  /**
   * Get the last `n` Posts.
  **/
  last?: number | null
}

export type FindManyPostIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * Filter, which Posts to fetch.
  **/
  where?: PostWhereInput | null
  /**
   * Determine the order of the Posts to fetch.
  **/
  orderBy?: PostOrderByInput | null
  /**
   * Skip the first `n` Posts.
  **/
  skip?: number | null
  /**
   * Get all Posts that come after the Post you provide with the current order.
  **/
  after?: PostWhereUniqueInput | null
  /**
   * Get all Posts that come before the Post you provide with the current order.
  **/
  before?: PostWhereUniqueInput | null
  /**
   * Get the first `n` Posts.
  **/
  first?: number | null
  /**
   * Get the last `n` Posts.
  **/
  last?: number | null
}

export type ExtractFindManyPostSelectArgs<S extends undefined | boolean | FindManyPostSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyPostSelectArgs
  ? S['select']
  : true

export type ExtractFindManyPostIncludeArgs<S extends undefined | boolean | FindManyPostIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyPostIncludeArgs
  ? S['include']
  : true



/**
 * Post create
 */
export type PostCreateArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * The data needed to create a Post.
  **/
  data: PostCreateInput
}

export type PostCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * The data needed to create a Post.
  **/
  data: PostCreateInput
}

export type PostSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * The data needed to create a Post.
  **/
  data: PostCreateInput
}

export type PostSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * The data needed to create a Post.
  **/
  data: PostCreateInput
}

export type PostIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * The data needed to create a Post.
  **/
  data: PostCreateInput
}

export type PostIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * The data needed to create a Post.
  **/
  data: PostCreateInput
}

export type ExtractPostSelectCreateArgs<S extends undefined | boolean | PostSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PostSelectCreateArgs
  ? S['select']
  : true

export type ExtractPostIncludeCreateArgs<S extends undefined | boolean | PostIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PostIncludeCreateArgs
  ? S['include']
  : true



/**
 * Post update
 */
export type PostUpdateArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * The data needed to update a Post.
  **/
  data: PostUpdateInput
  /**
   * Choose, which Post to update.
  **/
  where: PostWhereUniqueInput
}

export type PostUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * The data needed to update a Post.
  **/
  data: PostUpdateInput
  /**
   * Choose, which Post to update.
  **/
  where: PostWhereUniqueInput
}

export type PostSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * The data needed to update a Post.
  **/
  data: PostUpdateInput
  /**
   * Choose, which Post to update.
  **/
  where: PostWhereUniqueInput
}

export type PostSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * The data needed to update a Post.
  **/
  data: PostUpdateInput
  /**
   * Choose, which Post to update.
  **/
  where: PostWhereUniqueInput
}

export type PostIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * The data needed to update a Post.
  **/
  data: PostUpdateInput
  /**
   * Choose, which Post to update.
  **/
  where: PostWhereUniqueInput
}

export type PostIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * The data needed to update a Post.
  **/
  data: PostUpdateInput
  /**
   * Choose, which Post to update.
  **/
  where: PostWhereUniqueInput
}

export type ExtractPostSelectUpdateArgs<S extends undefined | boolean | PostSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PostSelectUpdateArgs
  ? S['select']
  : true

export type ExtractPostIncludeUpdateArgs<S extends undefined | boolean | PostIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PostIncludeUpdateArgs
  ? S['include']
  : true



/**
 * Post updateMany
 */
export type PostUpdateManyArgs = {
  data: PostUpdateManyMutationInput
  where?: PostWhereInput | null
}


/**
 * Post upsert
 */
export type PostUpsertArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * The filter to search for the Post to update in case it exists.
  **/
  where: PostWhereUniqueInput
  /**
   * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
  **/
  create: PostCreateInput
  /**
   * In case the Post was found with the provided `where` argument, update it with this data.
  **/
  update: PostUpdateInput
}

export type PostUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * The filter to search for the Post to update in case it exists.
  **/
  where: PostWhereUniqueInput
  /**
   * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
  **/
  create: PostCreateInput
  /**
   * In case the Post was found with the provided `where` argument, update it with this data.
  **/
  update: PostUpdateInput
}

export type PostSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * The filter to search for the Post to update in case it exists.
  **/
  where: PostWhereUniqueInput
  /**
   * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
  **/
  create: PostCreateInput
  /**
   * In case the Post was found with the provided `where` argument, update it with this data.
  **/
  update: PostUpdateInput
}

export type PostSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * The filter to search for the Post to update in case it exists.
  **/
  where: PostWhereUniqueInput
  /**
   * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
  **/
  create: PostCreateInput
  /**
   * In case the Post was found with the provided `where` argument, update it with this data.
  **/
  update: PostUpdateInput
}

export type PostIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * The filter to search for the Post to update in case it exists.
  **/
  where: PostWhereUniqueInput
  /**
   * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
  **/
  create: PostCreateInput
  /**
   * In case the Post was found with the provided `where` argument, update it with this data.
  **/
  update: PostUpdateInput
}

export type PostIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * The filter to search for the Post to update in case it exists.
  **/
  where: PostWhereUniqueInput
  /**
   * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
  **/
  create: PostCreateInput
  /**
   * In case the Post was found with the provided `where` argument, update it with this data.
  **/
  update: PostUpdateInput
}

export type ExtractPostSelectUpsertArgs<S extends undefined | boolean | PostSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PostSelectUpsertArgs
  ? S['select']
  : true

export type ExtractPostIncludeUpsertArgs<S extends undefined | boolean | PostIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PostIncludeUpsertArgs
  ? S['include']
  : true



/**
 * Post delete
 */
export type PostDeleteArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * Filter which Post to delete.
  **/
  where: PostWhereUniqueInput
}

export type PostDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * Filter which Post to delete.
  **/
  where: PostWhereUniqueInput
}

export type PostSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * Filter which Post to delete.
  **/
  where: PostWhereUniqueInput
}

export type PostSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Filter which Post to delete.
  **/
  where: PostWhereUniqueInput
}

export type PostIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
  /**
   * Filter which Post to delete.
  **/
  where: PostWhereUniqueInput
}

export type PostIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
  /**
   * Filter which Post to delete.
  **/
  where: PostWhereUniqueInput
}

export type ExtractPostSelectDeleteArgs<S extends undefined | boolean | PostSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PostSelectDeleteArgs
  ? S['select']
  : true

export type ExtractPostIncludeDeleteArgs<S extends undefined | boolean | PostIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PostIncludeDeleteArgs
  ? S['include']
  : true



/**
 * Post deleteMany
 */
export type PostDeleteManyArgs = {
  where?: PostWhereInput | null
}


/**
 * Post without action
 */
export type PostArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
}

export type PostArgsRequired = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
}

export type PostSelectArgs = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select: PostSelect
}

export type PostSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Post
  **/
  select?: PostSelect | null
}

export type PostIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PostInclude
}

export type PostIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PostInclude | null
}

export type ExtractPostSelectArgs<S extends undefined | boolean | PostSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PostSelectArgs
  ? S['select']
  : true

export type ExtractPostIncludeArgs<S extends undefined | boolean | PostIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PostIncludeArgs
  ? S['include']
  : true




/**
 * Model Category
 */

export type Category = {
  name: string
  slug: string
  number: number
}

export type CategoryScalars = 'name' | 'slug' | 'number'
  

export type CategorySelect = {
  name?: boolean
  slug?: boolean
  number?: boolean
}

export type CategoryInclude = {

}

type CategoryDefault = {
  name: true
  slug: true
  number: true
}


export type CategoryGetSelectPayload<S extends boolean | CategorySelect> = S extends true
  ? Category
  : S extends CategorySelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends CategoryScalars
        ? Category[P]
        : never
    }
   : never

export type CategoryGetIncludePayload<S extends boolean | CategoryInclude> = S extends true
  ? Category
  : S extends CategoryInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<CategoryDefault, S>>]: P extends CategoryScalars
        ? Category[P]
        : never
    }
   : never

export interface CategoryDelegate {
  /**
   * Find zero or one Category.
   * @param {FindOneCategoryArgs} args - Arguments to find a Category
   * @example
   * // Get one Category
   * const category = await prisma.category.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOneCategoryArgs>(
    args: Subset<T, FindOneCategoryArgs>
  ): T extends FindOneCategoryArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneCategorySelectArgs ? Promise<CategoryGetSelectPayload<ExtractFindOneCategorySelectArgs<T>> | null>
  : T extends FindOneCategoryIncludeArgs ? Promise<CategoryGetIncludePayload<ExtractFindOneCategoryIncludeArgs<T>> | null> : CategoryClient<Category | null>
  /**
   * Find zero or more Categories.
   * @param {FindManyCategoryArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Categories
   * const categories = await prisma.category.findMany()
   * 
   * // Get first 10 Categories
   * const categories = await prisma.category.findMany({ first: 10 })
   * 
   * // Only select the `name`
   * const categoryWithNameOnly = await prisma.category.findMany({ select: { name: true } })
   * 
  **/
  findMany<T extends FindManyCategoryArgs>(
    args?: Subset<T, FindManyCategoryArgs>
  ): T extends FindManyCategoryArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyCategorySelectArgs
  ? Promise<Array<CategoryGetSelectPayload<ExtractFindManyCategorySelectArgs<T>>>> : T extends FindManyCategoryIncludeArgs
  ? Promise<Array<CategoryGetIncludePayload<ExtractFindManyCategoryIncludeArgs<T>>>> : Promise<Array<Category>>
  /**
   * Create a Category.
   * @param {CategoryCreateArgs} args - Arguments to create a Category.
   * @example
   * // Create one Category
   * const user = await prisma.category.create({
   *   data: {
   *     // ... data to create a Category
   *   }
   * })
   * 
  **/
  create<T extends CategoryCreateArgs>(
    args: Subset<T, CategoryCreateArgs>
  ): T extends CategoryCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends CategorySelectCreateArgs ? Promise<CategoryGetSelectPayload<ExtractCategorySelectCreateArgs<T>>>
  : T extends CategoryIncludeCreateArgs ? Promise<CategoryGetIncludePayload<ExtractCategoryIncludeCreateArgs<T>>> : CategoryClient<Category>
  /**
   * Delete a Category.
   * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
   * @example
   * // Delete one Category
   * const user = await prisma.category.delete({
   *   where: {
   *     // ... filter to delete one Category
   *   }
   * })
   * 
  **/
  delete<T extends CategoryDeleteArgs>(
    args: Subset<T, CategoryDeleteArgs>
  ): T extends CategoryDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends CategorySelectDeleteArgs ? Promise<CategoryGetSelectPayload<ExtractCategorySelectDeleteArgs<T>>>
  : T extends CategoryIncludeDeleteArgs ? Promise<CategoryGetIncludePayload<ExtractCategoryIncludeDeleteArgs<T>>> : CategoryClient<Category>
  /**
   * Update one Category.
   * @param {CategoryUpdateArgs} args - Arguments to update one Category.
   * @example
   * // Update one Category
   * const category = await prisma.category.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends CategoryUpdateArgs>(
    args: Subset<T, CategoryUpdateArgs>
  ): T extends CategoryUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends CategorySelectUpdateArgs ? Promise<CategoryGetSelectPayload<ExtractCategorySelectUpdateArgs<T>>>
  : T extends CategoryIncludeUpdateArgs ? Promise<CategoryGetIncludePayload<ExtractCategoryIncludeUpdateArgs<T>>> : CategoryClient<Category>
  /**
   * Delete zero or more Categories.
   * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
   * @example
   * // Delete a few Categories
   * const { count } = await prisma.category.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends CategoryDeleteManyArgs>(
    args: Subset<T, CategoryDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Categories.
   * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Categories
   * const category = await prisma.category.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends CategoryUpdateManyArgs>(
    args: Subset<T, CategoryUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Category.
   * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
   * @example
   * // Update or create a Category
   * const category = await prisma.category.upsert({
   *   create: {
   *     // ... data to create a Category
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Category we want to update
   *   }
   * })
  **/
  upsert<T extends CategoryUpsertArgs>(
    args: Subset<T, CategoryUpsertArgs>
  ): T extends CategoryUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends CategorySelectUpsertArgs ? Promise<CategoryGetSelectPayload<ExtractCategorySelectUpsertArgs<T>>>
  : T extends CategoryIncludeUpsertArgs ? Promise<CategoryGetIncludePayload<ExtractCategoryIncludeUpsertArgs<T>>> : CategoryClient<Category>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class CategoryClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';


  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Category findOne
 */
export type FindOneCategoryArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * Filter, which Category to fetch.
  **/
  where: CategoryWhereUniqueInput
}

export type FindOneCategoryArgsRequired = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * Filter, which Category to fetch.
  **/
  where: CategoryWhereUniqueInput
}

export type FindOneCategorySelectArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * Filter, which Category to fetch.
  **/
  where: CategoryWhereUniqueInput
}

export type FindOneCategorySelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Filter, which Category to fetch.
  **/
  where: CategoryWhereUniqueInput
}

export type FindOneCategoryIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * Filter, which Category to fetch.
  **/
  where: CategoryWhereUniqueInput
}

export type FindOneCategoryIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * Filter, which Category to fetch.
  **/
  where: CategoryWhereUniqueInput
}

export type ExtractFindOneCategorySelectArgs<S extends undefined | boolean | FindOneCategorySelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneCategorySelectArgs
  ? S['select']
  : true

export type ExtractFindOneCategoryIncludeArgs<S extends undefined | boolean | FindOneCategoryIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOneCategoryIncludeArgs
  ? S['include']
  : true



/**
 * Category findMany
 */
export type FindManyCategoryArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * Filter, which Categories to fetch.
  **/
  where?: CategoryWhereInput | null
  /**
   * Determine the order of the Categories to fetch.
  **/
  orderBy?: CategoryOrderByInput | null
  /**
   * Skip the first `n` Categories.
  **/
  skip?: number | null
  /**
   * Get all Categories that come after the Category you provide with the current order.
  **/
  after?: CategoryWhereUniqueInput | null
  /**
   * Get all Categories that come before the Category you provide with the current order.
  **/
  before?: CategoryWhereUniqueInput | null
  /**
   * Get the first `n` Categories.
  **/
  first?: number | null
  /**
   * Get the last `n` Categories.
  **/
  last?: number | null
}

export type FindManyCategoryArgsRequired = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * Filter, which Categories to fetch.
  **/
  where?: CategoryWhereInput | null
  /**
   * Determine the order of the Categories to fetch.
  **/
  orderBy?: CategoryOrderByInput | null
  /**
   * Skip the first `n` Categories.
  **/
  skip?: number | null
  /**
   * Get all Categories that come after the Category you provide with the current order.
  **/
  after?: CategoryWhereUniqueInput | null
  /**
   * Get all Categories that come before the Category you provide with the current order.
  **/
  before?: CategoryWhereUniqueInput | null
  /**
   * Get the first `n` Categories.
  **/
  first?: number | null
  /**
   * Get the last `n` Categories.
  **/
  last?: number | null
}

export type FindManyCategorySelectArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * Filter, which Categories to fetch.
  **/
  where?: CategoryWhereInput | null
  /**
   * Determine the order of the Categories to fetch.
  **/
  orderBy?: CategoryOrderByInput | null
  /**
   * Skip the first `n` Categories.
  **/
  skip?: number | null
  /**
   * Get all Categories that come after the Category you provide with the current order.
  **/
  after?: CategoryWhereUniqueInput | null
  /**
   * Get all Categories that come before the Category you provide with the current order.
  **/
  before?: CategoryWhereUniqueInput | null
  /**
   * Get the first `n` Categories.
  **/
  first?: number | null
  /**
   * Get the last `n` Categories.
  **/
  last?: number | null
}

export type FindManyCategorySelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Filter, which Categories to fetch.
  **/
  where?: CategoryWhereInput | null
  /**
   * Determine the order of the Categories to fetch.
  **/
  orderBy?: CategoryOrderByInput | null
  /**
   * Skip the first `n` Categories.
  **/
  skip?: number | null
  /**
   * Get all Categories that come after the Category you provide with the current order.
  **/
  after?: CategoryWhereUniqueInput | null
  /**
   * Get all Categories that come before the Category you provide with the current order.
  **/
  before?: CategoryWhereUniqueInput | null
  /**
   * Get the first `n` Categories.
  **/
  first?: number | null
  /**
   * Get the last `n` Categories.
  **/
  last?: number | null
}

export type FindManyCategoryIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * Filter, which Categories to fetch.
  **/
  where?: CategoryWhereInput | null
  /**
   * Determine the order of the Categories to fetch.
  **/
  orderBy?: CategoryOrderByInput | null
  /**
   * Skip the first `n` Categories.
  **/
  skip?: number | null
  /**
   * Get all Categories that come after the Category you provide with the current order.
  **/
  after?: CategoryWhereUniqueInput | null
  /**
   * Get all Categories that come before the Category you provide with the current order.
  **/
  before?: CategoryWhereUniqueInput | null
  /**
   * Get the first `n` Categories.
  **/
  first?: number | null
  /**
   * Get the last `n` Categories.
  **/
  last?: number | null
}

export type FindManyCategoryIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * Filter, which Categories to fetch.
  **/
  where?: CategoryWhereInput | null
  /**
   * Determine the order of the Categories to fetch.
  **/
  orderBy?: CategoryOrderByInput | null
  /**
   * Skip the first `n` Categories.
  **/
  skip?: number | null
  /**
   * Get all Categories that come after the Category you provide with the current order.
  **/
  after?: CategoryWhereUniqueInput | null
  /**
   * Get all Categories that come before the Category you provide with the current order.
  **/
  before?: CategoryWhereUniqueInput | null
  /**
   * Get the first `n` Categories.
  **/
  first?: number | null
  /**
   * Get the last `n` Categories.
  **/
  last?: number | null
}

export type ExtractFindManyCategorySelectArgs<S extends undefined | boolean | FindManyCategorySelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyCategorySelectArgs
  ? S['select']
  : true

export type ExtractFindManyCategoryIncludeArgs<S extends undefined | boolean | FindManyCategoryIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyCategoryIncludeArgs
  ? S['include']
  : true



/**
 * Category create
 */
export type CategoryCreateArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * The data needed to create a Category.
  **/
  data: CategoryCreateInput
}

export type CategoryCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * The data needed to create a Category.
  **/
  data: CategoryCreateInput
}

export type CategorySelectCreateArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * The data needed to create a Category.
  **/
  data: CategoryCreateInput
}

export type CategorySelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * The data needed to create a Category.
  **/
  data: CategoryCreateInput
}

export type CategoryIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * The data needed to create a Category.
  **/
  data: CategoryCreateInput
}

export type CategoryIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * The data needed to create a Category.
  **/
  data: CategoryCreateInput
}

export type ExtractCategorySelectCreateArgs<S extends undefined | boolean | CategorySelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends CategorySelectCreateArgs
  ? S['select']
  : true

export type ExtractCategoryIncludeCreateArgs<S extends undefined | boolean | CategoryIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends CategoryIncludeCreateArgs
  ? S['include']
  : true



/**
 * Category update
 */
export type CategoryUpdateArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * The data needed to update a Category.
  **/
  data: CategoryUpdateInput
  /**
   * Choose, which Category to update.
  **/
  where: CategoryWhereUniqueInput
}

export type CategoryUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * The data needed to update a Category.
  **/
  data: CategoryUpdateInput
  /**
   * Choose, which Category to update.
  **/
  where: CategoryWhereUniqueInput
}

export type CategorySelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * The data needed to update a Category.
  **/
  data: CategoryUpdateInput
  /**
   * Choose, which Category to update.
  **/
  where: CategoryWhereUniqueInput
}

export type CategorySelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * The data needed to update a Category.
  **/
  data: CategoryUpdateInput
  /**
   * Choose, which Category to update.
  **/
  where: CategoryWhereUniqueInput
}

export type CategoryIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * The data needed to update a Category.
  **/
  data: CategoryUpdateInput
  /**
   * Choose, which Category to update.
  **/
  where: CategoryWhereUniqueInput
}

export type CategoryIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * The data needed to update a Category.
  **/
  data: CategoryUpdateInput
  /**
   * Choose, which Category to update.
  **/
  where: CategoryWhereUniqueInput
}

export type ExtractCategorySelectUpdateArgs<S extends undefined | boolean | CategorySelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends CategorySelectUpdateArgs
  ? S['select']
  : true

export type ExtractCategoryIncludeUpdateArgs<S extends undefined | boolean | CategoryIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends CategoryIncludeUpdateArgs
  ? S['include']
  : true



/**
 * Category updateMany
 */
export type CategoryUpdateManyArgs = {
  data: CategoryUpdateManyMutationInput
  where?: CategoryWhereInput | null
}


/**
 * Category upsert
 */
export type CategoryUpsertArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * The filter to search for the Category to update in case it exists.
  **/
  where: CategoryWhereUniqueInput
  /**
   * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
  **/
  create: CategoryCreateInput
  /**
   * In case the Category was found with the provided `where` argument, update it with this data.
  **/
  update: CategoryUpdateInput
}

export type CategoryUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * The filter to search for the Category to update in case it exists.
  **/
  where: CategoryWhereUniqueInput
  /**
   * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
  **/
  create: CategoryCreateInput
  /**
   * In case the Category was found with the provided `where` argument, update it with this data.
  **/
  update: CategoryUpdateInput
}

export type CategorySelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * The filter to search for the Category to update in case it exists.
  **/
  where: CategoryWhereUniqueInput
  /**
   * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
  **/
  create: CategoryCreateInput
  /**
   * In case the Category was found with the provided `where` argument, update it with this data.
  **/
  update: CategoryUpdateInput
}

export type CategorySelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * The filter to search for the Category to update in case it exists.
  **/
  where: CategoryWhereUniqueInput
  /**
   * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
  **/
  create: CategoryCreateInput
  /**
   * In case the Category was found with the provided `where` argument, update it with this data.
  **/
  update: CategoryUpdateInput
}

export type CategoryIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * The filter to search for the Category to update in case it exists.
  **/
  where: CategoryWhereUniqueInput
  /**
   * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
  **/
  create: CategoryCreateInput
  /**
   * In case the Category was found with the provided `where` argument, update it with this data.
  **/
  update: CategoryUpdateInput
}

export type CategoryIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * The filter to search for the Category to update in case it exists.
  **/
  where: CategoryWhereUniqueInput
  /**
   * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
  **/
  create: CategoryCreateInput
  /**
   * In case the Category was found with the provided `where` argument, update it with this data.
  **/
  update: CategoryUpdateInput
}

export type ExtractCategorySelectUpsertArgs<S extends undefined | boolean | CategorySelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends CategorySelectUpsertArgs
  ? S['select']
  : true

export type ExtractCategoryIncludeUpsertArgs<S extends undefined | boolean | CategoryIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends CategoryIncludeUpsertArgs
  ? S['include']
  : true



/**
 * Category delete
 */
export type CategoryDeleteArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * Filter which Category to delete.
  **/
  where: CategoryWhereUniqueInput
}

export type CategoryDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * Filter which Category to delete.
  **/
  where: CategoryWhereUniqueInput
}

export type CategorySelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * Filter which Category to delete.
  **/
  where: CategoryWhereUniqueInput
}

export type CategorySelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Filter which Category to delete.
  **/
  where: CategoryWhereUniqueInput
}

export type CategoryIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
  /**
   * Filter which Category to delete.
  **/
  where: CategoryWhereUniqueInput
}

export type CategoryIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
  /**
   * Filter which Category to delete.
  **/
  where: CategoryWhereUniqueInput
}

export type ExtractCategorySelectDeleteArgs<S extends undefined | boolean | CategorySelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends CategorySelectDeleteArgs
  ? S['select']
  : true

export type ExtractCategoryIncludeDeleteArgs<S extends undefined | boolean | CategoryIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends CategoryIncludeDeleteArgs
  ? S['include']
  : true



/**
 * Category deleteMany
 */
export type CategoryDeleteManyArgs = {
  where?: CategoryWhereInput | null
}


/**
 * Category without action
 */
export type CategoryArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
}

export type CategoryArgsRequired = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
}

export type CategorySelectArgs = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select: CategorySelect
}

export type CategorySelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Category
  **/
  select?: CategorySelect | null
}

export type CategoryIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: CategoryInclude
}

export type CategoryIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: CategoryInclude | null
}

export type ExtractCategorySelectArgs<S extends undefined | boolean | CategorySelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends CategorySelectArgs
  ? S['select']
  : true

export type ExtractCategoryIncludeArgs<S extends undefined | boolean | CategoryIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends CategoryIncludeArgs
  ? S['include']
  : true




/**
 * Model Patient
 */

export type Patient = {
  firstName: string
  lastName: string
  email: string
}

export type PatientScalars = 'firstName' | 'lastName' | 'email'
  

export type PatientSelect = {
  firstName?: boolean
  lastName?: boolean
  email?: boolean
}

export type PatientInclude = {

}

type PatientDefault = {
  firstName: true
  lastName: true
  email: true
}


export type PatientGetSelectPayload<S extends boolean | PatientSelect> = S extends true
  ? Patient
  : S extends PatientSelect
  ? {
      [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends PatientScalars
        ? Patient[P]
        : never
    }
   : never

export type PatientGetIncludePayload<S extends boolean | PatientInclude> = S extends true
  ? Patient
  : S extends PatientInclude
  ? {
      [P in CleanupNever<MergeTruthyValues<PatientDefault, S>>]: P extends PatientScalars
        ? Patient[P]
        : never
    }
   : never

export interface PatientDelegate {
  /**
   * Find zero or one Patient.
   * @param {FindOnePatientArgs} args - Arguments to find a Patient
   * @example
   * // Get one Patient
   * const patient = await prisma.patient.findOne({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
  **/
  findOne<T extends FindOnePatientArgs>(
    args: Subset<T, FindOnePatientArgs>
  ): T extends FindOnePatientArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOnePatientSelectArgs ? Promise<PatientGetSelectPayload<ExtractFindOnePatientSelectArgs<T>> | null>
  : T extends FindOnePatientIncludeArgs ? Promise<PatientGetIncludePayload<ExtractFindOnePatientIncludeArgs<T>> | null> : PatientClient<Patient | null>
  /**
   * Find zero or more Patients.
   * @param {FindManyPatientArgs=} args - Arguments to filter and select certain fields only.
   * @example
   * // Get all Patients
   * const patients = await prisma.patient.findMany()
   * 
   * // Get first 10 Patients
   * const patients = await prisma.patient.findMany({ first: 10 })
   * 
   * // Only select the `firstName`
   * const patientWithFirstNameOnly = await prisma.patient.findMany({ select: { firstName: true } })
   * 
  **/
  findMany<T extends FindManyPatientArgs>(
    args?: Subset<T, FindManyPatientArgs>
  ): T extends FindManyPatientArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyPatientSelectArgs
  ? Promise<Array<PatientGetSelectPayload<ExtractFindManyPatientSelectArgs<T>>>> : T extends FindManyPatientIncludeArgs
  ? Promise<Array<PatientGetIncludePayload<ExtractFindManyPatientIncludeArgs<T>>>> : Promise<Array<Patient>>
  /**
   * Create a Patient.
   * @param {PatientCreateArgs} args - Arguments to create a Patient.
   * @example
   * // Create one Patient
   * const user = await prisma.patient.create({
   *   data: {
   *     // ... data to create a Patient
   *   }
   * })
   * 
  **/
  create<T extends PatientCreateArgs>(
    args: Subset<T, PatientCreateArgs>
  ): T extends PatientCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends PatientSelectCreateArgs ? Promise<PatientGetSelectPayload<ExtractPatientSelectCreateArgs<T>>>
  : T extends PatientIncludeCreateArgs ? Promise<PatientGetIncludePayload<ExtractPatientIncludeCreateArgs<T>>> : PatientClient<Patient>
  /**
   * Delete a Patient.
   * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
   * @example
   * // Delete one Patient
   * const user = await prisma.patient.delete({
   *   where: {
   *     // ... filter to delete one Patient
   *   }
   * })
   * 
  **/
  delete<T extends PatientDeleteArgs>(
    args: Subset<T, PatientDeleteArgs>
  ): T extends PatientDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends PatientSelectDeleteArgs ? Promise<PatientGetSelectPayload<ExtractPatientSelectDeleteArgs<T>>>
  : T extends PatientIncludeDeleteArgs ? Promise<PatientGetIncludePayload<ExtractPatientIncludeDeleteArgs<T>>> : PatientClient<Patient>
  /**
   * Update one Patient.
   * @param {PatientUpdateArgs} args - Arguments to update one Patient.
   * @example
   * // Update one Patient
   * const patient = await prisma.patient.update({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  update<T extends PatientUpdateArgs>(
    args: Subset<T, PatientUpdateArgs>
  ): T extends PatientUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends PatientSelectUpdateArgs ? Promise<PatientGetSelectPayload<ExtractPatientSelectUpdateArgs<T>>>
  : T extends PatientIncludeUpdateArgs ? Promise<PatientGetIncludePayload<ExtractPatientIncludeUpdateArgs<T>>> : PatientClient<Patient>
  /**
   * Delete zero or more Patients.
   * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
   * @example
   * // Delete a few Patients
   * const { count } = await prisma.patient.deleteMany({
   *   where: {
   *     // ... provide filter here
   *   }
   * })
   * 
  **/
  deleteMany<T extends PatientDeleteManyArgs>(
    args: Subset<T, PatientDeleteManyArgs>
  ): Promise<BatchPayload>
  /**
   * Update zero or more Patients.
   * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
   * @example
   * // Update many Patients
   * const patient = await prisma.patient.updateMany({
   *   where: {
   *     // ... provide filter here
   *   },
   *   data: {
   *     // ... provider data here
   *   }
   * })
   * 
  **/
  updateMany<T extends PatientUpdateManyArgs>(
    args: Subset<T, PatientUpdateManyArgs>
  ): Promise<BatchPayload>
  /**
   * Create or update one Patient.
   * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
   * @example
   * // Update or create a Patient
   * const patient = await prisma.patient.upsert({
   *   create: {
   *     // ... data to create a Patient
   *   },
   *   update: {
   *     // ... in case it already exists, update
   *   },
   *   where: {
   *     // ... the filter for the Patient we want to update
   *   }
   * })
  **/
  upsert<T extends PatientUpsertArgs>(
    args: Subset<T, PatientUpsertArgs>
  ): T extends PatientUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends PatientSelectUpsertArgs ? Promise<PatientGetSelectPayload<ExtractPatientSelectUpsertArgs<T>>>
  : T extends PatientIncludeUpsertArgs ? Promise<PatientGetIncludePayload<ExtractPatientIncludeUpsertArgs<T>>> : PatientClient<Patient>
  /**
   * 
   */
  count(): Promise<number>
}

export declare class PatientClient<T> implements Promise<T> {
  private readonly _dmmf;
  private readonly _fetcher;
  private readonly _queryType;
  private readonly _rootField;
  private readonly _clientMethod;
  private readonly _args;
  private readonly _dataPath;
  private readonly _errorFormat;
  private readonly _measurePerformance?;
  private _isList;
  private _callsite;
  private _requestPromise?;
  private _collectTimestamps?;
  constructor(_dmmf: DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
  readonly [Symbol.toStringTag]: 'PrismaClientPromise';


  private get _document();
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
  /**
   * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
   * resolved value cannot be modified from the callback.
   * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
   * @returns A Promise for the completion of the callback.
   */
  finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}

// Custom InputTypes

/**
 * Patient findOne
 */
export type FindOnePatientArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * Filter, which Patient to fetch.
  **/
  where: PatientWhereUniqueInput
}

export type FindOnePatientArgsRequired = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * Filter, which Patient to fetch.
  **/
  where: PatientWhereUniqueInput
}

export type FindOnePatientSelectArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * Filter, which Patient to fetch.
  **/
  where: PatientWhereUniqueInput
}

export type FindOnePatientSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Filter, which Patient to fetch.
  **/
  where: PatientWhereUniqueInput
}

export type FindOnePatientIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * Filter, which Patient to fetch.
  **/
  where: PatientWhereUniqueInput
}

export type FindOnePatientIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * Filter, which Patient to fetch.
  **/
  where: PatientWhereUniqueInput
}

export type ExtractFindOnePatientSelectArgs<S extends undefined | boolean | FindOnePatientSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOnePatientSelectArgs
  ? S['select']
  : true

export type ExtractFindOnePatientIncludeArgs<S extends undefined | boolean | FindOnePatientIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindOnePatientIncludeArgs
  ? S['include']
  : true



/**
 * Patient findMany
 */
export type FindManyPatientArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * Filter, which Patients to fetch.
  **/
  where?: PatientWhereInput | null
  /**
   * Determine the order of the Patients to fetch.
  **/
  orderBy?: PatientOrderByInput | null
  /**
   * Skip the first `n` Patients.
  **/
  skip?: number | null
  /**
   * Get all Patients that come after the Patient you provide with the current order.
  **/
  after?: PatientWhereUniqueInput | null
  /**
   * Get all Patients that come before the Patient you provide with the current order.
  **/
  before?: PatientWhereUniqueInput | null
  /**
   * Get the first `n` Patients.
  **/
  first?: number | null
  /**
   * Get the last `n` Patients.
  **/
  last?: number | null
}

export type FindManyPatientArgsRequired = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * Filter, which Patients to fetch.
  **/
  where?: PatientWhereInput | null
  /**
   * Determine the order of the Patients to fetch.
  **/
  orderBy?: PatientOrderByInput | null
  /**
   * Skip the first `n` Patients.
  **/
  skip?: number | null
  /**
   * Get all Patients that come after the Patient you provide with the current order.
  **/
  after?: PatientWhereUniqueInput | null
  /**
   * Get all Patients that come before the Patient you provide with the current order.
  **/
  before?: PatientWhereUniqueInput | null
  /**
   * Get the first `n` Patients.
  **/
  first?: number | null
  /**
   * Get the last `n` Patients.
  **/
  last?: number | null
}

export type FindManyPatientSelectArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * Filter, which Patients to fetch.
  **/
  where?: PatientWhereInput | null
  /**
   * Determine the order of the Patients to fetch.
  **/
  orderBy?: PatientOrderByInput | null
  /**
   * Skip the first `n` Patients.
  **/
  skip?: number | null
  /**
   * Get all Patients that come after the Patient you provide with the current order.
  **/
  after?: PatientWhereUniqueInput | null
  /**
   * Get all Patients that come before the Patient you provide with the current order.
  **/
  before?: PatientWhereUniqueInput | null
  /**
   * Get the first `n` Patients.
  **/
  first?: number | null
  /**
   * Get the last `n` Patients.
  **/
  last?: number | null
}

export type FindManyPatientSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Filter, which Patients to fetch.
  **/
  where?: PatientWhereInput | null
  /**
   * Determine the order of the Patients to fetch.
  **/
  orderBy?: PatientOrderByInput | null
  /**
   * Skip the first `n` Patients.
  **/
  skip?: number | null
  /**
   * Get all Patients that come after the Patient you provide with the current order.
  **/
  after?: PatientWhereUniqueInput | null
  /**
   * Get all Patients that come before the Patient you provide with the current order.
  **/
  before?: PatientWhereUniqueInput | null
  /**
   * Get the first `n` Patients.
  **/
  first?: number | null
  /**
   * Get the last `n` Patients.
  **/
  last?: number | null
}

export type FindManyPatientIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * Filter, which Patients to fetch.
  **/
  where?: PatientWhereInput | null
  /**
   * Determine the order of the Patients to fetch.
  **/
  orderBy?: PatientOrderByInput | null
  /**
   * Skip the first `n` Patients.
  **/
  skip?: number | null
  /**
   * Get all Patients that come after the Patient you provide with the current order.
  **/
  after?: PatientWhereUniqueInput | null
  /**
   * Get all Patients that come before the Patient you provide with the current order.
  **/
  before?: PatientWhereUniqueInput | null
  /**
   * Get the first `n` Patients.
  **/
  first?: number | null
  /**
   * Get the last `n` Patients.
  **/
  last?: number | null
}

export type FindManyPatientIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * Filter, which Patients to fetch.
  **/
  where?: PatientWhereInput | null
  /**
   * Determine the order of the Patients to fetch.
  **/
  orderBy?: PatientOrderByInput | null
  /**
   * Skip the first `n` Patients.
  **/
  skip?: number | null
  /**
   * Get all Patients that come after the Patient you provide with the current order.
  **/
  after?: PatientWhereUniqueInput | null
  /**
   * Get all Patients that come before the Patient you provide with the current order.
  **/
  before?: PatientWhereUniqueInput | null
  /**
   * Get the first `n` Patients.
  **/
  first?: number | null
  /**
   * Get the last `n` Patients.
  **/
  last?: number | null
}

export type ExtractFindManyPatientSelectArgs<S extends undefined | boolean | FindManyPatientSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyPatientSelectArgs
  ? S['select']
  : true

export type ExtractFindManyPatientIncludeArgs<S extends undefined | boolean | FindManyPatientIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends FindManyPatientIncludeArgs
  ? S['include']
  : true



/**
 * Patient create
 */
export type PatientCreateArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * The data needed to create a Patient.
  **/
  data: PatientCreateInput
}

export type PatientCreateArgsRequired = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * The data needed to create a Patient.
  **/
  data: PatientCreateInput
}

export type PatientSelectCreateArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * The data needed to create a Patient.
  **/
  data: PatientCreateInput
}

export type PatientSelectCreateArgsOptional = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * The data needed to create a Patient.
  **/
  data: PatientCreateInput
}

export type PatientIncludeCreateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * The data needed to create a Patient.
  **/
  data: PatientCreateInput
}

export type PatientIncludeCreateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * The data needed to create a Patient.
  **/
  data: PatientCreateInput
}

export type ExtractPatientSelectCreateArgs<S extends undefined | boolean | PatientSelectCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PatientSelectCreateArgs
  ? S['select']
  : true

export type ExtractPatientIncludeCreateArgs<S extends undefined | boolean | PatientIncludeCreateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PatientIncludeCreateArgs
  ? S['include']
  : true



/**
 * Patient update
 */
export type PatientUpdateArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * The data needed to update a Patient.
  **/
  data: PatientUpdateInput
  /**
   * Choose, which Patient to update.
  **/
  where: PatientWhereUniqueInput
}

export type PatientUpdateArgsRequired = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * The data needed to update a Patient.
  **/
  data: PatientUpdateInput
  /**
   * Choose, which Patient to update.
  **/
  where: PatientWhereUniqueInput
}

export type PatientSelectUpdateArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * The data needed to update a Patient.
  **/
  data: PatientUpdateInput
  /**
   * Choose, which Patient to update.
  **/
  where: PatientWhereUniqueInput
}

export type PatientSelectUpdateArgsOptional = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * The data needed to update a Patient.
  **/
  data: PatientUpdateInput
  /**
   * Choose, which Patient to update.
  **/
  where: PatientWhereUniqueInput
}

export type PatientIncludeUpdateArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * The data needed to update a Patient.
  **/
  data: PatientUpdateInput
  /**
   * Choose, which Patient to update.
  **/
  where: PatientWhereUniqueInput
}

export type PatientIncludeUpdateArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * The data needed to update a Patient.
  **/
  data: PatientUpdateInput
  /**
   * Choose, which Patient to update.
  **/
  where: PatientWhereUniqueInput
}

export type ExtractPatientSelectUpdateArgs<S extends undefined | boolean | PatientSelectUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PatientSelectUpdateArgs
  ? S['select']
  : true

export type ExtractPatientIncludeUpdateArgs<S extends undefined | boolean | PatientIncludeUpdateArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PatientIncludeUpdateArgs
  ? S['include']
  : true



/**
 * Patient updateMany
 */
export type PatientUpdateManyArgs = {
  data: PatientUpdateManyMutationInput
  where?: PatientWhereInput | null
}


/**
 * Patient upsert
 */
export type PatientUpsertArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * The filter to search for the Patient to update in case it exists.
  **/
  where: PatientWhereUniqueInput
  /**
   * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
  **/
  create: PatientCreateInput
  /**
   * In case the Patient was found with the provided `where` argument, update it with this data.
  **/
  update: PatientUpdateInput
}

export type PatientUpsertArgsRequired = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * The filter to search for the Patient to update in case it exists.
  **/
  where: PatientWhereUniqueInput
  /**
   * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
  **/
  create: PatientCreateInput
  /**
   * In case the Patient was found with the provided `where` argument, update it with this data.
  **/
  update: PatientUpdateInput
}

export type PatientSelectUpsertArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * The filter to search for the Patient to update in case it exists.
  **/
  where: PatientWhereUniqueInput
  /**
   * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
  **/
  create: PatientCreateInput
  /**
   * In case the Patient was found with the provided `where` argument, update it with this data.
  **/
  update: PatientUpdateInput
}

export type PatientSelectUpsertArgsOptional = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * The filter to search for the Patient to update in case it exists.
  **/
  where: PatientWhereUniqueInput
  /**
   * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
  **/
  create: PatientCreateInput
  /**
   * In case the Patient was found with the provided `where` argument, update it with this data.
  **/
  update: PatientUpdateInput
}

export type PatientIncludeUpsertArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * The filter to search for the Patient to update in case it exists.
  **/
  where: PatientWhereUniqueInput
  /**
   * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
  **/
  create: PatientCreateInput
  /**
   * In case the Patient was found with the provided `where` argument, update it with this data.
  **/
  update: PatientUpdateInput
}

export type PatientIncludeUpsertArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * The filter to search for the Patient to update in case it exists.
  **/
  where: PatientWhereUniqueInput
  /**
   * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
  **/
  create: PatientCreateInput
  /**
   * In case the Patient was found with the provided `where` argument, update it with this data.
  **/
  update: PatientUpdateInput
}

export type ExtractPatientSelectUpsertArgs<S extends undefined | boolean | PatientSelectUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PatientSelectUpsertArgs
  ? S['select']
  : true

export type ExtractPatientIncludeUpsertArgs<S extends undefined | boolean | PatientIncludeUpsertArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PatientIncludeUpsertArgs
  ? S['include']
  : true



/**
 * Patient delete
 */
export type PatientDeleteArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * Filter which Patient to delete.
  **/
  where: PatientWhereUniqueInput
}

export type PatientDeleteArgsRequired = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * Filter which Patient to delete.
  **/
  where: PatientWhereUniqueInput
}

export type PatientSelectDeleteArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * Filter which Patient to delete.
  **/
  where: PatientWhereUniqueInput
}

export type PatientSelectDeleteArgsOptional = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Filter which Patient to delete.
  **/
  where: PatientWhereUniqueInput
}

export type PatientIncludeDeleteArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
  /**
   * Filter which Patient to delete.
  **/
  where: PatientWhereUniqueInput
}

export type PatientIncludeDeleteArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
  /**
   * Filter which Patient to delete.
  **/
  where: PatientWhereUniqueInput
}

export type ExtractPatientSelectDeleteArgs<S extends undefined | boolean | PatientSelectDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PatientSelectDeleteArgs
  ? S['select']
  : true

export type ExtractPatientIncludeDeleteArgs<S extends undefined | boolean | PatientIncludeDeleteArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PatientIncludeDeleteArgs
  ? S['include']
  : true



/**
 * Patient deleteMany
 */
export type PatientDeleteManyArgs = {
  where?: PatientWhereInput | null
}


/**
 * Patient without action
 */
export type PatientArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
}

export type PatientArgsRequired = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
}

export type PatientSelectArgs = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select: PatientSelect
}

export type PatientSelectArgsOptional = {
  /**
   * Select specific fields to fetch from the Patient
  **/
  select?: PatientSelect | null
}

export type PatientIncludeArgs = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include: PatientInclude
}

export type PatientIncludeArgsOptional = {
  /**
   * Choose, which related nodes to fetch as well.
  **/
  include?: PatientInclude | null
}

export type ExtractPatientSelectArgs<S extends undefined | boolean | PatientSelectArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PatientSelectArgs
  ? S['select']
  : true

export type ExtractPatientIncludeArgs<S extends undefined | boolean | PatientIncludeArgsOptional> = S extends undefined
  ? false
  : S extends boolean
  ? S
  : S extends PatientIncludeArgs
  ? S['include']
  : true




/**
 * Deep Input Types
 */


export type PostWhereInput = {
  uuid?: string | StringFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  published?: boolean | BooleanFilter | null
  title?: string | StringFilter | null
  content?: string | NullableStringFilter | null
  kind?: PostKind | NullablePostKindFilter | null
  AND?: Enumerable<PostWhereInput> | null
  OR?: Enumerable<PostWhereInput> | null
  NOT?: Enumerable<PostWhereInput> | null
  author?: UserWhereInput | null
}

export type UserWhereInput = {
  id?: number | IntFilter | null
  email?: string | StringFilter | null
  name?: string | NullableStringFilter | null
  age?: number | IntFilter | null
  balance?: number | FloatFilter | null
  amount?: number | FloatFilter | null
  posts?: PostFilter | null
  role?: Role | RoleFilter | null
  AND?: Enumerable<UserWhereInput> | null
  OR?: Enumerable<UserWhereInput> | null
  NOT?: Enumerable<UserWhereInput> | null
}

export type IdCompoundUniqueInput = {
  id: number
}

export type UserWhereUniqueInput = {
  id?: number | null
  email?: string | null
}

export type UuidCompoundUniqueInput = {
  uuid: string
}

export type PostWhereUniqueInput = {
  uuid?: string | null
}

export type CategoryWhereInput = {
  name?: string | StringFilter | null
  slug?: string | StringFilter | null
  number?: number | IntFilter | null
  AND?: Enumerable<CategoryWhereInput> | null
  OR?: Enumerable<CategoryWhereInput> | null
  NOT?: Enumerable<CategoryWhereInput> | null
}

export type SlugNumberCompoundUniqueInput = {
  slug: string
  number: number
}

export type CategoryWhereUniqueInput = {
  slug_number?: SlugNumberCompoundUniqueInput | null
}

export type PatientWhereInput = {
  firstName?: string | StringFilter | null
  lastName?: string | StringFilter | null
  email?: string | StringFilter | null
  AND?: Enumerable<PatientWhereInput> | null
  OR?: Enumerable<PatientWhereInput> | null
  NOT?: Enumerable<PatientWhereInput> | null
}

export type FirstNameLastNameCompoundUniqueInput = {
  firstName: string
  lastName: string
}

export type PatientWhereUniqueInput = {
  firstName_lastName?: FirstNameLastNameCompoundUniqueInput | null
}

export type PostCreateWithoutAuthorInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published: boolean
  title: string
  content?: string | null
  kind?: PostKind | null
}

export type PostCreateManyWithoutAuthorInput = {
  create?: Enumerable<PostCreateWithoutAuthorInput> | null
  connect?: Enumerable<PostWhereUniqueInput> | null
}

export type UserCreateInput = {
  email: string
  name?: string | null
  age: number
  balance: number
  amount: number
  role: Role
  posts?: PostCreateManyWithoutAuthorInput | null
}

export type PostUpdateWithoutAuthorDataInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published?: boolean | null
  title?: string | null
  content?: string | null
  kind?: PostKind | null
}

export type PostUpdateWithWhereUniqueWithoutAuthorInput = {
  where: PostWhereUniqueInput
  data: PostUpdateWithoutAuthorDataInput
}

export type PostScalarWhereInput = {
  uuid?: string | StringFilter | null
  createdAt?: Date | string | DateTimeFilter | null
  updatedAt?: Date | string | DateTimeFilter | null
  published?: boolean | BooleanFilter | null
  title?: string | StringFilter | null
  content?: string | NullableStringFilter | null
  kind?: PostKind | NullablePostKindFilter | null
  AND?: Enumerable<PostScalarWhereInput> | null
  OR?: Enumerable<PostScalarWhereInput> | null
  NOT?: Enumerable<PostScalarWhereInput> | null
}

export type PostUpdateManyDataInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published?: boolean | null
  title?: string | null
  content?: string | null
  kind?: PostKind | null
}

export type PostUpdateManyWithWhereNestedInput = {
  where: PostScalarWhereInput
  data: PostUpdateManyDataInput
}

export type PostUpsertWithWhereUniqueWithoutAuthorInput = {
  where: PostWhereUniqueInput
  update: PostUpdateWithoutAuthorDataInput
  create: PostCreateWithoutAuthorInput
}

export type PostUpdateManyWithoutAuthorInput = {
  create?: Enumerable<PostCreateWithoutAuthorInput> | null
  connect?: Enumerable<PostWhereUniqueInput> | null
  set?: Enumerable<PostWhereUniqueInput> | null
  disconnect?: Enumerable<PostWhereUniqueInput> | null
  delete?: Enumerable<PostWhereUniqueInput> | null
  update?: Enumerable<PostUpdateWithWhereUniqueWithoutAuthorInput> | null
  updateMany?: Enumerable<PostUpdateManyWithWhereNestedInput> | null
  deleteMany?: Enumerable<PostScalarWhereInput> | null
  upsert?: Enumerable<PostUpsertWithWhereUniqueWithoutAuthorInput> | null
}

export type UserUpdateInput = {
  id?: number | null
  email?: string | null
  name?: string | null
  age?: number | null
  balance?: number | null
  amount?: number | null
  role?: Role | null
  posts?: PostUpdateManyWithoutAuthorInput | null
}

export type UserUpdateManyMutationInput = {
  id?: number | null
  email?: string | null
  name?: string | null
  age?: number | null
  balance?: number | null
  amount?: number | null
  role?: Role | null
}

export type UserCreateWithoutPostsInput = {
  email: string
  name?: string | null
  age: number
  balance: number
  amount: number
  role: Role
}

export type UserCreateOneWithoutPostsInput = {
  create?: UserCreateWithoutPostsInput | null
  connect?: UserWhereUniqueInput | null
}

export type PostCreateInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published: boolean
  title: string
  content?: string | null
  kind?: PostKind | null
  author: UserCreateOneWithoutPostsInput
}

export type UserUpdateWithoutPostsDataInput = {
  id?: number | null
  email?: string | null
  name?: string | null
  age?: number | null
  balance?: number | null
  amount?: number | null
  role?: Role | null
}

export type UserUpsertWithoutPostsInput = {
  update: UserUpdateWithoutPostsDataInput
  create: UserCreateWithoutPostsInput
}

export type UserUpdateOneRequiredWithoutPostsInput = {
  create?: UserCreateWithoutPostsInput | null
  connect?: UserWhereUniqueInput | null
  update?: UserUpdateWithoutPostsDataInput | null
  upsert?: UserUpsertWithoutPostsInput | null
}

export type PostUpdateInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published?: boolean | null
  title?: string | null
  content?: string | null
  kind?: PostKind | null
  author?: UserUpdateOneRequiredWithoutPostsInput | null
}

export type PostUpdateManyMutationInput = {
  uuid?: string | null
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  published?: boolean | null
  title?: string | null
  content?: string | null
  kind?: PostKind | null
}

export type CategoryCreateInput = {
  name: string
  slug: string
  number: number
}

export type CategoryUpdateInput = {
  name?: string | null
  slug?: string | null
  number?: number | null
}

export type CategoryUpdateManyMutationInput = {
  name?: string | null
  slug?: string | null
  number?: number | null
}

export type PatientCreateInput = {
  firstName: string
  lastName: string
  email: string
}

export type PatientUpdateInput = {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
}

export type PatientUpdateManyMutationInput = {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
}

export type StringFilter = {
  equals?: string | null
  not?: string | StringFilter | null
  in?: Enumerable<string> | null
  notIn?: Enumerable<string> | null
  lt?: string | null
  lte?: string | null
  gt?: string | null
  gte?: string | null
  contains?: string | null
  startsWith?: string | null
  endsWith?: string | null
}

export type DateTimeFilter = {
  equals?: Date | string | null
  not?: Date | string | DateTimeFilter | null
  in?: Enumerable<Date | string> | null
  notIn?: Enumerable<Date | string> | null
  lt?: Date | string | null
  lte?: Date | string | null
  gt?: Date | string | null
  gte?: Date | string | null
}

export type BooleanFilter = {
  equals?: boolean | null
  not?: boolean | BooleanFilter | null
}

export type NullableStringFilter = {
  equals?: string | null
  not?: string | null | NullableStringFilter
  in?: Enumerable<string> | null
  notIn?: Enumerable<string> | null
  lt?: string | null
  lte?: string | null
  gt?: string | null
  gte?: string | null
  contains?: string | null
  startsWith?: string | null
  endsWith?: string | null
}

export type NullablePostKindFilter = {
  equals?: PostKind | null
  not?: PostKind | null | NullablePostKindFilter
  in?: Enumerable<PostKind> | null
  notIn?: Enumerable<PostKind> | null
}

export type IntFilter = {
  equals?: number | null
  not?: number | IntFilter | null
  in?: Enumerable<number> | null
  notIn?: Enumerable<number> | null
  lt?: number | null
  lte?: number | null
  gt?: number | null
  gte?: number | null
}

export type FloatFilter = {
  equals?: number | null
  not?: number | FloatFilter | null
  in?: Enumerable<number> | null
  notIn?: Enumerable<number> | null
  lt?: number | null
  lte?: number | null
  gt?: number | null
  gte?: number | null
}

export type PostFilter = {
  every?: PostWhereInput | null
  some?: PostWhereInput | null
  none?: PostWhereInput | null
}

export type RoleFilter = {
  equals?: Role | null
  not?: Role | RoleFilter | null
  in?: Enumerable<Role> | null
  notIn?: Enumerable<Role> | null
}

export type UserOrderByInput = {
  id?: OrderByArg | null
  email?: OrderByArg | null
  name?: OrderByArg | null
  age?: OrderByArg | null
  balance?: OrderByArg | null
  amount?: OrderByArg | null
  role?: OrderByArg | null
}

export type PostOrderByInput = {
  uuid?: OrderByArg | null
  createdAt?: OrderByArg | null
  updatedAt?: OrderByArg | null
  published?: OrderByArg | null
  title?: OrderByArg | null
  content?: OrderByArg | null
  kind?: OrderByArg | null
}

export type CategoryOrderByInput = {
  name?: OrderByArg | null
  slug?: OrderByArg | null
  number?: OrderByArg | null
}

export type PatientOrderByInput = {
  firstName?: OrderByArg | null
  lastName?: OrderByArg | null
  email?: OrderByArg | null
}

/**
 * Batch Payload for updateMany & deleteMany
 */

export type BatchPayload = {
  count: number
}

/**
 * DMMF
 */
export declare const dmmf: DMMF.Document;
export {};
